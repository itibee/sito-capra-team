document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navClass = (file) =>
    currentPage === file ? 'text-gold transition' : 'hover:text-gold transition';

  if (navbarContainer) {
    navbarContainer.innerHTML = `
      <nav class="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          <a href="index.html" class="flex items-center gap-3 min-w-0">
            <img
              src="/assets/images/logocaprateam.jpg"
              alt="Logo Capra Team"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/50 object-cover shrink-0"
            >
            <span class="font-heading text-sm sm:text-xl tracking-tight uppercase leading-none">
              Capra <span class="text-gold">Team</span>
            </span>
          </a>

          <div class="hidden md:flex items-center gap-8 font-bold uppercase text-xs tracking-widest">
            <a href="index.html" class="${navClass('index.html')}">Home</a>
            <a href="roster.html" class="${navClass('roster.html')}">Serie B</a>
            <a href="giovanili.html" class="${navClass('giovanili.html')}">Giovanili</a>
            <a href="news.html" class="${navClass('news.html')}">News</a>
            <a href="chi-siamo.html" class="${navClass('chi-siamo.html')}">Chi Siamo</a>
            <a href="contatti.html" class="${navClass('contatti.html')}">Contatti</a>
          </div>

          <div class="flex items-center gap-3">
            <a
              href="contatti.html"
              class="hidden md:inline-block bg-gold text-black px-6 py-2 rounded-md font-black text-xs uppercase hover:bg-yellow-500 transition"
            >
              Contattaci
            </a>

            <button
              id="mobile-menu-button"
              class="md:hidden text-white text-2xl leading-none"
              aria-label="Apri menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
              type="button"
            >
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden border-t border-white/5">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 font-bold uppercase text-xs tracking-widest bg-black/95">
            <a href="index.html" class="${navClass('index.html')}">Home</a>
            <a href="roster.html" class="${navClass('roster.html')}">Serie B</a>
            <a href="giovanili.html" class="${navClass('giovanili.html')}">Giovanili</a>
            <a href="news.html" class="${navClass('news.html')}">News</a>
            <a href="chi-siamo.html" class="${navClass('chi-siamo.html')}">Chi Siamo</a>
            <a href="contatti.html" class="${navClass('contatti.html')}">Contatti</a>
            <a
              href="contatti.html"
              class="bg-gold text-black px-6 py-3 rounded-md font-black text-xs uppercase text-center"
            >
              Contattaci
            </a>
          </div>
        </div>
      </nav>
    `;
  }

  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="border-t border-white/10 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
          <div class="flex items-center gap-3">
            <img
              src="/assets/images/logocaprateam.jpg"
              alt="Logo Capra Team"
              class="w-10 h-10 rounded-full border border-gold/50 object-cover"
            >
            <span>© ${new Date().getFullYear()} Capra Team Ravenna</span>
          </div>

          <div class="flex flex-wrap justify-center gap-4 sm:gap-6 uppercase text-xs font-bold tracking-widest">
            <a href="index.html" class="hover:text-gold transition">Home</a>
            <a href="roster.html" class="hover:text-gold transition">Serie B</a>
            <a href="giovanili.html" class="hover:text-gold transition">Giovanili</a>
            <a href="news.html" class="hover:text-gold transition">News</a>
            <a href="chi-siamo.html" class="hover:text-gold transition">Chi Siamo</a>
            <a href="contatti.html" class="hover:text-gold transition">Contatti</a>
          </div>
        </div>
      </footer>
    `;
  }

  const mobileButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');

      const icon = mobileButton.querySelector('i');
      const expanded = !mobileMenu.classList.contains('hidden');
      mobileButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }
});