/**
 * data.js — Ambil produk dari Google Sheets untuk @cuan.affiliate_
 *
 * CARA UPDATE PRODUK:
 * Cukup edit di Google Sheets kamu — tidak perlu ubah kode ini.
 *
 * KOLOM YANG WAJIB ADA DI SHEET (nama header harus sama persis):
 *   id | title | category | img | link
 */

const SHEET_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtU_jHhHzk1k2GXDjF45NIezpuPlWdv00wU9Ux0O1NMtOElGOdJDBdGPVPaRRWlBH-gTNfF-tpaUcV/pub?output=csv';

// Kolom wajib yang harus ada di spreadsheet
const REQUIRED_COLUMNS = ['id', 'title', 'link'];

function loadFromSheet() {
    // Cache busting agar data selalu fresh
    const fetchUrl = SHEET_URL + '&nocache=' + Date.now();

    Papa.parse(fetchUrl, {
        download: true,
        header: true,
        skipEmptyLines: true, // ✅ PapaParse langsung skip baris kosong
        complete: function (results) {

            // ✅ Validasi: cek apakah kolom wajib ada di spreadsheet
            const headers = results.meta.fields || [];
            const missingCols = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
            if (missingCols.length > 0) {
                showFetchError(
                    `Kolom berikut tidak ditemukan di spreadsheet: <b>${missingCols.join(', ')}</b><br>
                     Pastikan baris pertama sheet berisi: id, title, category, img, link`
                );
                return;
            }

            // ✅ Filter & normalisasi data
            const cleaned = results.data
                .filter(row => row.id && row.title && row.title.trim() !== "")
                .map(row => ({
                    id:       row.id.trim(),
                    title:    row.title.trim(),
                    category: (row.category || "Lainnya").trim(),
                    img:      (row.img || "").trim(),
                    link:     (row.link || "#").trim(),
                }));

            if (cleaned.length === 0) {
                showFetchError("Spreadsheet kamu kosong atau semua baris tidak valid.");
                return;
            }

            // ✅ Panggil initData dari index.html
            initData(cleaned);
        },

        error: function (err) {
            console.error("Gagal mengambil data dari Google Sheets:", err);
            showFetchError(
                "Gagal memuat produk. Pastikan spreadsheet sudah di-publish ke web.<br>" +
                '<a href="https://support.google.com/docs/answer/183965" target="_blank" ' +
                'style="color:#ff6b81;">Cara publish Google Sheet ↗</a>'
            );
        }
    });
}

// ✅ Tampilkan pesan error di grid jika fetch gagal
function showFetchError(html) {
    // Hapus skeleton
    ['skeleton1', 'skeleton2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.querySelectorAll('.product-card, .error-state').forEach(el => el.remove());

    const errEl = document.createElement('div');
    errEl.className = 'error-state';
    errEl.style.cssText = `
        grid-column: span 2;
        text-align: center;
        padding: 36px 16px;
        font-size: 13px;
        color: #8a6070;
        line-height: 1.7;
    `;
    errEl.innerHTML = `<div style="font-size:32px;margin-bottom:8px">⚠️</div>${html}`;
    grid.insertBefore(errEl, document.getElementById('noResults'));
}

// Jalankan saat file ini dipanggil
loadFromSheet();
