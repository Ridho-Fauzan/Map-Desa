// ==================================================================
// Peta Interaktif Desa — Leaflet
// Data diambil dari data.js (DESA, DUSUN, KATEGORI, FASILITAS)
// ==================================================================

// ---------- Basemap ----------
const satelit = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, attribution: "Citra &copy; Esri, Maxar, Earthstar Geographics" }
);
const labelJalan = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, opacity: 0.8 }
);
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
});

const map = L.map("map", { layers: [satelit, labelJalan], zoomControl: true });
L.control.scale({ imperial: false }).addTo(map);

// ---------- Helper ----------
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const angka = (n) => Number(n).toLocaleString("id-ID");
const infoEl = document.getElementById("info");

// ---------- Header ----------
document.getElementById("nama-desa").textContent = DESA.nama;
document.getElementById("lokasi-desa").textContent =
  `${DESA.kecamatan}, ${DESA.kabupaten}, ${DESA.provinsi}`;
document.title = `Peta Interaktif ${DESA.nama}`;

// ---------- Batas desa + masker luar desa ----------
const batasLayer = L.geoJSON(DESA.batas, {
  style: { color: "#facc15", weight: 4, fill: false, dashArray: "8 6" },
  interactive: false
});
// View harus diset dulu sebelum layer vektor ditambahkan, kalau tidak Leaflet error
const batasBounds = batasLayer.getBounds();
map.fitBounds(batasBounds, { padding: [20, 20] });
batasLayer.addTo(map);

// Area di luar desa digelapkan supaya wilayah desa menonjol
const ringDesa = DESA.batas.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
// Lintang dibatasi ±85 karena proyeksi Web Mercator tidak bisa menghitung ±90
const dunia = [[-85, -180], [-85, 180], [85, 180], [85, -180]];
L.polygon([dunia, ringDesa], {
  stroke: false, fillColor: "#000", fillOpacity: 0.45, interactive: false
}).addTo(map);

// ---------- Panel info ----------
function tampilInfoDesa() {
  infoEl.innerHTML = `
    <h3>${esc(DESA.nama)}</h3>
    <p>${esc(DESA.deskripsi)}</p>
    <div class="stats">
      <div><b>${esc(DESA.luas)}</b>Luas</div>
      <div><b>${angka(DESA.penduduk)}</b>Jiwa</div>
      <div><b>${angka(DESA.rumah)}</b>Rumah</div>
    </div>
    ${DESA.perkiraan ? `<p class="warning">⚠️ Batas wilayah dan posisi fasilitas masih perkiraan, belum data resmi.</p>` : ""}
    <p class="muted" style="font-size:.8rem;color:#6b7280">Klik wilayah kampung atau ikon di peta untuk detail.</p>`;
}

function tampilInfoDusun(p) {
  infoEl.innerHTML = `
    <h3><span class="swatch" style="background:${esc(p.warna)}"></span> ${esc(p.nama)}</h3>
    <p>${esc(p.deskripsi)}</p>
    <div class="stats">
      ${p.luas ? `<div><b>${esc(p.luas)}</b>Luas</div>` : ""}
      ${p.penduduk ? `<div><b>${angka(p.penduduk)}</b>Jiwa</div>` : ""}
      ${p.kk ? `<div><b>${angka(p.kk)}</b>KK</div>` : ""}
    </div>
    ${p.kepala ? `<p>Ketua: <b>${esc(p.kepala)}</b></p>` : ""}
    <button class="back">← Kembali ke info desa</button>`;
  infoEl.querySelector(".back").onclick = resetTampilan;
}

function tampilInfoTempat(p) {
  const k = KATEGORI[p.kategori] || { label: p.kategori, ikon: "📍", warna: "#6b7280" };
  infoEl.innerHTML = `
    <h3>${k.ikon} ${esc(p.nama)}</h3>
    <span class="popup"><span class="tag" style="background:${k.warna}">${esc(k.label)}</span></span>
    <p>${esc(p.deskripsi)}</p>
    ${p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.nama)}" />` : ""}
    <button class="back">← Kembali ke info desa</button>`;
  infoEl.querySelector(".back").onclick = resetTampilan;
}

// ---------- Wilayah dusun (hover + klik) ----------
const gayaDusun = (f) => ({
  color: f.properties.warna, weight: 2, fillColor: f.properties.warna, fillOpacity: 0.15
});
let dusunAktif = null;

const dusunLayer = L.geoJSON(DUSUN, {
  style: gayaDusun,
  onEachFeature: (f, layer) => {
    layer.bindTooltip(f.properties.nama, {
      permanent: true, direction: "center", className: "label-dusun"
    });
    layer.on({
      mouseover: () => {
        layer.setStyle({ weight: 4, fillOpacity: 0.35 });
        layer.bringToFront();
      },
      mouseout: () => {
        if (layer !== dusunAktif) dusunLayer.resetStyle(layer);
      },
      click: () => {
        if (dusunAktif) dusunLayer.resetStyle(dusunAktif);
        dusunAktif = layer;
        layer.setStyle({ weight: 4, fillOpacity: 0.35 });
        map.fitBounds(layer.getBounds(), { padding: [40, 40] });
        tampilInfoDusun(f.properties);
      }
    });
  }
}).addTo(map);

// ---------- Marker fasilitas ----------
const grupKategori = {};   // kategori -> L.layerGroup
const semuaMarker = [];    // { marker, props }

function buatIkon(kategori) {
  const k = KATEGORI[kategori] || { ikon: "📍", warna: "#6b7280" };
  return L.divIcon({
    className: "",
    html: `<div class="marker-ikon" style="border-color:${k.warna}">${k.ikon}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

