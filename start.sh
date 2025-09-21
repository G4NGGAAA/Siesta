#!/bin/bash
# ==============================================================================
# Script Starter untuk Siesta Bot (G4NGGAAA/Siesta)
# Dibuat oleh Gemini
#
# Cara Penggunaan:
# 1. Simpan script ini sebagai 'start.sh' di folder bot Anda.
# 2. Berikan izin eksekusi: chmod +x start.sh
# 3. Jalankan dengan: ./start.sh
# ==============================================================================

# ---- Definisi Variabel Warna & Teks ----
MERAH='\033[1;31m'
HIJAU='\033[1;32m'
KUNING='\033[1;33m'
BIRU='\033[1;34m'
MAGENTA='\033[1;35m'
CYAN='\033[1;36m'
NC='\033[0m' # No Color / Reset

# ---- Fungsi untuk Tampilan ----

# Fungsi untuk membersihkan layar dan menampilkan banner utama
function tampilkan_banner() {
    clear
    echo -e "${CYAN}"
    echo "  ███████╗██╗███████╗███████╗████████╗ █████╗  "
    echo "  ██╔════╝██║██╔════╝██╔════╝╚══██╔══╝██╔══██╗ "
    echo "  ███████╗██║█████╗  ███████╗    ██║   ███████║ "
    echo "  ╚════██║██║██╔══╝  ╚════██║    ██║   ██╔══██║ "
    echo "  ███████║██║███████╗ ███████║   ██║  ██║  ██║ "
    echo "  ╚╚══════╝╚═╝╚══════╝╚══════╝  ╚═╝  ╚═╝  ╚═╝ "
    echo -e "${NC}"
    echo -e "${KUNING}            Bot Starter for G4NGGAAA/Siesta${NC}"
    echo "----------------------------------------------------"
    sleep 1
}

# Fungsi untuk mencetak header setiap langkah
function print_header() {
    echo -e "\n${MAGENTA}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC} ${KUNING}$(printf '%-50s' "$1")${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════╝${NC}"
    sleep 1
}

# Fungsi untuk mencetak status proses dengan animasi sederhana
function print_status() {
    echo -e "[${CYAN}*${NC}] ${1}"
}

# ---- Script Utama Dimulai ----

tampilkan_banner

# LANGKAH 1: Memeriksa dan mengambil pembaruan dari Git
print_header "LANGKAH 1: CEK PEMBARUAN DARI GITHUB"
print_status "Menarik pembaruan terbaru (git pull)..."
if git pull; then
    echo -e "[${HIJAU}✓${NC}] Pembaruan berhasil ditarik."
else
    echo -e "[${MERAH}!${NC}] Gagal menarik pembaruan. Mungkin tidak ada koneksi internet atau bukan repositori git."
fi

# LANGKAH 2: Menginstall/memperbarui dependensi (modul)
print_header "LANGKAH 2: INSTALL DEPENDENSI NODE.JS"
print_status "Menjalankan 'npm install'. Proses ini mungkin memakan waktu..."
npm install
echo -e "[${HIJAU}✓${NC}] Semua dependensi telah terpasang dengan sukses."

# LANGKAH 3: Proses Konfigurasi
print_header "LANGKAH 3: KONFIGURASI BOT"
echo -e "${KUNING}PERHATIAN:${NC} Script akan membuka file ${MERAH}config.js${NC}."
echo "Pastikan Anda mengisi semua data yang diperlukan seperti nomor owner."
echo -e "Untuk menyimpan & keluar: Tekan ${HIJAU}CTRL+X${NC}, lalu ${HIJAU}Y${NC}, lalu ${HIJAU}ENTER${NC}."
read -p "Tekan [ENTER] untuk melanjutkan ke editor konfigurasi..."

# Membuka editor nano untuk file config.js di direktori root
nano config.js

echo -e "[${HIJAU}✓${NC}] File konfigurasi telah ditutup."

# LANGKAH 4: Menjalankan Bot
print_header "LANGKAH 4: MENJALANKAN SIESTA BOT"
print_status "Semua persiapan selesai. Bot akan dimulai dalam 3 detik..."
sleep 3
echo -e "${HIJAU}Bot sedang online! Untuk menghentikan, tekan CTRL+C di terminal ini.${NC}\n"

# Menjalankan bot menggunakan 'npm start' yang setara dengan 'node index.js'
npm start

# Pesan yang muncul setelah bot berhenti (misalnya dengan CTRL+C)
echo -e "\n${MERAH}=======================================${NC}"
echo -e "${MERAH}  Proses bot Siesta telah dihentikan.  ${NC}"
echo -e "${MERAH}=======================================${NC}"

