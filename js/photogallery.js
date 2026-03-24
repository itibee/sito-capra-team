window.Photogallery = (() => {
  function escapeHtml(value) {
    const str = String(value ?? "");
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDateValue(value) {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async function loadGalleryItems() {
    const res = await fetch("/data/galleries.yml", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    const data = jsyaml.load(text) || {};
    return Array.isArray(data.gallery_items) ? data.gallery_items : [];
  }

  async function renderAlbumCards({
    containerId,
    category = null,
    section = null,
    featuredOnly = false,
    limit = null,
    emptyMessage = "Nessun album disponibile al momento."
  }) {
    try {
      const items = await loadGalleryItems();

      let filtered = [...items];

      if (category) {
        filtered = filtered.filter(item => item.category === category);
      }

      if (section) {
        filtered = filtered.filter(item => item.section === section);
      }

      if (featuredOnly) {
        filtered = filtered.filter(item => item.featured === true);
      }

      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (limit) {
        filtered = filtered.slice(0, limit);
      }

      const grid = document.getElementById(containerId);
      if (!grid) return;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="xl:col-span-3 bg-box rounded-2xl border border-white/5 p-8 text-center text-gray-400">
            ${escapeHtml(emptyMessage)}
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => `
        <a href="/photogallery/gallery-post.html?slug=${encodeURIComponent(item.slug || "")}" class="group block">
          <article class="bg-box rounded-2xl border border-white/5 overflow-hidden h-full hover:border-gold/30 transition">
            <img src="${escapeHtml(item.cover_image || "/assets/images/hero-home.jpg")}" alt="${escapeHtml(item.title || "")}" class="w-full h-64 object-cover">
            <div class="p-6">
              <p class="text-gold text-xs font-bold uppercase tracking-[0.18em]">${escapeHtml(item.section || item.category || "Photogallery")}</p>
              <h3 class="text-xl font-black mt-3 leading-tight group-hover:text-gold transition">${escapeHtml(item.title || "")}</h3>
              <p class="text-gray-400 mt-4 text-sm">${escapeHtml(item.cover_caption || item.excerpt || "")}</p>
              <p class="text-gray-500 mt-4 text-xs uppercase tracking-[0.15em]">${escapeHtml(formatDateValue(item.date))}</p>
            </div>
          </article>
        </a>
      `).join("");
    } catch (error) {
      console.error("Errore caricamento album:", error);
      const grid = document.getElementById(containerId);
      if (grid) {
        grid.innerHTML = `
          <div class="xl:col-span-3 bg-box rounded-2xl border border-red-500/20 p-8 text-center text-red-300">
            Errore nel caricamento degli album.
          </div>
        `;
      }
    }
  }

  function getParentPage(item) {
    if (!item) {
      return { href: "/photogallery/index.html", label: "Photogallery" };
    }

    if (item.category === "Prima Squadra") {
      return { href: "/photogallery/prima-squadra.html", label: "Prima Squadra" };
    }

    if (item.category === "Giovanili") {
      const map = {
        "Under 19": "/photogallery/giovanili-under-19.html",
        "Under 17": "/photogallery/giovanili-under-17.html",
        "Under 15": "/photogallery/giovanili-under-15.html",
        "Under 13": "/photogallery/giovanili-under-13.html"
      };
      return {
        href: map[item.section] || "/photogallery/giovanili.html",
        label: item.section || "Giovanili"
      };
    }

    if (item.category === "Minibasket") {
      const map = {
        "Paperine": "/photogallery/minibasket-paperine.html",
        "Libellule": "/photogallery/minibasket-libellule.html",
        "Gazzelle Small": "/photogallery/minibasket-gazzelle-small.html",
        "Gazzelle Big": "/photogallery/minibasket-gazzelle-big.html",
        "Esordienti": "/photogallery/minibasket-esordienti.html"
      };
      return {
        href: map[item.section] || "/photogallery/minibasket.html",
        label: item.section || "Minibasket"
      };
    }

    return { href: "/photogallery/index.html", label: "Photogallery" };
  }

  async function renderAlbumPost() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    try {
      const items = await loadGalleryItems();
      const item = items.find(g => g.slug === slug);

      if (!item) {
        document.body.innerHTML = `
          <div style="padding:40px;color:white;background:#0A0A0A;font-family:sans-serif;min-height:100vh;">
            Album non trovato.
          </div>
        `;
        return;
      }

      const parent = getParentPage(item);

      document.title = `${item.title} | Capra Team Ravenna`;

      document.getElementById("album-cover").src = item.cover_image || "/assets/images/hero-home.jpg";
      document.getElementById("album-cover").alt = item.title || "";
      document.getElementById("album-category").textContent = item.category || "Photogallery";
      document.getElementById("album-title").textContent = item.title || "";
      document.getElementById("album-meta").textContent = `${item.section || ""} · ${formatDateValue(item.date)}`;
      document.getElementById("album-cover-caption").textContent = item.cover_caption || "";
      document.getElementById("album-excerpt").textContent = item.excerpt || "";

      const backLink = document.getElementById("album-back-link");
      if (backLink) {
        backLink.href = parent.href;
        backLink.textContent = `← Torna a ${parent.label}`;
      }

      const albumGrid = document.getElementById("album-grid");
      const images = Array.isArray(item.gallery_images) ? item.gallery_images : [];

      if (images.length === 0) {
        albumGrid.innerHTML = `
          <div class="xl:col-span-3 bg-box rounded-2xl border border-white/5 p-8 text-center text-gray-400">
            Nessuna immagine disponibile per questo album.
          </div>
        `;
        return;
      }

      albumGrid.innerHTML = images.map(photo => `
        <figure class="bg-box border border-white/5 rounded-2xl overflow-hidden">
          <img src="${escapeHtml(photo.image || "")}" alt="${escapeHtml(photo.caption || item.title || "")}" class="w-full h-80 object-cover">
          <figcaption class="p-4 text-sm text-gray-400">
            ${escapeHtml(photo.caption || "")}
          </figcaption>
        </figure>
      `).join("");
    } catch (error) {
      console.error("Errore caricamento album:", error);
      document.body.innerHTML = `
        <div style="padding:40px;color:white;background:#0A0A0A;font-family:sans-serif;min-height:100vh;">
          Errore nel caricamento dell’album.
        </div>
      `;
    }
  }

  return {
    renderAlbumCards,
    renderAlbumPost
  };
})();