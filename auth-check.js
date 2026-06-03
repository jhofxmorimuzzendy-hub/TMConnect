// auth-check.js
// Memeriksa status login dan role, lalu menyesuaikan tampilan
// Juga menyediakan fungsi logout dan helper role

let currentUser = null;
let currentRole = 'guest'; // 'guest', 'user', 'admin'

function updateUIBasedOnRole() {
  // Elemen-elemen yang perlu disembunyikan untuk tamu/user/admin
  const adminOnlyElements = document.querySelectorAll('.admin-only');
  const userOnlyElements = document.querySelectorAll('.user-only');
  const guestOnlyElements = document.querySelectorAll('.guest-only');
  const editButtons = document.querySelectorAll('.btn-edit-data'); // tombol edit data (admin)

  if (currentRole === 'admin') {
    adminOnlyElements.forEach(el => el.style.display = '');
    userOnlyElements.forEach(el => el.style.display = '');
    guestOnlyElements.forEach(el => el.style.display = 'none');
    editButtons.forEach(btn => btn.style.display = 'inline-flex');
    // enable semua input form (jika ada)
    document.querySelectorAll('form input, form select, form textarea, form button[type="submit"]').forEach(el => {
      if (!el.hasAttribute('data-always-enabled')) el.disabled = false;
    });
  } 
  else if (currentRole === 'user') {
    adminOnlyElements.forEach(el => el.style.display = 'none');
    userOnlyElements.forEach(el => el.style.display = '');
    guestOnlyElements.forEach(el => el.style.display = 'none');
    editButtons.forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('form input, form select, form textarea, form button[type="submit"]').forEach(el => {
      if (!el.hasAttribute('data-always-enabled')) el.disabled = false;
    });
  } 
  else { // guest
    adminOnlyElements.forEach(el => el.style.display = 'none');
    userOnlyElements.forEach(el => el.style.display = 'none');
    guestOnlyElements.forEach(el => el.style.display = '');
    editButtons.forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('form input, form select, form textarea, form button[type="submit"]').forEach(el => {
      if (!el.hasAttribute('data-always-enabled')) el.disabled = true;
    });
  }

  // Tampilkan nama user / role di header jika ada
  const userInfoSpan = document.getElementById('userRoleDisplay');
  if (userInfoSpan) {
    if (currentRole === 'guest') userInfoSpan.innerHTML = '<i class="fas fa-user-friends"></i> Tamu';
    else if (currentRole === 'user') userInfoSpan.innerHTML = `<i class="fas fa-user"></i> ${currentUser?.email || 'User'}`;
    else if (currentRole === 'admin') userInfoSpan.innerHTML = `<i class="fas fa-user-shield"></i> Admin: ${currentUser?.email || 'Admin'}`;
  }

  // Tampilkan tombol logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    if (currentRole !== 'guest') logoutBtn.style.display = 'inline-flex';
    else logoutBtn.style.display = 'none';
  }

  // Tampilkan link ke User Control hanya untuk admin
  const adminLink = document.getElementById('adminControlLink');
  if (adminLink) {
    if (currentRole === 'admin') adminLink.style.display = 'inline-flex';
    else adminLink.style.display = 'none';
  }
}

// Fungsi untuk mengambil role dari database berdasarkan UID
async function fetchUserRole(uid) {
  if (!uid) return 'guest';
  try {
    const snapshot = await window.db.ref(`users/${uid}/role`).once('value');
    const role = snapshot.val();
    return role === 'admin' ? 'admin' : (role === 'user' ? 'user' : 'guest');
  } catch (err) {
    console.error("Gagal mengambil role:", err);
    return 'guest';
  }
}

// Fungsi logout
function logoutUser() {
  window.auth.signOut().then(() => {
    window.location.href = 'login.html';
  }).catch(err => alert('Logout gagal: ' + err.message));
}

// Inisialisasi auth state observer
function initAuthCheck() {
  window.auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      currentRole = await fetchUserRole(user.uid);
      // Simpan role di localStorage untuk akses cepat (opsional)
      localStorage.setItem('userRole', currentRole);
      localStorage.setItem('userEmail', user.email);
    } else {
      currentUser = null;
      currentRole = 'guest';
      localStorage.setItem('userRole', 'guest');
      localStorage.removeItem('userEmail');
    }
    updateUIBasedOnRole();
    
    // Event custom untuk modul-modul yang butuh reaksi perubahan role
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role: currentRole, user: currentUser } }));
  });
}

// Jalankan saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initAuthCheck();
  // Pasang event listener untuk tombol logout (jika ada)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
});