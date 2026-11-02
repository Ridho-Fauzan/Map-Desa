// ==================================================================
// Halaman Profil
// ==================================================================

// ---------- Tentang, visi, misi ----------
document.getElementById("tentang-teks").textContent = PROFIL.tentang;
document.getElementById("keunggulan").innerHTML = PROFIL.keunggulan
  .map((k) => `<span class="chip">${k.ikon} ${esc(k.nama)}</span>`)
  .join("");
document.getElementById("visi").textContent = `“${PROFIL.visi}”`;
document.getElementById("misi").innerHTML = PROFIL.misi.map((m) => `<li>${esc(m)}</li>`).join("");

// ---------- Batas wilayah ----------
const bw = DESA.batasWilayah;
document.getElementById("kompas").innerHTML = `
  <div class="u"><small>⬆ Utara</small>${esc(bw.utara)}</div>
  <div class="b"><small>⬅ Barat</small>${esc(bw.barat)}</div>
  <div class="pusat">Beberan</div>
  <div class="t"><small>Timur ➡</small>${esc(bw.timur)}</div>
  <div class="s"><small>⬇ Selatan</small>${esc(bw.selatan)}</div>`;

// ---------- Luas kampung (bar animasi) ----------
const parseLuas = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", "."));
const kampung = DUSUN.features.map((f) => f.properties);
const luasMaks = Math.max(...kampung.map((k) => parseLuas(k.luas)));
const wadahKampung = document.getElementById("kampung");
wadahKampung.innerHTML = kampung
  .map(
    (k) => `<a class="bar-item" href="peta.html#${encodeURIComponent(k.nama)}">
      <div class="label"><b>${esc(k.nama)}</b><span>${esc(k.luas)}</span></div>
      <div class="track"><div class="fill" style="background:${esc(k.warna)}" data-lebar="${(parseLuas(k.luas) / luasMaks) * 100}"></div></div>
    </a>`
  )
  .join("");
new IntersectionObserver((entri, obs) => {
  if (!entri[0].isIntersecting) return;
  wadahKampung.querySelectorAll(".fill").forEach((el) => (el.style.width = el.dataset.lebar + "%"));
  obs.disconnect();
}, { threshold: 0.3 }).observe(wadahKampung);

// ---------- Grafik penduduk ----------
const PALET = ["#047857", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6"];
const tabEl = document.getElementById("tab-grafik");
const infoEl = document.getElementById("info-grafik");
let grafik = null;

document.getElementById("catatan-data").innerHTML =
  `⚠️ Data dari survei desa tahun ${PROFIL.tahunData} (<a href="${esc(PROFIL.sumber)}" target="_blank" rel="noopener">sumber</a>). ` +
  "Perlu diperbarui dengan data terbaru.";

function tampilGrafik(kunci) {
  const d = PROFIL.grafik[kunci];
  const satuan = d.satuan || "";
  const total = d.nilai.reduce((a, b) => a + b, 0);
  const warna = d.label.map((_, i) => PALET[i % PALET.length]);

  tabEl.querySelectorAll(".tab").forEach((t) => {
    const aktif = t.dataset.kunci === kunci;
    t.classList.toggle("aktif", aktif);
    t.setAttribute("aria-selected", aktif);
  });

  const format = (v) => (satuan === "%" ? `${v}%` : `${angka(v)} jiwa`);
  const persen = (v) => (satuan === "%" ? "" : ` (${Math.round((v / total) * 100)}%)`);

  infoEl.innerHTML = `
    <h3>${esc(d.judul)}</h3>
    <p>${esc(d.ket)}</p>
    <ul>${d.label
      .map((l, i) => `<li data-i="${i}"><span class="warna" style="background:${warna[i]}"></span>${esc(l)}<b>${format(d.nilai[i])}${persen(d.nilai[i])}</b></li>`)
      .join("")}</ul>`;

  if (typeof Chart === "undefined") return; // CDN gagal dimuat: tetap tampilkan angka

  if (grafik) grafik.destroy();
  grafik = new Chart(document.getElementById("grafik"), {
    type: d.jenis,
    data: {
      labels: d.label,
      datasets: [{ data: d.nilai, backgroundColor: warna, borderRadius: d.jenis === "bar" ? 8 : 0, borderWidth: d.jenis === "bar" ? 0 : 2 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: d.jenis === "doughnut" ? "60%" : undefined,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => ` ${format(c.raw)}${persen(c.raw)}` } }
      },
      scales: d.jenis === "bar"
        ? { y: { beginAtZero: true, ticks: { callback: (v) => (satuan === "%" ? v + "%" : angka(v)) } }, x: { grid: { display: false } } }
        : {}
    }
  });

  // Arahkan kursor ke daftar = sorot bagian grafik yang sama
  infoEl.querySelectorAll("li").forEach((li) => {
    const i = Number(li.dataset.i);
    li.addEventListener("mouseenter", () => {
      const el = [{ datasetIndex: 0, index: i }];
      grafik.setActiveElements(el);
      grafik.tooltip.setActiveElements(el, { x: 0, y: 0 });
      grafik.update();
    });
    li.addEventListener("mouseleave", () => {
      grafik.setActiveElements([]);
      grafik.tooltip.setActiveElements([], { x: 0, y: 0 });
      grafik.update();
    });
  });
}

tabEl.innerHTML = Object.entries(PROFIL.grafik)
  .map(([k, d]) => `<button class="tab" role="tab" data-kunci="${k}">${esc(d.judul)}</button>`)
  .join("");
tabEl.addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (t) tampilGrafik(t.dataset.kunci);
});
tampilGrafik("gender");

// ---------- Potensi ----------
document.getElementById("daftar-potensi").innerHTML = PROFIL.potensi
  .map((p) => `<div class="kartu reveal"><div class="ikon">${p.ikon}</div><h3>${esc(p.nama)}</h3><p>${esc(p.deskripsi)}</p></div>`)
  .join("");

// ---------- Kesenian (kartu balik) ----------
const wadahSeni = document.getElementById("kesenian");
wadahSeni.innerHTML = PROFIL.kesenian
  .map(
    (s) => `<button class="flip reveal" aria-label="${esc(s.nama)}: ${esc(s.deskripsi)}">
      <div class="flip-inner">
        <div class="flip-depan"><span class="ikon">${s.ikon}</span><b>${esc(s.nama)}</b><small>Klik untuk baca</small></div>
        <div class="flip-belakang">${esc(s.deskripsi)}</div>
      </div>
    </button>`
  )
  .join("");
wadahSeni.addEventListener("click", (e) => {
  const kartu = e.target.closest(".flip");
  if (kartu) kartu.classList.toggle("balik");
});

// ---------- Sorot menu subnav sesuai bagian yang sedang dilihat ----------
const linkSub = document.querySelectorAll(".subnav a");
const obsBagian = new IntersectionObserver(
  (entri) => {
    entri.forEach((e) => {
      if (!e.isIntersecting) return;
      linkSub.forEach((a) => a.classList.toggle("aktif", a.getAttribute("href") === "#" + e.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => obsBagian.observe(s));
