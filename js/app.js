/* ==========================================================================
   ALMACÉN LA CHARRA — app.js
   Navegación tipo SPA entre vistas, catálogo filtrable, modal de producto
   y microinteracciones.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const imgSrc = (file) => IMG_BASE + file;

  const ICONS = {
    pistol: '<svg viewBox="0 0 48 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h20v-6h14v4h4v6h-6l-2 4h-8v-4H10l-2 4H4z"/></svg>',
    revolver: '<svg viewBox="0 0 48 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="16" cy="16" r="9"/><path d="M25 16h17v5h-5l-2 4h-7v-4h-6" /></svg>',
    shotgun: '<svg viewBox="0 0 48 20" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12h34M2 12v3M36 8h8v6h-8z"/><path d="M14 12v6l-4 2v-8"/></svg>',
    rifle: '<svg viewBox="0 0 48 22" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 14h32M34 8h10v6h-10z"/><path d="M16 14v8l-6 2v-10M8 14v5"/></svg>',
    airrifle: '<svg viewBox="0 0 48 22" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 13h30M34 9h10v5H34z"/><path d="M16 13v7l-6 2v-9"/><circle cx="42" cy="11.5" r="1.4" fill="currentColor" stroke="none"/></svg>',
    airpistol: '<svg viewBox="0 0 48 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h20v-6h14v4h4v5h-6l-2 3h-8v-3H10l-2 3H4z"/><circle cx="38" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>',
    ammo: '<svg viewBox="0 0 24 40" width="26" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4a4 4 0 0 1 8 0v10H8V4Z"/><path d="M8 14h8v18a4 4 0 0 1-8 0V14Z"/></svg>',
  };

  const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  function countByCategory(catId) {
    return PRODUCTS.filter((p) => p.category === catId).length;
  }

  /* ---------------------------------------------------------------------
     View / navigation state
     --------------------------------------------------------------------- */
  const state = { view: "inicio", catalogFilter: "all", catalogQuery: "" };

  function goTo(viewId, opts) {
    opts = opts || {};
    state.view = viewId;

    $$(".view").forEach((v) => v.classList.remove("is-active"));
    const target = document.getElementById("view-" + viewId);
    if (target) target.classList.add("is-active");

    $$("[data-nav]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.nav === viewId);
    });

    window.scrollTo({ top: 0, behavior: opts.instant ? "auto" : "smooth" });
    closeMobileMenu();

    if (viewId === "catalogo" && opts.filter) {
      applyCatalogFilter(opts.filter);
    }
  }

  $$("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.dataset.nav;
      if (!id) return;
      e.preventDefault();
      goTo(id);
    });
  });

  /* ---------------------------------------------------------------------
     Header shrink on scroll
     --------------------------------------------------------------------- */
  const header = $("#siteHeader");
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  const mobileToggle = $("#mobileToggle");
  const mobileMenu = $("#mobileMenu");
  function closeMobileMenu() {
    mobileToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    mobileToggle.setAttribute("aria-expanded", "false");
  }
  mobileToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    mobileToggle.classList.toggle("is-open", open);
    mobileToggle.setAttribute("aria-expanded", String(open));
  });

  /* ---------------------------------------------------------------------
     Gauge divider (signature SVG element) — regla calibrada tipo casquillo
     --------------------------------------------------------------------- */
  function buildGaugeSVG() {
    const w = 1400,
      h = 44;
    let ticks = "";
    for (let i = 0; i <= 70; i++) {
      const x = (i / 70) * w;
      const isMajor = i % 5 === 0;
      const tickH = isMajor ? 16 : 8;
      ticks += `<line x1="${x}" y1="0" x2="${x}" y2="${tickH}" stroke="currentColor" stroke-width="${isMajor ? 1.4 : 1}" opacity="${isMajor ? 0.55 : 0.25}"/>`;
      if (isMajor && i > 0 && i < 70) {
        ticks += `<text x="${x}" y="30" font-family="JetBrains Mono, monospace" font-size="9" fill="currentColor" opacity="0.4" text-anchor="middle">${i * 2}mm</text>`;
      }
    }
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="color:var(--brass-400)">${ticks}<line x1="0" y1="0" x2="${w}" y2="0" stroke="currentColor" opacity=".3"/></svg>`;
  }
  ["gaugeDivider1", "gaugeDivider2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = buildGaugeSVG();
  });

  /* ---------------------------------------------------------------------
     Inicio: franja de categorías
     --------------------------------------------------------------------- */
  const homeCategoryGrid = $("#homeCategoryGrid");
  if (homeCategoryGrid) {
    homeCategoryGrid.innerHTML = CATEGORIES.map(
      (c) => `
      <button class="category-bar__item" data-cat="${c.id}">
        <span class="icon">${ICONS[c.icon] || ""}</span>
        <span>${c.label}</span>
      </button>`
    ).join("");
    homeCategoryGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".category-bar__item");
      if (!card) return;
      goTo("catalogo", { filter: card.dataset.cat });
    });
  }

  /* ---------------------------------------------------------------------
     Inicio: rail de productos destacados
     --------------------------------------------------------------------- */
  const featuredRail = $("#featuredRail");
  if (featuredRail) {
    const featured = PRODUCTS.filter((p) => p.featured);
    featuredRail.innerHTML = featured
      .map(
        (p) => `
      <div class="feat-card" data-id="${p.id}">
        <button class="feat-card__img-wrap" data-action="detail" aria-label="Ver detalle de ${p.name}">
          <span class="feat-card__badge">Destacado</span>
          <img src="${imgSrc(p.img)}" alt="${p.name}" loading="lazy">
        </button>
        <div class="feat-card__body">
          <p class="feat-card__cat">${CATEGORY_MAP[p.category].short}</p>
          <button class="feat-card__name-btn" data-action="detail">
            <h3 class="feat-card__name">${p.name}</h3>
          </button>
          <p class="feat-card__meta">${[p.caliber, p.finish || p.use].filter(Boolean).join(" · ")}</p>
          <div class="feat-card__actions">
            <button class="feat-card__cta" data-action="detail">Ver detalle
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="feat-card__add" data-action="add" data-id="${p.id}">Agregar a cotización</button>
          </div>
        </div>
      </div>`
      )
      .join("");
    featuredRail.addEventListener("click", (e) => {
      const addBtn = e.target.closest('[data-action="add"]');
      if (addBtn) {
        addToQuote(addBtn.dataset.id);
        flashAdded(addBtn);
        return;
      }
      const detailEl = e.target.closest('[data-action="detail"]');
      if (!detailEl) return;
      const card = e.target.closest(".feat-card");
      if (card) openProductModal(card.dataset.id);
    });
    const featPrev = $("#featRailPrev");
    const featNext = $("#featRailNext");
    const progressBar = $("#featuredRailProgress");
    const scrollAmount = () => Math.min(featuredRail.clientWidth * 0.8, 600);
    if (featPrev) featPrev.addEventListener("click", () => featuredRail.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
    if (featNext) featNext.addEventListener("click", () => featuredRail.scrollBy({ left: scrollAmount(), behavior: "smooth" }));

    const updateRailState = () => {
      const max = featuredRail.scrollWidth - featuredRail.clientWidth;
      const atStart = featuredRail.scrollLeft <= 4;
      const atEnd = max <= 4 || featuredRail.scrollLeft >= max - 4;
      if (featPrev) featPrev.disabled = atStart;
      if (featNext) featNext.disabled = atEnd;
      if (progressBar) {
        const visibleRatio = max > 0 ? Math.min(featuredRail.clientWidth / featuredRail.scrollWidth, 1) : 1;
        const barWidthPct = Math.max(visibleRatio * 100, 10);
        const progress = max > 0 ? featuredRail.scrollLeft / max : 0;
        const leftPct = progress * (100 - barWidthPct);
        progressBar.style.width = barWidthPct + "%";
        progressBar.style.left = leftPct + "%";
      }
    };
    featuredRail.addEventListener("scroll", updateRailState, { passive: true });
    window.addEventListener("resize", updateRailState);
    updateRailState();
  }

  /* ---------------------------------------------------------------------
     Catálogo: tabs + búsqueda + grid
     --------------------------------------------------------------------- */
  const catalogTabs = $("#catalogTabs");
  const catalogGrid = $("#catalogGrid");
  const catalogCount = $("#catalogCount");
  const catalogEmpty = $("#catalogEmpty");
  const catalogSearch = $("#catalogSearch");
  const catalogViewToggle = $("#catalogViewToggle");

  /* Selector de vista móvil: 1 o 2 productos por fila (persistido en localStorage) */
  const CATALOG_VIEW_KEY = "charra-catalog-mobile-cols";
  function getSavedCatalogCols() {
    try {
      const saved = localStorage.getItem(CATALOG_VIEW_KEY);
      return saved === "1" || saved === "2" ? saved : "1";
    } catch (e) {
      return "1";
    }
  }
  function applyCatalogCols(cols) {
    catalogGrid.classList.toggle("catalog-grid--2col", cols === "2");
    if (catalogViewToggle) {
      $$(".catalog-view-toggle__btn", catalogViewToggle).forEach((btn) => {
        const active = btn.dataset.cols === cols;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  }
  if (catalogViewToggle) {
    applyCatalogCols(getSavedCatalogCols());
    catalogViewToggle.addEventListener("click", (e) => {
      const btn = e.target.closest(".catalog-view-toggle__btn");
      if (!btn) return;
      const cols = btn.dataset.cols;
      applyCatalogCols(cols);
      try {
        localStorage.setItem(CATALOG_VIEW_KEY, cols);
      } catch (e) {
        /* almacenamiento no disponible: la selección simplemente no persiste */
      }
    });
  }

  const tabsData = [{ id: "all", label: "Todos" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];
  catalogTabs.innerHTML = tabsData
    .map((t) => `<button class="cat-tab" data-cat="${t.id}" role="tab">${t.label}</button>`)
    .join("");

  function applyCatalogFilter(catId) {
    state.catalogFilter = catId;
    $$(".cat-tab", catalogTabs).forEach((btn) => btn.classList.toggle("is-active", btn.dataset.cat === catId));
    renderCatalog();
  }

  catalogTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    applyCatalogFilter(btn.dataset.cat);
  });

  catalogSearch.addEventListener("input", () => {
    state.catalogQuery = catalogSearch.value.trim().toLowerCase();
    renderCatalog();
  });

  function specLine(label, value) {
    if (!value) return "";
    return `<span class="prod-card__spec"><b>${label}:</b> ${value}</span>`;
  }

  function renderCatalog() {
    let list = PRODUCTS.slice();
    if (state.catalogFilter !== "all") {
      list = list.filter((p) => p.category === state.catalogFilter);
    }
    if (state.catalogQuery) {
      const q = state.catalogQuery;
      list = list.filter((p) =>
        [p.name, p.caliber, p.finish, p.use, CATEGORY_MAP[p.category].label]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    catalogCount.textContent = "Artículos disponibles en tienda";
    catalogEmpty.hidden = list.length !== 0;

    catalogGrid.innerHTML = list
      .map(
        (p) => `
      <div class="prod-card" data-id="${p.id}">
        <button class="prod-card__img-wrap" data-action="detail" aria-label="Ver detalle de ${p.name}">
          <span class="prod-card__tag">${CATEGORY_MAP[p.category].short}</span>
          <img src="${imgSrc(p.img)}" alt="${p.name}" loading="lazy">
        </button>
        <div class="prod-card__body">
          <button class="prod-card__name-btn" data-action="detail">
            <h3 class="prod-card__name">${p.name}</h3>
          </button>
          <div class="prod-card__specs">
            ${specLine("Calibre", p.caliber)}
            ${specLine("Capacidad", p.capacity)}
            ${specLine("Acabado", p.finish)}
          </div>
          <div class="prod-card__actions">
            <div class="prod-card__cta-row">
              <button class="prod-card__cta" data-action="detail">Ver detalle
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <button class="prod-card__add" data-action="add" data-id="${p.id}">Agregar a cotización</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    revealCards();
  }

  catalogGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest('[data-action="add"]');
    if (addBtn) {
      addToQuote(addBtn.dataset.id);
      flashAdded(addBtn);
      return;
    }
    const detailEl = e.target.closest('[data-action="detail"]');
    if (!detailEl) return;
    const card = e.target.closest(".prod-card");
    if (card) openProductModal(card.dataset.id);
  });

  function revealCards() {
    const cards = $$(".prod-card", catalogGrid);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("is-visible"), (i % 6) * 60);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => io.observe(c));
  }

  applyCatalogFilter("all");

  /* ---------------------------------------------------------------------
     Product modal
     --------------------------------------------------------------------- */
  const productModal = $("#productModal");
  const modalProductContent = $("#modalProductContent");
  const modalClose = $("#modalClose");

  function openProductModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const specs = [
      ["Categoría", CATEGORY_MAP[p.category].label],
      ["Calibre", p.caliber],
      ["Capacidad", p.capacity],
      ["Acabado", p.finish],
      ["Uso", p.use],
    ].filter(([, v]) => v);

    modalProductContent.innerHTML = `
      <div class="modal-product__img-wrap">
        <img src="${imgSrc(p.img)}" alt="${p.name}">
      </div>
      <div class="modal-product__body">
        <p class="modal-product__cat">${CATEGORY_MAP[p.category].label}</p>
        <h2 class="modal-product__name" id="modalTitle">${p.name}</h2>
        <ul class="modal-product__specs">
          ${specs.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join("")}
        </ul>
        <p class="modal-product__note">Disponibilidad sujeta a inventario en tienda. La compra es 100% presencial y conforme a la ley de armas y municiones de Guatemala.</p>
        <div class="modal-product__actions">
          <button class="btn btn--brass quote-add-detail" data-action="add-to-quote" data-id="${p.id}">Agregar a cotización</button>
          <a href="tel:+50279247416" class="btn btn--outline">Consultar disponibilidad</a>
          <a href="https://wa.me/50279247416" target="_blank" rel="noopener" class="btn btn--outline">Escribir por WhatsApp</a>
        </div>
      </div>`;
    productModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    productModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  modalClose.addEventListener("click", closeProductModal);
  productModal.addEventListener("click", (e) => {
    if (e.target === productModal) closeProductModal();
  });
  modalProductContent.addEventListener("click", (e) => {
    const addBtn = e.target.closest('[data-action="add-to-quote"]');
    if (!addBtn) return;
    addToQuote(addBtn.dataset.id);
    flashAdded(addBtn, "Agregado ✓");
  });

  /* ---------------------------------------------------------------------
     Keyboard: Esc closes overlays
     --------------------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeMobileMenu();
      closeQuoteModal();
    }
  });

  /* =========================================================================
     SOLICITUD DE COTIZACIÓN
     -------------------------------------------------------------------------
     Esto NO es un carrito de compras ni procesa pagos ni ventas en línea.
     Únicamente permite que un cliente arme una lista de productos de interés
     y la envíe junto con sus datos de contacto, para que personal de
     Almacén La Charra se comunique posteriormente. Cualquier compra se
     concreta de forma presencial, conforme a la ley vigente.
     ========================================================================= */
  const QUOTE_STORAGE_KEY = "laCharraQuoteItems";

  function loadQuoteItems() {
    try {
      const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQuoteItems() {
    try {
      localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state.quote));
    } catch (e) {
      /* almacenamiento no disponible: la sesión simplemente no persiste */
    }
  }

  state.quote = loadQuoteItems();
  let quoteStep = "cart";

  function quoteTotalCount() {
    return state.quote.reduce((sum, i) => sum + i.qty, 0);
  }

  const quoteFab = $("#quoteFab");
  const quoteFabCount = $("#quoteFabCount");
  const quoteModal = $("#quoteModal");
  const quoteModalClose = $("#quoteModalClose");
  const quoteModalContent = $("#quoteModalContent");

  function updateQuoteFab() {
    const count = quoteTotalCount();
    quoteFabCount.textContent = String(count);
    quoteFabCount.hidden = count === 0;
  }

  function flashAdded(btn, label) {
    if (!btn) return;
    const original = btn.textContent;
    btn.classList.add("is-added");
    btn.textContent = label || "Agregado ✓";
    setTimeout(() => {
      btn.classList.remove("is-added");
      btn.textContent = original;
    }, 1100);
    if (typeof quoteFab.animate === "function") {
      quoteFab.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
        { duration: 320, easing: "ease-out" }
      );
    }
  }

  function addToQuote(id) {
    if (!id) return;
    const existing = state.quote.find((i) => i.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + 1);
    } else {
      state.quote.push({ id: id, qty: 1 });
    }
    saveQuoteItems();
    updateQuoteFab();
    if (quoteModal.classList.contains("is-open") && quoteStep === "cart") {
      renderQuoteModal();
    }
  }

  function removeFromQuote(id) {
    state.quote = state.quote.filter((i) => i.id !== id);
    saveQuoteItems();
    updateQuoteFab();
  }

  function openQuoteModal(step) {
    quoteStep = step || "cart";
    renderQuoteModal();
    quoteModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeQuoteModal() {
    quoteModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function renderQuoteModal() {
    if (quoteStep === "form") renderQuoteForm();
    else if (quoteStep === "success") renderQuoteSuccess();
    else renderQuoteCart();
  }

  function quoteDisclaimer() {
    return `<p class="quote-modal__disclaimer">Esto es únicamente una <strong>solicitud de cotización</strong>: no constituye
      compra ni reserva de ningún producto. La disponibilidad está sujeta a inventario y cualquier
      proceso de compra se realiza posteriormente, de forma presencial y conforme a la ley de armas y
      municiones vigente en Guatemala.</p>`;
  }

  function renderQuoteCart() {
    const items = state.quote;
    quoteModalContent.innerHTML = `
      <div class="quote-step quote-step--cart">
        <p class="eyebrow">Tu solicitud</p>
        <h2 class="quote-modal__title" id="quoteModalTitle">Productos seleccionados</h2>
        ${quoteDisclaimer()}
        ${
          items.length === 0
            ? `<div class="quote-empty">
                <p>Aún no has agregado productos a tu solicitud de cotización.</p>
                <button class="btn btn--outline" id="quoteGoContinue">Ver catálogo</button>
              </div>`
            : `<ul class="quote-list">
                ${items
                  .map((i) => {
                    const p = PRODUCTS.find((x) => x.id === i.id);
                    if (!p) return "";
                    return `
                    <li class="quote-item" data-id="${p.id}">
                      <img src="${imgSrc(p.img)}" alt="${p.name}" class="quote-item__img">
                      <div class="quote-item__info">
                        <p class="quote-item__cat">${CATEGORY_MAP[p.category].short}</p>
                        <p class="quote-item__name">${p.name}</p>
                        <p class="quote-item__meta">${[p.caliber, p.finish].filter(Boolean).join(" · ")}</p>
                      </div>
                      <div class="quote-item__qty">
                        <button class="quote-qty-btn" data-action="dec" aria-label="Disminuir cantidad">−</button>
                        <input type="number" min="1" max="99" value="${i.qty}" class="quote-qty-input" data-action="qty" aria-label="Cantidad">
                        <button class="quote-qty-btn" data-action="inc" aria-label="Aumentar cantidad">+</button>
                      </div>
                      <button class="quote-item__remove" data-action="remove" aria-label="Eliminar producto">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      </button>
                    </li>`;
                  })
                  .join("")}
              </ul>
              <div class="quote-modal__footer">
                <button class="btn btn--outline" id="quoteContinueShopping">Seguir viendo catálogo</button>
                <button class="btn btn--brass btn--lg" id="quoteGoToForm">Solicitar cotización</button>
              </div>`
        }
      </div>`;
  }

  function renderQuoteForm() {
    const items = state.quote;
    quoteModalContent.innerHTML = `
      <div class="quote-step quote-step--form">
        <button class="quote-back" id="quoteBackToCart">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Volver a productos
        </button>
        <p class="eyebrow">Solicitud de cotización</p>
        <h2 class="quote-modal__title" id="quoteModalTitle">Tus datos de contacto</h2>
        ${quoteDisclaimer()}
        <div class="quote-summary">
          <h3>Resumen de tu solicitud</h3>
          <ul>
            ${items
              .map((i) => {
                const p = PRODUCTS.find((x) => x.id === i.id);
                if (!p) return "";
                return `<li><span>${p.name}${p.finish ? " · " + p.finish : ""}</span><span>x${i.qty}</span></li>`;
              })
              .join("")}
          </ul>
        </div>
        <form id="quoteForm" class="quote-form" novalidate>
          <div class="quote-form__row">
            <label>Nombre*<input type="text" name="nombre" autocomplete="given-name" required></label>
            <label>Apellido*<input type="text" name="apellido" autocomplete="family-name" required></label>
          </div>
          <div class="quote-form__row">
            <label>Número de teléfono*<input type="tel" name="telefono" autocomplete="tel" required></label>
            <label>Correo electrónico (opcional)<input type="email" name="correo" autocomplete="email" ></label>
          </div>
          <label>Municipio/departamento o ubicación*<input type="text" name="ubicacion" required></label>
          <label>Comentarios adicionales (opcional)<textarea name="comentarios" rows="3"></textarea></label>
          <p class="quote-form__error" id="quoteFormError" hidden></p>
          <button type="submit" class="btn btn--brass btn--lg quote-form__submit" id="quoteSubmitBtn">Enviar solicitud</button>
        </form>
      </div>`;
  }

  function renderQuoteSuccess() {
    quoteModalContent.innerHTML = `
      <div class="quote-step quote-step--success">
        <span class="quote-success__icon">
          <svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h2 class="quote-modal__title" id="quoteModalTitle">Solicitud enviada</h2>
        <p class="quote-success__text">Solicitud de cotización recibida. Personal de La Charra se pondrá en contacto contigo
        para brindarte información sobre disponibilidad y precios.</p>
        ${quoteDisclaimer()}
        <button class="btn btn--brass btn--lg" id="quoteCloseSuccess">Entendido</button>
      </div>`;
  }

  /* --- Delegación de eventos dentro del modal de cotización (una sola vez) --- */
  quoteModalContent.addEventListener("click", (e) => {
    if (e.target.closest("#quoteGoContinue") || e.target.closest("#quoteContinueShopping")) {
      closeQuoteModal();
      return;
    }
    if (e.target.closest("#quoteGoToForm")) {
      quoteStep = "form";
      renderQuoteModal();
      return;
    }
    if (e.target.closest("#quoteBackToCart")) {
      quoteStep = "cart";
      renderQuoteModal();
      return;
    }
    if (e.target.closest("#quoteCloseSuccess")) {
      closeQuoteModal();
      return;
    }

    const removeBtn = e.target.closest('[data-action="remove"]');
    if (removeBtn) {
      const id = removeBtn.closest(".quote-item").dataset.id;
      removeFromQuote(id);
      renderQuoteCart();
      return;
    }
    const incBtn = e.target.closest('[data-action="inc"]');
    if (incBtn) {
      const id = incBtn.closest(".quote-item").dataset.id;
      const item = state.quote.find((i) => i.id === id);
      if (item) {
        item.qty = Math.min(99, item.qty + 1);
        saveQuoteItems();
        updateQuoteFab();
        renderQuoteCart();
      }
      return;
    }
    const decBtn = e.target.closest('[data-action="dec"]');
    if (decBtn) {
      const id = decBtn.closest(".quote-item").dataset.id;
      const item = state.quote.find((i) => i.id === id);
      if (item) {
        item.qty = Math.max(1, item.qty - 1);
        saveQuoteItems();
        updateQuoteFab();
        renderQuoteCart();
      }
      return;
    }
  });

  quoteModalContent.addEventListener("change", (e) => {
    if (!e.target.matches('[data-action="qty"]')) return;
    const id = e.target.closest(".quote-item").dataset.id;
    const item = state.quote.find((i) => i.id === id);
    if (!item) return;
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 99) val = 99;
    item.qty = val;
    saveQuoteItems();
    updateQuoteFab();
    renderQuoteCart();
  });

  quoteModalContent.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "quoteForm") {
      e.preventDefault();
      handleQuoteFormSubmit(e.target);
    }
  });

  function handleQuoteFormSubmit(form) {
    const errorEl = $("#quoteFormError", quoteModalContent);
    const submitBtn = $("#quoteSubmitBtn", quoteModalContent);
    const data = new FormData(form);
    const nombre = (data.get("nombre") || "").toString().trim();
    const apellido = (data.get("apellido") || "").toString().trim();
    const telefono = (data.get("telefono") || "").toString().trim();
    const correo = (data.get("correo") || "").toString().trim();
    const ubicacion = (data.get("ubicacion") || "").toString().trim();
    const comentarios = (data.get("comentarios") || "").toString().trim();

    if (!nombre || !apellido || !telefono || !ubicacion) {
      errorEl.textContent = "Por favor completa todos los campos obligatorios (*).";
      errorEl.hidden = false;
      return;
    }
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errorEl.textContent = "Ingresa un correo electrónico válido.";
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    const payload = {
      tipo: "solicitud_cotizacion",
      fecha: new Date().toISOString(),
      cliente: { nombre, apellido, telefono, correo, ubicacion, comentarios },
      productos: state.quote
        .map((i) => {
          const p = PRODUCTS.find((x) => x.id === i.id);
          if (!p) return null;
          return {
            id: p.id,
            nombre: p.name,
            categoria: CATEGORY_MAP[p.category].label,
            calibre: p.caliber || "",
            acabado: p.finish || "",
            cantidad: i.qty,
          };
        })
        .filter(Boolean),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    sendQuoteRequest(payload)
      .then(() => {
        state.quote = [];
        saveQuoteItems();
        updateQuoteFab();
        quoteStep = "success";
        renderQuoteModal();
      })
      .catch((err) => {
        console.error("[La Charra] Error al enviar la solicitud de cotización:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar solicitud";
        errorEl.textContent = "No se pudo enviar la solicitud. Intenta nuevamente o contáctanos por WhatsApp.";
        errorEl.hidden = false;
      });
  }

  /* =========================================================================
     ENVÍO DE LA SOLICITUD
     -------------------------------------------------------------------------
     El formulario envía este mismo JSON por POST a una función serverless de
     Vercel (api/cotizacion.js), que es la que realmente manda el correo a
     Almacén La Charra usando las credenciales guardadas como Environment
     Variables en Vercel. Este archivo (que corre en el navegador del
     cliente) nunca contiene contraseñas ni API keys.

     El formato que se envía en "payload" es siempre el mismo:
       {
         tipo: "solicitud_cotizacion",
         fecha: "2026-08-29T12:00:00.000Z",
         cliente: { nombre, apellido, telefono, correo, ubicacion, comentarios },
         productos: [{ id, nombre, categoria, calibre, acabado, cantidad }, ...]
       }
     ========================================================================= */
  const QUOTE_ENDPOINT_URL = "/api/cotizacion";

  function sendQuoteRequest(payload) {
    if (!QUOTE_ENDPOINT_URL) {
      // Salvaguarda por si alguna vez se vacía QUOTE_ENDPOINT_URL: se avisa
      // claramente en la consola en lugar de fingir que el correo se envió.
      console.warn(
        "[La Charra] QUOTE_ENDPOINT_URL no está configurado: la solicitud NO se envió a ningún correo real.",
        payload
      );
      return Promise.reject(new Error("El envío de solicitudes no está configurado."));
    }

    return fetch(QUOTE_ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) =>
      res
        .json()
        .catch(() => ({}))
        .then((data) => {
          if (!res.ok || !data || data.ok === false) {
            throw new Error((data && data.error) || "Respuesta no válida del servidor (" + res.status + ")");
          }
          return data;
        })
    );
  }

  quoteFab.addEventListener("click", () => openQuoteModal("cart"));
  quoteModalClose.addEventListener("click", closeQuoteModal);
  quoteModal.addEventListener("click", (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });

  updateQuoteFab();

  /* ---------------------------------------------------------------------
     Scroll reveal for generic .reveal elements (future-proof hook)
     --------------------------------------------------------------------- */
  const revealables = $$(".reveal");
  if (revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     "Nuestra historia" — scroll suave dentro de Inicio (ya no es una vista aparte)
     --------------------------------------------------------------------- */
  const btnNuestraHistoria = $("#btnNuestraHistoria");
  if (btnNuestraHistoria) {
    btnNuestraHistoria.addEventListener("click", () => {
      const target = $("#aboutSection");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  goTo("inicio", { instant: true });
})();