FASILITAS.features.forEach((f) => {
  const p = f.properties;
  const [lng, lat] = f.geometry.coordinates;
  const k = KATEGORI[p.kategori] || { label: p.kategori, warna: "#6b7280" };

  const marker = L.marker([lat, lng], { icon: buatIkon(p.kategori), title: p.nama })
    .bindPopup(`
      <div class="popup">
        <h3>${esc(p.nama)}</h3>
        <span class="tag" style="background:${k.warna}">${esc(k.label)}</span>
        <p>${esc(p.deskripsi)}</p>
        ${p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.nama)}" />` : ""}
      </div>`);
  marker.on("click", () => tampilInfoTempat(p));

  if (!grupKategori[p.kategori]) grupKategori[p.kategori] = L.layerGroup().addTo(map);
  grupKategori[p.kategori].addLayer(marker);
  semuaMarker.push({ marker, props: p });
});

// ---------- Kontrol basemap ----------
L.control.layers(
  { "Satelit": satelit, "Peta Jalan (OSM)": osm },
  { "Label jalan": labelJalan },
  { position: "topright" }
).addTo(map);

// Label jalan Esri hanya cocok di atas citra satelit
map.on("baselayerchange", (e) => {
  if (e.layer === osm) map.removeLayer(labelJalan);
});

// ---------- Tombol reset tampilan ----------
const ResetControl = L.Control.extend({
  options: { position: "topleft" },
  onAdd() {
    const btn = L.DomUtil.create("a", "leaflet-bar leaflet-control");
    btn.href = "#";
    btn.title = "Tampilkan seluruh desa";
    btn.innerHTML = "⌂";
    btn.style.cssText = "width:30px;height:30px;line-height:30px;text-align:center;font-size:18px;background:#fff;color:#333;text-decoration:none";
    L.DomEvent.on(btn, "click", (e) => { L.DomEvent.preventDefault(e); resetTampilan(); });
    return btn;
  }
});
map.addControl(new ResetControl());

function resetTampilan() {
  if (dusunAktif) dusunLayer.resetStyle(dusunAktif);
  dusunAktif = null;
  map.closePopup();
  map.fitBounds(batasBounds, { padding: [20, 20] });
  tampilInfoDesa();
}

// ---------- Legenda ----------
const legenda = L.control({ position: "bottomright" });
legenda.onAdd = () => {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML =
    `<b>Legenda</b><br><span style="color:#facc15">━ ━</span> Batas desa<br>` +
    Object.values(KATEGORI).map((k) => `${k.ikon} ${esc(k.label)}`).join("<br>");
  return div;
};
legenda.addTo(map);

// ---------- Panel: filter kategori ----------
const filterEl = document.getElementById("filter-kategori");
Object.entries(KATEGORI).forEach(([key, k]) => {
  if (!grupKategori[key]) return; // sembunyikan kategori tanpa data
  const label = document.createElement("label");
  label.className = "row";
  label.innerHTML = `<input type="checkbox" checked data-kat="${key}" />
    <span class="swatch" style="background:${k.warna}"></span> ${k.ikon} ${esc(k.label)}`;
  filterEl.appendChild(label);
});
filterEl.addEventListener("change", (e) => {
  const kat = e.target.dataset.kat;
  if (!kat) return;
  e.target.checked ? map.addLayer(grupKategori[kat]) : map.removeLayer(grupKategori[kat]);
  renderDaftar();
});

document.getElementById("tgl-dusun").addEventListener("change", (e) => {
  e.target.checked ? map.addLayer(dusunLayer) : map.removeLayer(dusunLayer);
});

// ---------- Panel: daftar + pencarian ----------
const daftarEl = document.getElementById("daftar-tempat");
const cariEl = document.getElementById("cari");

function renderDaftar() {
  const q = cariEl.value.trim().toLowerCase();
  daftarEl.innerHTML = "";
  semuaMarker
    .filter(({ props }) => map.hasLayer(grupKategori[props.kategori]))
    .filter(({ props }) => !q || props.nama.toLowerCase().includes(q))
    .forEach(({ marker, props }) => {
      const k = KATEGORI[props.kategori] || { ikon: "📍", label: props.kategori };
      const li = document.createElement("li");
      li.innerHTML = `<span>${k.ikon}</span><span>${esc(props.nama)}<small>${esc(k.label)}</small></span>`;
      li.onclick = () => {
        map.flyTo(marker.getLatLng(), 18, { duration: 0.8 });
        map.once("moveend", () => marker.openPopup());
        tampilInfoTempat(props);
      };
      daftarEl.appendChild(li);
    });
  if (!daftarEl.children.length) {
    daftarEl.innerHTML = `<li style="color:#6b7280;cursor:default">Tidak ada tempat yang cocok.</li>`;
  }
}
cariEl.addEventListener("input", renderDaftar);

// ---------- Mobile: buka/tutup panel ----------
document.getElementById("toggle-panel").onclick = () => {
  document.getElementById("panel").classList.toggle("tertutup");
  setTimeout(() => map.invalidateSize(), 200);
};

// ---------- Init ----------
tampilInfoDesa();
renderDaftar();
