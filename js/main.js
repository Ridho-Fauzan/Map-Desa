// ==================================================================
// Script bersama untuk semua halaman: header, footer, animasi, helper
// Harus dimuat setelah data.js dan sebelum script halaman.
// ==================================================================

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const angka = (n) => Number(n).toLocaleString("id-ID");

// ---------- Header (disisipkan langsung supaya ukuran layout sudah benar) ----------
(function pasangHeader() {
  const menu = [
    ["index", "Beranda"],
    ["profil", "Profil"],
    ["layanan", "Layanan"],
    ["peta", "Peta Desa"]
  ];
  const halaman = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
  const link = menu
    .map(([h, l]) => `<a href="${h}.html"${h === halaman ? ' class="aktif" aria-current="page"' : ""}>${l}</a>`)
    .join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<header class="site-header">
      <div class="container inner">
        <a class="brand" href="index.html"><span>🌾</span><span>${esc(DESA.nama)}<small>${esc(DESA.kecamatan)}, ${esc(DESA.kabupaten)}</small></span></a>
        <button class="nav-toggle" aria-label="Buka menu" aria-expanded="false">☰</button>
        <nav class="site-nav">${link}</nav>
      </div>
    </header>`
  );

  const tombol = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  tombol.addEventListener("click", () => {
    const buka = nav.classList.toggle("buka");
    tombol.setAttribute("aria-expanded", buka);
  });
})();

// ---------- Footer ----------
function pasangFooter() {
  if (document.body.dataset.tanpaFooter !== undefined) return;
  const jam = KONTAK.jam
    .map((j) => `<li>${esc(j.label)}: ${j.buka ? `${j.buka.replace(":", ".")} – ${j.tutup.replace(":", ".")}` : "Tutup"}</li>`)
    .join("");
  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="site-footer">
      <div class="container">
        <div class="grid">
          <div>
            <h4>🌾 ${esc(DESA.nama)}</h4>
            <p>${esc(KONTAK.alamat)}</p>
          </div>
          <div>
            <h4>Jam Pelayanan</h4>
            <ul>${jam}</ul>
          </div>
          <div>
            <h4>Tautan</h4>
            <ul>
              <li><a href="profil.html">Profil Desa</a></li>
              <li><a href="layanan.html">Layanan Administrasi</a></li>
              <li><a href="layanan.html#aspirasi">Aspirasi Warga</a></li>
              <li><a href="peta.html">Peta Desa</a></li>
            </ul>
          </div>
        </div>
        <p class="bawah">© ${new Date().getFullYear()} Pemerintah ${esc(DESA.nama)} · Data profil tahun ${PROFIL.tahunData}</p>
      </div>
    </footer>`
  );
}

// ---------- Notifikasi kecil ----------
function toast(pesan) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = pesan;
  el.classList.add("tampil");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("tampil"), 3500);
}

// ---------- Kirim pesan ke WhatsApp desa ----------
// Kalau nomor belum diatur, pesan disalin ke clipboard.
async function kirimWA(teks) {
  if (KONTAK.whatsapp) {
    window.open(`https://wa.me/${KONTAK.whatsapp}?text=${encodeURIComponent(teks)}`, "_blank", "noopener");
    return;
  }
  try {
    await navigator.clipboard.writeText(teks);
    toast("Nomor WhatsApp desa belum diatur. Pesan sudah disalin ke clipboard.");
  } catch {
    toast("Nomor WhatsApp desa belum diatur.");
  }
}

// ---------- Status buka/tutup kantor (WIB) ----------
function statusKantor() {
  const bagian = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date());
  const ambil = (t) => bagian.find((p) => p.type === t).value;
  const hari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(ambil("weekday"));
  const sekarang = `${ambil("hour")}:${ambil("minute")}`;
  const jadwal = KONTAK.jam.find((j) => j.hari.includes(hari));
  const buka = jadwal && jadwal.buka && sekarang >= jadwal.buka && sekarang < jadwal.tutup;
  return { buka, jadwal };
}

// ---------- Animasi angka & muncul saat di-scroll ----------
function animasiAngka(el) {
  const target = Number(el.dataset.count);
  const durasi = 1400;
  const mulai = performance.now();
  const langkah = (t) => {
    const p = Math.min((t - mulai) / durasi, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = angka(Math.round(target * ease)) + (el.dataset.suffix || "");
    if (p < 1) requestAnimationFrame(langkah);
  };
  requestAnimationFrame(langkah);
}

document.addEventListener("DOMContentLoaded", () => {
  pasangFooter();

  const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const obs = new IntersectionObserver(
    (entri) => {
      entri.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("tampil");
        if (e.target.dataset.count) {
          kurangiGerak
            ? (e.target.textContent = angka(e.target.dataset.count) + (e.target.dataset.suffix || ""))
            : animasiAngka(e.target);
        }
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal, [data-count]").forEach((el) => obs.observe(el));
});
