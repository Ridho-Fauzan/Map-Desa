/*
 * DATA PETA DESA BEBERAN
 * ------------------------------------------------------------------
 * Semua data peta ada di file ini.
 * Koordinat GeoJSON ditulis [longitude, latitude] (bujur dulu, lalu lintang).
 *
 * Sumber data teks: https://desabeberan.wordpress.com/profi/ (profil desa, data ±2010)
 *
 * PENTING: batas desa, batas kampung, dan posisi fasilitas di bawah masih
 * PERKIRAAN KASAR. OpenStreetMap belum punya batas desa Beberan, jadi posisinya
 * ditaksir dari letak desa tetangga (Pulo, Singamerta, Sentul, Keserangan).
 * Ganti dengan batas asli:
 *   1. Buka https://geojson.io, ganti basemap ke "Satellite"
 *   2. Gambar polygon batas desa & tiap kampung, taruh titik fasilitas
 *   3. Salin koordinatnya ke variabel di bawah, lalu set perkiraan: false
 */

// ---------- Info umum desa ----------
const DESA = {
  nama: "Desa Beberan",
  kecamatan: "Kecamatan Ciruas",
  kabupaten: "Kabupaten Serang",
  provinsi: "Banten",
  luas: "1.689 ha",
  penduduk: 3346,
  rumah: 1023,
  deskripsi:
    "Desa agraris penghasil beras, salah satu pemasok beras untuk Bulog dengan banyak pabrik penggilingan padi. " +
    "Berbatasan dengan Desa Pulo (utara), Desa Keserangan (selatan), Desa Singamerta (barat), " +
    "dan Desa Sentul, Kec. Kragilan (timur).",
  perkiraan: true, // ubah ke false kalau batas sudah diganti data asli
  batas: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[
        [106.247, -6.124],
        [106.262, -6.122],
        [106.268, -6.130],
        [106.266, -6.142],
        [106.252, -6.145],
        [106.245, -6.136],
        [106.247, -6.124]
      ]]
    }
  }
};

// ---------- Wilayah kampung ----------
// Luas dari profil desa. Polygon masih perkiraan.
const DUSUN = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        nama: "Kampung Beberan",
        luas: "588,48 ha",
        warna: "#f59e0b",
        deskripsi: "Kampung terluas di Desa Beberan."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.247, -6.124], [106.262, -6.122], [106.257, -6.133],
          [106.245, -6.136], [106.247, -6.124]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        nama: "Kampung Ciwuni",
        luas: "403,46 ha",
        warna: "#10b981",
        deskripsi: "Isi deskripsi kampung di sini."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.262, -6.122], [106.268, -6.130], [106.266, -6.142],
          [106.257, -6.133], [106.262, -6.122]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        nama: "Kampung Cibau",
        luas: "217,53 ha",
        warna: "#3b82f6",
        deskripsi: "Isi deskripsi kampung di sini."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.266, -6.142], [106.252, -6.145], [106.257, -6.133],
          [106.266, -6.142]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        nama: "Kampung Cimiung",
        luas: "479,80 ha",
        warna: "#ec4899",
        deskripsi: "Isi deskripsi kampung di sini."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.252, -6.145], [106.245, -6.136], [106.257, -6.133],
          [106.252, -6.145]
        ]]
      }
    }
  ]
};

// ---------- Kategori fasilitas (ikon + warna) ----------
const KATEGORI = {
  pemerintahan: { label: "Pemerintahan", ikon: "🏛️", warna: "#ef4444" },
  ibadah:       { label: "Tempat Ibadah", ikon: "🕌", warna: "#22c55e" },
  pendidikan:   { label: "Pendidikan",    ikon: "🏫", warna: "#3b82f6" },
  kesehatan:    { label: "Kesehatan",     ikon: "🏥", warna: "#ec4899" },
  ekonomi:      { label: "Ekonomi/UMKM",  ikon: "🌾", warna: "#f59e0b" },
  olahraga:     { label: "Olahraga",      ikon: "⚽", warna: "#14b8a6" }
};

// ---------- Titik fasilitas ----------
// Jenis fasilitas diambil dari profil desa. Nama & posisi masih contoh:
// geser koordinatnya ke lokasi asli, lalu set perkiraan: false.
// "foto" boleh dikosongkan, atau isi URL / path gambar (misal "img/kantor.jpg").
const titik = (nama, kategori, lng, lat, deskripsi, foto = "", perkiraan = true) => ({
  type: "Feature",
  properties: { nama, kategori, deskripsi, foto, perkiraan },
  geometry: { type: "Point", coordinates: [lng, lat] }
});

const FASILITAS = {
  type: "FeatureCollection",
  features: [
    titik("Kantor Desa Beberan", "pemerintahan", 106.2565, -6.1325,
      "Pelayanan administrasi warga."),
    titik("Masjid Kampung Beberan", "ibadah", 106.2530, -6.1285,
      "Ganti dengan nama masjid yang sebenarnya."),
    titik("TK Desa Beberan", "pendidikan", 106.2545, -6.1310,
      "Taman Kanak-kanak."),
    titik("SD Negeri Beberan", "pendidikan", 106.2600, -6.1280,
      "Sekolah Dasar."),
    titik("MI Beberan", "pendidikan", 106.2510, -6.1380,
      "Madrasah Ibtidaiyah."),
    titik("Posyandu & Bidan Desa", "kesehatan", 106.2620, -6.1350,
      "Layanan kesehatan ibu dan anak."),
    titik("Lapangan Sepak Bola", "olahraga", 106.2585, -6.1395,
      "Lapangan sepak bola desa."),
    titik("Penggilingan Padi", "ekonomi", 106.2640, -6.1290,
      "Salah satu penggilingan padi pemasok beras Bulog."),
    titik("Kerajinan Bata", "ekonomi", 106.2500, -6.1260,
      "Industri rumah tangga kerajinan bata."),
    titik("Kerajinan Sapu", "ekonomi", 106.2550, -6.1420,
      "Industri rumah tangga kerajinan sapu.")
  ]
};
