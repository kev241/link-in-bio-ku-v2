let products = [];
// Link CSV sempurna milikmu
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtU_jHhHzk1k2GXDjF45NIezpuPlWdv00wU9Ux0O1NMtOElGOdJDBdGPVPaRRWlBH-gTNfF-tpaUcV/pub?gid=0&single=true&output=csv';

function initData() {
    // Jurus Cache Buster: Memaksa browser mengambil data terbaru setiap detik
    const fetchUrl = sheetUrl + '&nocache=' + new Date().getTime();

    Papa.parse(fetchUrl, {
        download: true,
        header: true,
        complete: function (results) {
            // Satpam Data: Hanya loloskan baris yang punya ID dan Title (mencegah error baris kosong)
            products = results.data.filter(row => row.id && row.title && row.title.trim() !== "");

            // Mengirim data terbaru ke layar
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

// Menjalankan proses saat website dibuka
initData();