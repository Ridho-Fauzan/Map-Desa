# Website Desa Beberan

Website layanan dan profil Desa Beberan, Kecamatan Ciruas, Kabupaten Serang, Banten. Situs statis (HTML, CSS, JavaScript) tanpa build dan tanpa server.

## Halaman

| Halaman | Isi |
|---------|-----|
| `index.html` | Beranda: peta mini, statistik desa, layanan cepat, potensi, ajakan aspirasi |
| `profil.html` | Tentang desa, visi & misi, batas wilayah, luas kampung, grafik penduduk, potensi, seni budaya |
| `layanan.html` | Persyaratan surat (dengan checklist berkas), jam pelayanan + status buka/tutup, form aspirasi via WhatsApp |
| `peta.html` | Peta interaktif dari citra satelit: batas desa, kampung, fasilitas |

## Struktur

```
css/style.css   gaya seluruh situs
css/peta.css    gaya khusus halaman peta
js/data.js      SEMUA DATA: info desa, batas, kampung, fasilitas, kontak, profil, layanan
js/main.js      header, footer, animasi, helper WhatsApp (dipakai semua halaman)
js/beranda.js   js/profil.js   js/layanan.js   js/peta.js   script per halaman
```

Untuk mengubah isi website, cukup edit `js/data.js`.

## Yang perlu diisi

- `KONTAK.whatsapp` di `js/data.js`: nomor WhatsApp kantor desa (format `62xxxxxxxxxx`). Selama kosong, tombol WhatsApp menyalin pesan ke clipboard.
- `KONTAK.jam`: jam pelayanan (saat ini masih contoh).
- Batas desa, batas kampung, dan posisi fasilitas (saat ini masih perkiraan). Setelah diganti data asli, set `perkiraan: false`.
- Persyaratan surat di `LAYANAN`: sesuaikan dengan ketentuan kantor desa.

Link langsung yang didukung:
- `layanan.html#domisili` membuka layanan tertentu (pakai `id` di `LAYANAN`)
- `peta.html#Kampung%20Cibau` atau `peta.html#Kantor%20Desa%20Beberan` zoom ke kampung/tempat

## Deploy

Vercel: Framework Preset **Other**, Build Command dan Output Directory dikosongkan.

## Sumber data

Profil, penduduk, potensi, dan budaya dari https://desabeberan.wordpress.com/profi/ (data sekitar tahun 2010).

Pustaka: [Leaflet](https://leafletjs.com), [Chart.js](https://www.chartjs.org), citra satelit Esri World Imagery.
