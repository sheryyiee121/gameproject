import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_DOC = doc(db, 'adminConfig', 'main');
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

function sessionSecret() {
    return process.env.ADMIN_SESSION_SECRET
        || process.env.ADMIN_PASSWORD
        || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        || 'nexmine-admin-session';
}

function bootstrapPassword() {
    return process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
}

export function validateNewPassword(password: string, confirm: string) {
    if (!password || password.length < 8) {
        return 'New password must be at least 8 characters.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return 'New password must include at least one letter and one number.';
    }
    if (password !== confirm) {
        return 'New password and confirmation do not match.';
    }
    return null;
}

export async function getAdminPasswordHash() {
    const snap = await getDoc(ADMIN_DOC);
    const stored = snap.exists() ? snap.data()?.passwordHash : null;
    if (typeof stored === 'string' && stored.length > 0) return stored;
    const hash = await bcrypt.hash(bootstrapPassword(), BCRYPT_ROUNDS);
    try {
        await setDoc(ADMIN_DOC, {
            passwordHash: hash,
            updatedAt: new Date().toISOString(),
            createdAt: snap.exists() ? snap.data()?.createdAt || new Date().toISOString() : new Date().toISOString(),
        }, { merge: true });
    } catch {
        // First-run write can fail under locked Firestore rules; still allow env-based login.
    }
    return hash;
}

export async function verifyAdminPassword(password: string) {
    const hash = await getAdminPasswordHash();
    return bcrypt.compare(password, hash);
}

export async function setAdminPassword(newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await setDoc(ADMIN_DOC, {
        passwordHash,
        updatedAt: new Date().toISOString(),
    }, { merge: true });
}

export function createAdminSessionToken() {
    const payload = {
        role: 'admin',
        nonce: randomBytes(16).toString('hex'),
        exp: Date.now() + SESSION_TTL_MS,
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
    return `${body}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
    if (!token || !token.includes('.')) return false;
    const [body, sig] = token.split('.');
    const expected = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        return payload?.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now();
    } catch {
        return false;
    }
}

export function adminCookieHeader(token: string) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return `nexmine_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`;
}

export function clearAdminCookieHeader() {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return `nexmine_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function readAdminCookie(request: Request) {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|;\s*)nexmine_admin_session=([^;]+)/);
    return match?.[1];
}
