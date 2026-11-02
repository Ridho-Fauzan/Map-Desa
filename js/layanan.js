// ==================================================================
// Halaman Layanan
// ==================================================================

// ---------- Status kantor ----------
const { buka, jadwal } = statusKantor();
const statusEl = document.getElementById("status-kantor");
statusEl.classList.add(buka ? "buka" : "tutup");
statusEl.textContent = buka
  ? `Kantor desa sedang buka · sampai ${jadwal.tutup.replace(":", ".")} WIB`
  : "Kantor desa sedang tutup";

// ---------- Daftar layanan (akordeon + checklist) ----------
const KUNCI_SIMPAN = "beberan-ceklis";
const tersimpan = JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || "{}");
const simpan = () => localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(tersimpan));

const daftarEl = document.getElementById("daftar-layanan");
daftarEl.innerHTML = LAYANAN.map(
  (l) => `<div class="akordeon" id="${esc(l.id)}" data-cari="${esc((l.nama + " " + l.ringkas).toLowerCase())}">
    <button aria-expanded="false" aria-controls="isi-${esc(l.id)}">
      <span class="ikon">${l.ikon}</span>
      <span class="teks"><b>${esc(l.nama)}</b><small>${esc(l.ringkas)}</small></span>
      <span class="lencana"></span>
      <span class="panah">▾</span>
    </button>
    <div class="isi" id="isi-${esc(l.id)}">
      <h4>Persyaratan</h4>
      ${l.syarat
        .map(
          (s, i) => `<label class="cek"><input type="checkbox" data-i="${i}" ${tersimpan[l.id]?.includes(i) ? "checked" : ""} /><span>${esc(s)}</span></label>`
        )
        .join("")}
      <div class="progres"><div></div></div>
      <p class="progres-teks"></p>
      <button class="btn btn-wa btn-kecil tanya">💬 Tanya layanan ini via WhatsApp</button>
    </div>
  </div>`
).join("") + `<p class="kosong" hidden>Layanan tidak ditemukan. Coba kata lain atau tanyakan langsung ke kantor desa.</p>`;

function perbaruiProgres(akordeon) {
  const kotak = akordeon.querySelectorAll(".cek input");
  const siap = [...kotak].filter((k) => k.checked).length;
  const total = kotak.length;
  akordeon.querySelector(".progres div").style.width = (siap / total) * 100 + "%";
  akordeon.querySelector(".progres-teks").textContent =
    siap === total ? "✅ Semua berkas siap. Silakan datang ke kantor desa." : `${siap} dari ${total} berkas siap`;
  const lencana = akordeon.querySelector(".lencana");
  lencana.textContent = siap === total ? "Siap ✓" : `${siap}/${total}`;
  lencana.classList.toggle("siap", siap === total);
}
daftarEl.querySelectorAll(".akordeon").forEach(perbaruiProgres);

function bukaAkordeon(akordeon, gulir = false) {
  const buka = !akordeon.classList.contains("buka");
  akordeon.classList.toggle("buka", buka);
  akordeon.querySelector(":scope > button").setAttribute("aria-expanded", buka);
  if (gulir && buka) akordeon.scrollIntoView({ behavior: "smooth", block: "center" });
}

daftarEl.addEventListener("click", (e) => {
  const akordeon = e.target.closest(".akordeon");
  if (!akordeon) return;
  if (e.target.closest(".akordeon > button")) {
    bukaAkordeon(akordeon);
  } else if (e.target.closest(".tanya")) {
    const l = LAYANAN.find((x) => x.id === akordeon.id);
    const kotak = [...akordeon.querySelectorAll(".cek input")];
    const belum = l.syarat.filter((_, i) => !kotak[i].checked);
    kirimWA(
      `Assalamu'alaikum, saya ingin bertanya tentang layanan *${l.nama}* di Desa Beberan.` +
      (belum.length ? `\n\nBerkas yang belum saya punya:\n- ${belum.join("\n- ")}` : "\n\nSemua berkas sudah saya siapkan.") +
      "\n\nTerima kasih."
    );
  }
});

daftarEl.addEventListener("change", (e) => {
  if (!e.target.matches(".cek input")) return;
  const akordeon = e.target.closest(".akordeon");
  tersimpan[akordeon.id] = [...akordeon.querySelectorAll(".cek input")]
    .map((k, i) => (k.checked ? i : -1))
    .filter((i) => i >= 0);
  simpan();
  perbaruiProgres(akordeon);
});

// ---------- Pencarian layanan ----------
document.getElementById("cari-layanan").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  let ada = 0;
  daftarEl.querySelectorAll(".akordeon").forEach((a) => {
    const cocok = !q || a.dataset.cari.includes(q);
    a.hidden = !cocok;
    if (cocok) ada++;
  });
  daftarEl.querySelector(".kosong").hidden = ada > 0;
});

// ---------- Buka layanan dari link (misal layanan.html#domisili) ----------
function bukaDariHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (target && target.classList.contains("akordeon") && !target.classList.contains("buka")) {
    bukaAkordeon(target, true);
  }
}
window.addEventListener("hashchange", bukaDariHash);
bukaDariHash();

// ---------- Jam pelayanan & alamat ----------
const hariIni = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", weekday: "short" }).format(new Date());
const idxHari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(hariIni);
document.getElementById("tabel-jam").innerHTML = KONTAK.jam
  .map(
    (j) => `<tr class="${j.hari.includes(idxHari) ? "hari-ini" : ""}">
      <td>${esc(j.label)}${j.hari.includes(idxHari) ? " (hari ini)" : ""}</td>
      <td>${j.buka ? `${j.buka.replace(":", ".")} – ${j.tutup.replace(":", ".")}` : "Tutup"}</td>
    </tr>`
  )
  .join("");
document.getElementById("alamat").textContent = KONTAK.alamat;
document.getElementById("tanya-wa").addEventListener("click", () =>
  kirimWA("Assalamu'alaikum, saya warga Desa Beberan ingin bertanya tentang layanan desa.")
);

// ---------- Form aspirasi ----------
const KATEGORI_ASPIRASI = ["Jalan & infrastruktur", "Pelayanan", "Kesehatan", "Pendidikan", "Sosial", "Lainnya"];
document.getElementById("pilih-kampung").insertAdjacentHTML(
  "beforeend",
  DUSUN.features.map((f) => `<option>${esc(f.properties.nama)}</option>`).join("")
);
document.getElementById("pilih-kategori").innerHTML = KATEGORI_ASPIRASI.map(
  (k, i) => `<label><input type="radio" name="kategori" value="${esc(k)}" ${i === 0 ? "checked" : ""} /><span>${esc(k)}</span></label>`
).join("");

const form = document.getElementById("form-aspirasi");
const isiEl = form.elements.isi;
isiEl.addEventListener("input", () => (document.getElementById("hitung").textContent = isiEl.value.length));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const kosong = ["nama", "kampung", "isi"].find((k) => !String(d[k] || "").trim());
  if (kosong) {
    toast("Lengkapi nama, kampung, dan isi aspirasi dulu.");
    form.elements[kosong].focus();
    return;
  }
  kirimWA(
    `*Aspirasi Warga Desa Beberan*\n\nNama: ${d.nama.trim()}\nKampung: ${d.kampung}\nKategori: ${d.kategori}\n\n${d.isi.trim()}`
  );
});
