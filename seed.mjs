import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBV0IWqAqBRUk0ld5YMYLEMxxVuU-3z2-w",
    authDomain: "game-f7cd2.firebaseapp.com",
    projectId: "game-f7cd2",
    storageBucket: "game-f7cd2.firebasestorage.app",
    messagingSenderId: "743780669739",
    appId: "1:743780669739:web:720d3bbedf88ef67e3cd6e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Seeding Database directly with dummy data...");
    const names = ['chris', 'sarah', 'michael', 'jessica', 'hassan'];

    for (let string of names) {
        const uid = Math.floor(10000000 + Math.random() * 90000000).toString();
        await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: `${string}@nexmine.net`,
            password: "password123",
            isBlocked: false,
            balances: {
                usdt: Math.floor(Math.random() * 900) + 50,
                usdc: 0
            },
            tier: "Bronze",
            createdAt: new Date().toISOString()
        });
        console.log(`Added Dummy User: ${string}@nexmine.net`);
    }

    console.log("Successfully loaded 5 Dummy accounts into Firebase!");
    process.exit(0);
}

run();
