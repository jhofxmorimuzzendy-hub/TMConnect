// timestamp-editor.js
// Fungsi untuk admin mengedit tanggal dan waktu foto watermark
window.getEditableTimestamp = async function(role, defaultDate) {
    if (role !== 'admin') return defaultDate;

    // Tanya apakah ingin mengedit
    if (!confirm("Anda login sebagai ADMIN.\nApakah ingin mengatur tanggal & waktu foto (watermark) secara manual?")) {
        return defaultDate;
    }

    // Format default untuk prompt
    const defaultDateStr = defaultDate.toISOString().slice(0, 10); // YYYY-MM-DD
    const newDateStr = prompt("Masukkan TANGGAL (format: YYYY-MM-DD):", defaultDateStr);
    if (newDateStr === null) return defaultDate;
    const newDate = new Date(newDateStr);
    if (isNaN(newDate.getTime())) {
        alert("Format tanggal salah! Gunakan YYYY-MM-DD. Menggunakan waktu default.");
        return defaultDate;
    }

    const defaultTimeStr = defaultDate.toTimeString().slice(0, 5); // HH:MM
    const newTimeStr = prompt("Masukkan WAKTU (format: HH:MM, 24 jam):", defaultTimeStr);
    if (newTimeStr === null) return defaultDate;
    const [hours, minutes] = newTimeStr.split(':');
    if (!hours || !minutes || isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) {
        alert("Format waktu salah! Gunakan HH:MM. Menggunakan waktu default.");
        return defaultDate;
    }

    newDate.setHours(parseInt(hours), parseInt(minutes), 0);
    return newDate;
};