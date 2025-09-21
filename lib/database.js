// CREATE DATABASE By G4NGGAAA

const axios = require('axios');
const chalk = require('chalk');

/**
 * Tautan Base64 yang menunjuk ke file database.json.
 * Gunakan https://www.base64decode.org/ untuk melihat isi tautan.
 */
const ENCODED_GITHUB_DATABASE_URL = 'aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0c0TkdHQUFBL21hbmFnZS1nNG5nZ2FhYS9tYWluL2RhdGFiYXNlLmpzb24=';

/**
 * Fungsi untuk mendekode string Base64.
 * @param {string} encodedString - String yang dienkode dalam Base64.
 * @returns {string} - String yang sudah didekode.
 */
function decodeBase64(encodedString) {
    return Buffer.from(encodedString, 'base64').toString('utf-8');
}

/**
 * Memverifikasi nomor telepon dari database JSON di GitHub.
 * @param {string} phoneNumber - Nomor telepon yang akan diverifikasi.
 * @returns {Promise<boolean>} - Mengembalikan true jika nomor terdaftar, false jika tidak.
 */
async function verifyNumber(phoneNumber) {
    try {
        const GITHUB_DATABASE_URL = decodeBase64(ENCODED_GITHUB_DATABASE_URL);
        console.log(chalk.yellow('Mengecek nomor dari database JSON online...'));
        const response = await axios.get(GITHUB_DATABASE_URL);
        const data = response.data;
        let normalizedUserNumber = phoneNumber.startsWith('08') ? '62' + phoneNumber.substring(1) : phoneNumber;

        // ================== KODE DEBUGGING ==================
        console.log(chalk.cyan('--- Mulai Debug ---'));
        console.log('Nomor yang diinput (sudah dinormalisasi):', normalizedUserNumber);
        console.log('Tipe data yang diterima dari URL:', typeof data);
        console.log('Data mentah yang diterima dari URL:', JSON.stringify(data, null, 2));
        if (Array.isArray(data)) {
            console.log('Nomor pertama dalam array dari URL:', data[0]);
            console.log('Apakah input sama persis dengan data di URL?', data[0] === normalizedUserNumber);
        }
        console.log(chalk.cyan('--- Akhir Debug ---'));
        // ====================================================

        if (!Array.isArray(data)) {
            console.error(chalk.red('Format data di URL bukan array.'));
            return false;
        }

        const allowedNumbers = data;
        return allowedNumbers.includes(normalizedUserNumber);

    } catch (error) {
        console.error(chalk.red('Gagal mengambil atau memproses database nomor:'), error.message);
        return false;
    }
}

// Ekspor fungsi agar bisa digunakan di file lain
module.exports = {
    verifyNumber
};