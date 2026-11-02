// ==================================================================
// Halaman Beranda
// ==================================================================

// ---------- Peta mini di hero (hanya tampilan, klik membuka peta.html) ----------
(function petaMini() {
  const peta = L.map("peta-mini", {
    zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false,
    doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false
  });
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 }
  ).addTo(peta);

  const batas = L.geoJSON(DESA.batas, { style: { color: "#facc15", weight: 3, fill: false, dashArray: "6 5" } });
  // View diset sebelum layer vektor ditambahkan
  peta.fitBounds(batas.getBounds(), { padding: [24, 24] });
  L.geoJSON(DUSUN, {
    style: (f) => ({ color: f.properties.warna, weight: 1.5, fillColor: f.properties.warna, fillOpacity: 0.25 })
  }).addTo(peta);
  batas.addTo(peta);
})();

// ---------- Status kantor ----------
(function () {
  const el = document.getElementById("status-kantor");
  const { buka, jadwal } = statusKantor();
  el.classList.add(buka ? "buka" : "tutup");
  el.textContent = buka
    ? `Kantor desa sedang buka · sampai ${jadwal.tutup.replace(":", ".")} WIB`
    : "Kantor desa sedang tutup";
})();

// ---------- Layanan cepat ----------
document.getElementById("layanan-cepat").innerHTML = LAYANAN.slice(0, 6)
  .map(
    (l) => `<a class="kartu reveal" href="layanan.html#${esc(l.id)}">
      <div class="ikon">${l.ikon}</div>
      <h3>${esc(l.nama)}</h3>
      <p>${esc(l.ringkas)}</p>
      <span class="lanjut">${l.syarat.length} persyaratan →</span>
    </a>`
  )
  .join("");

// ---------- Potensi ----------
document.getElementById("potensi").innerHTML = PROFIL.potensi
  .map(
    (p) => `<div class="kartu reveal">
      <div class="ikon">${p.ikon}</div>
      <h3>${esc(p.nama)}</h3>
      <p>${esc(p.deskripsi)}</p>
    </div>`
  )
  .join("");
