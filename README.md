# Peta Interaktif Desa Beberan

Peta interaktif Desa Beberan, Kecamatan Ciruas, Kabupaten Serang, Banten. Dibuat dengan [Leaflet](https://leafletjs.com) di atas citra satelit Esri World Imagery.

## Fitur

- Citra satelit + label jalan, bisa ganti ke peta jalan OpenStreetMap
- Batas desa dengan area luar desa digelapkan
- Wilayah 4 kampung (Beberan, Ciwuni, Cibau, Cimiung) yang bisa di-hover dan diklik
- Titik fasilitas dengan ikon per kategori dan popup info
- Pencarian tempat, filter kategori, daftar tempat, legenda
- Tampilan mobile

## Struktur

| File | Isi |
|------|-----|
| `index.html` | Halaman utama |
| `style.css` | Tampilan |
| `app.js` | Logika peta |
| `data.js` | **Semua data peta** (info desa, batas, kampung, fasilitas) |

Untuk mengubah isi peta, cukup edit `data.js`.

## Menjalankan

Situs statis tanpa build. Buka `index.html` di browser, atau deploy folder ini ke Vercel / Netlify / Cloudflare Pages (framework preset: **Other**, tanpa build command).

## Catatan data

Data teks diambil dari profil desa di https://desabeberan.wordpress.com/profi/ (data sekitar 2010).

Batas desa, batas kampung, dan posisi fasilitas **masih perkiraan**. Ganti dengan data asli, lalu set `perkiraan: false` di `data.js`.
