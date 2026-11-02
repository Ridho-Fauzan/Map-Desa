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
  batasWilayah: {
    utara: "Desa Pulo",
    selatan: "Desa Keserangan",
    barat: "Desa Singamerta",
    timur: "Desa Sentul (Kec. Kragilan)"
  },
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

// ==================================================================
// KONTAK & JAM PELAYANAN
// ==================================================================
const KONTAK = {
  alamat: "Kantor Desa Beberan, Kecamatan Ciruas, Kabupaten Serang, Banten",
  // Isi nomor WhatsApp kantor desa dengan format 62xxxxxxxxxx (tanpa + dan tanpa 0 di depan).
  // Selama masih kosong, tombol WhatsApp akan menyalin pesan ke clipboard.
  whatsapp: "",
  email: "",
  // hari: 0 = Minggu, 1 = Senin, ..., 6 = Sabtu. Jam dalam WIB.
  // MASIH CONTOH: sesuaikan dengan jam pelayanan kantor desa.
  jam: [
    { label: "Senin – Kamis", hari: [1, 2, 3, 4], buka: "08:00", tutup: "15:00" },
    { label: "Jumat",         hari: [5],          buka: "08:00", tutup: "11:00" },
    { label: "Sabtu – Minggu", hari: [6, 0],      buka: null,    tutup: null }
  ]
};

// ==================================================================
// PROFIL DESA (sumber: https://desabeberan.wordpress.com/profi/, data ±2010)
// ==================================================================
const PROFIL = {
  tahunData: 2010,
  sumber: "https://desabeberan.wordpress.com/profi/",
  tentang:
    "Desa Beberan adalah salah satu desa di Kecamatan Ciruas, Kabupaten Serang, Banten. " +
    "Wilayahnya terbagi menjadi empat kampung: Beberan, Ciwuni, Cibau, dan Cimiung. " +
    "Lahan desa sebagian besar dipakai untuk persawahan, permukiman, dan industri, didukung saluran irigasi. " +
    "Desa Beberan dikenal sebagai salah satu pemasok beras untuk Bulog, dengan banyak pabrik penggilingan padi.",
  visi: "Desa yang Mandiri dan Sejahtera",
  misi: [
    "Meningkatkan pertumbuhan ekonomi dan kesehatan masyarakat melalui prasarana jalan desa.",
    "Melengkapi pembangunan prasarana yang mendukung kelancaran kegiatan ekonomi, pendidikan, kesehatan, serta sosial dan budaya.",
    "Mengoptimalkan sumber daya lahan di bidang pertanian untuk menunjang ekonomi masyarakat desa.",
    "Membangun sumber daya manusia dengan mengoptimalkan sarana yang ada untuk meningkatkan harkat, martabat, dan kesadaran hidup warga.",
    "Mengoptimalkan peran kelembagaan desa seperti LPM, BPD, PKK, dan Karang Taruna.",
    "Meningkatkan kapasitas perangkat desa, staf desa, dan RT/RW."
  ],
  keunggulan: [
    { ikon: "🛣️", nama: "Dekat jalan provinsi" },
    { ikon: "🏪", nama: "Dekat Pasar Ciruas" },
    { ikon: "🏭", nama: "Dekat kawasan industri" },
    { ikon: "🚌", nama: "Dekat terminal bus AKAP" },
    { ikon: "👥", nama: "Pasar tenaga kerja & konsumsi" }
  ],
  potensi: [
    { ikon: "🌾", nama: "Beras", deskripsi: "Salah satu pemasok beras untuk Bulog, berpotensi jadi pemasok tingkat provinsi." },
    { ikon: "⚙️", nama: "Penggilingan Padi", deskripsi: "Jumlah pabrik penggilingan padi relatif banyak." },
    { ikon: "🧱", nama: "Kerajinan Bata", deskripsi: "Industri rumah tangga pembuatan bata." },
    { ikon: "🧹", nama: "Kerajinan Sapu", deskripsi: "Industri rumah tangga pembuatan sapu." },
    { ikon: "🪣", nama: "Abu Gosok", deskripsi: "Industri rumah tangga penghasil abu gosok." },
    { ikon: "🧪", nama: "Silika", deskripsi: "Industri bahan kimia dasar (silika / carbon white)." }
  ],
  kesenian: [
    { ikon: "🥋", nama: "Pencak Silat / Kendang Pencak", deskripsi: "Termasuk debus dan upacara penyambutan (toya)." },
    { ikon: "🥁", nama: "Terbang / Rudat", deskripsi: "Kesenian arak-arakan, mirip ondel-ondel dalam kesenian Betawi." },
    { ikon: "🕋", nama: "Ratiban", deskripsi: "Upacara pelepasan warga yang hendak berangkat haji." },
    { ikon: "🪘", nama: "Kasidahan", deskripsi: "Kesenian rebana yang ditabuh serempak dengan irama tertentu." },
    { ikon: "🎭", nama: "Ubrug", deskripsi: "Teater rakyat Sunda–Jawa Serang bertema humor." }
  ],
  // Data grafik penduduk
  grafik: {
    gender: {
      judul: "Jenis Kelamin", jenis: "doughnut",
      label: ["Laki-laki", "Perempuan"], nilai: [1647, 1699],
      ket: "Total 3.346 jiwa."
    },
    usia: {
      judul: "Kelompok Usia", jenis: "doughnut",
      label: ["Belum produktif", "Produktif", "Tidak produktif"], nilai: [421, 2673, 252],
      ket: "Sebagian besar warga berada di usia produktif."
    },
    aktivitas: {
      judul: "Aktivitas Harian", jenis: "bar",
      label: ["Sekolah", "Bekerja", "Ibu rumah tangga"], nilai: [836, 786, 1051],
      ket: "Dari 2.673 penduduk usia produktif."
    },
    pendidikan: {
      judul: "Pendidikan", jenis: "bar",
      label: ["SD", "SLTP", "SLTA", "Perguruan tinggi"], nilai: [433, 212, 170, 21],
      ket: "Tingkat lulusan dari 836 penduduk yang didata."
    },
    penghasilan: {
      judul: "Penghasilan", jenis: "bar",
      label: ["< Rp500 rb", "Rp500 rb – 1 jt", "Rp1 – 2 jt", "> Rp2 jt"], nilai: [1052, 843, 493, 285],
      ket: "Penghasilan per bulan."
    },
    rumah: {
      judul: "Bangunan Rumah", jenis: "doughnut",
      label: ["Permanen", "Semi permanen", "Tidak permanen"], nilai: [575, 305, 140],
      ket: "Dari survei 1.023 rumah."
    },
    mck: {
      judul: "Kepemilikan MCK", jenis: "doughnut",
      label: ["Memiliki MCK", "Belum memiliki"], nilai: [332, 691],
      ket: "Dari 1.023 rumah."
    },
    kesejahteraan: {
      judul: "Kesejahteraan Keluarga", jenis: "bar", satuan: "%",
      label: ["Sangat miskin", "Miskin", "Sedang", "Mampu", "Sangat mampu"], nilai: [13, 27, 32, 18, 11],
      ket: "Persentase keluarga per kategori."
    }
  }
};

