let products = [];
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtU_jHhHzk1k2GXDjF45NIezpuPlWdv00wU9Ux0O1NMtOElGOdJDBdGPVPaRRWlBH-gTNfF-tpaUcV/pub?output=csv';

function initData() {
    const fetchUrl = sheetUrl + '&nocache=' + new Date().getTime();

    Papa.parse(fetchUrl, {
        download: true,
        header: true,
        complete: function (results) {
            // Satpam Data: Cegah baris kosong masuk
            products = results.data.filter(row => row.id && row.title && row.title.trim() !== "");

            // Perintah render ke layar HTML
            if (typeof renderCategories === 'function') {
                renderCategories();
            }
            if (typeof renderProducts === 'function') {
                renderProducts(products);
            }
        },
        error: function (err) {
            console.error("Error fetching data:", err);
        }
    });
}

// Jalankan saat file dipanggil
initData();