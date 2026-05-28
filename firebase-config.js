// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCqlMNr1AwxlYmlz0LEPV2saw1eBnozdQg",
  authDomain: "monitoring-tvri-30c22.firebaseapp.com",
  projectId: "monitoring-tvri-30c22",
  storageBucket: "monitoring-tvri-30c22.firebasestorage.app",
  messagingSenderId: "1097402217850",
  appId: "1:1097402217850:web:679f27336b47cd67e3d2c3",
  measurementId: "G-8PYWHG4MX1",
  // 🔥 TAMBAHKAN baris ini (URL database region asia-southeast1)
  databaseURL: "https://monitoring-tvri-30c22-default-rtdb.asia-southeast1.firebasedatabase.app"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.database();
  console.log("✅ Firebase connected to correct region");
} else {
  console.error("❌ Firebase SDK not loaded");
}