// ==================================================================
// LAYANAN ADMINISTRASI
// Persyaratan di bawah adalah persyaratan umum. Sesuaikan dengan
// ketentuan yang berlaku di kantor Desa Beberan.
// ==================================================================
const LAYANAN = [
  {
    id: "pengantar-ktp", ikon: "🪪", nama: "Surat Pengantar KTP-el",
    ringkas: "Pengantar untuk pembuatan atau perubahan KTP elektronik.",
    syarat: ["Surat pengantar RT/RW", "Fotokopi Kartu Keluarga", "KTP lama (jika perubahan/rusak)"]
  },
  {
    id: "pengantar-kk", ikon: "👨‍👩‍👧", nama: "Surat Pengantar Kartu Keluarga",
    ringkas: "Pengantar pembuatan KK baru atau perubahan data KK.",
    syarat: ["Surat pengantar RT/RW", "Kartu Keluarga lama", "Fotokopi KTP", "Fotokopi buku nikah / akta cerai"]
  },
  {
    id: "domisili", ikon: "🏠", nama: "Surat Keterangan Domisili",
    ringkas: "Keterangan tempat tinggal warga di Desa Beberan.",
    syarat: ["Surat pengantar RT/RW", "Fotokopi KTP", "Fotokopi Kartu Keluarga"]
  },
  {
    id: "sktm", ikon: "🤝", nama: "Surat Keterangan Tidak Mampu (SKTM)",
    ringkas: "Untuk keperluan bantuan pendidikan, kesehatan, atau sosial.",
    syarat: ["Surat pengantar RT/RW", "Fotokopi KTP", "Fotokopi Kartu Keluarga", "Surat pernyataan tidak mampu"]
  },
  {
    id: "sku", ikon: "🏪", nama: "Surat Keterangan Usaha (SKU)",
    ringkas: "Keterangan memiliki usaha, misalnya untuk pengajuan KUR.",
    syarat: ["Surat pengantar RT/RW", "Fotokopi KTP", "Fotokopi Kartu Keluarga", "Foto tempat usaha"]
  },
  {
    id: "pengantar-nikah", ikon: "💍", nama: "Surat Pengantar Nikah",
    ringkas: "Pengantar nikah untuk diajukan ke KUA.",
    syarat: [
      "Surat pengantar RT/RW", "Fotokopi KTP calon pengantin", "Fotokopi Kartu Keluarga",
      "Fotokopi akta kelahiran", "Pas foto", "Surat izin orang tua (jika di bawah 21 tahun)"
    ]
  },
  {
    id: "kelahiran", ikon: "👶", nama: "Surat Keterangan Kelahiran",
    ringkas: "Untuk pengurusan akta kelahiran.",
    syarat: [
      "Surat keterangan lahir dari bidan / rumah sakit", "Fotokopi KTP kedua orang tua",
      "Fotokopi Kartu Keluarga", "Fotokopi buku nikah orang tua"
    ]
  },
  {
    id: "kematian", ikon: "🕊️", nama: "Surat Keterangan Kematian",
    ringkas: "Untuk pengurusan akta kematian dan perubahan KK.",
    syarat: [
      "Surat pengantar RT/RW atau keterangan dari rumah sakit", "Fotokopi KTP almarhum/almarhumah",
      "Fotokopi Kartu Keluarga", "Fotokopi KTP pelapor"
    ]
  },
  {
    id: "pindah", ikon: "🚚", nama: "Surat Keterangan Pindah",
    ringkas: "Pengantar pindah domisili ke luar desa.",
    syarat: ["Surat pengantar RT/RW", "Kartu Keluarga asli", "KTP asli", "Alamat lengkap tujuan pindah"]
  }
];
