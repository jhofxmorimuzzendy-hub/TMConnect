// log-helper.js
// Fungsi untuk mencatat aktivitas user ke Firebase Realtime Database

window.logActivity = async function(action, details, moduleName = null) {
    // Pastikan Firebase database tersedia
    if (!window.db) {
        console.warn("Firebase database not ready, log not saved");
        return;
    }
    
    // Ambil info user dari auth-check.js (currentUser, currentRole)
    let userId = null;
    let userEmail = 'Guest';
    let userRole = 'guest';
    
    if (window.currentUser) {
        userId = window.currentUser.uid;
        userEmail = window.currentUser.email || 'No Email';
        userRole = window.currentRole || 'guest';
    } else {
        // Cek guest mode
        const guestMode = localStorage.getItem('guestMode') === 'true';
        if (guestMode) {
            userEmail = 'Guest (Tamu)';
            userRole = 'guest';
        }
    }
    
    const logEntry = {
        timestamp: firebase.database.ServerValue.TIMESTAMP, // server time
        timestampLocal: new Date().toISOString(),
        userId: userId,
        userEmail: userEmail,
        userRole: userRole,
        action: action,
        module: moduleName || document.title || 'Unknown',
        details: details || '',
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
    };
    
    try {
        // Simpan ke path logs/{timestamp} (menggunakan push agar urut)
        await window.db.ref('logs').push(logEntry);
        console.log("Activity logged:", action);
    } catch (err) {
        console.error("Failed to save log:", err);
    }
};

// Helper untuk logging error
window.logError = function(errorMessage, context) {
    window.logActivity('ERROR', `${errorMessage} | Context: ${context || ''}`, 'System');
};