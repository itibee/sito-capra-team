document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = document.getElementById("navbar-container");
  const footerContainer = document.getElementById("footer-container");

  async function loadComponent(url, target) {
    if (!target) return;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      target.innerHTML = await res.text();
    } catch (error) {
      console.error(`Errore caricamento componente ${url}:`, error);
    }
  }

  await Promise.all([
    loadComponent("/components/navbar.html", navbarContainer),
    loadComponent("/components/footer.html", footerContainer)
  ]);

  evidenziaPaginaCorrente();
});

function normalizePath(path) {
  if (!path) return "/";
  let normalized = path.trim();

  try {
    if (normalized.startsWith("http")) {
      normalized = new URL(normalized).pathname;
    }
  } catch (_) {}

  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  normalized = normalized.replace(/\/+/g, "/");

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function evidenziaPaginaCorrente() {
  const currentPath = normalizePath(window.location.pathname);
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    const href = normalizePath(link.getAttribute("href"));

    let isActive = false;

    if (href === "/index.html" && (currentPath === "/" || currentPath === "/index.html")) {
      isActive = true;
    } else if (href === "/photogallery/index.html" && currentPath.startsWith("/photogallery/")) {
      isActive = true;
    } else if (href === currentPath) {
      isActive = true;
    }

    if (isActive) {
      link.classList.add("text-gold");
      link.classList.remove("text-white");
    }
  });
}