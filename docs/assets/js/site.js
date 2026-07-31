(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const article = document.querySelector("[data-article]");
  const baseUrl = window.DID_FIELD_GUIDE?.baseUrl || "";

  const normalizePath = (path) => {
    const withoutBase = baseUrl && path.startsWith(baseUrl) ? path.slice(baseUrl.length) : path;
    const clean = withoutBase.replace(/index\.html$/, "").replace(/\.html$/, "/");
    return clean.endsWith("/") ? clean : `${clean}/`;
  };

  // Active navigation is resolved in the browser so it works with both pretty
  // local URLs and GitHub Pages project paths.
  const currentPath = normalizePath(location.pathname);
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const linkPath = normalizePath(new URL(link.href).pathname);
    if (linkPath === currentPath) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Mobile navigation.
  const openNav = () => {
    body.classList.add("nav-open");
    document.querySelector("[data-nav-close]")?.focus();
  };
  const closeNav = () => body.classList.remove("nav-open");
  document.querySelector("[data-nav-open]")?.addEventListener("click", openNav);
  document.querySelectorAll("[data-nav-close]").forEach((button) => button.addEventListener("click", closeNav));
  addEventListener("resize", () => {
    if (innerWidth > 860) closeNav();
  });

  // Theme.
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("did-field-guide-theme", next);
  });

  // Reading progress.
  const progress = document.querySelector(".reading-progress span");
  const updateProgress = () => {
    if (!article || !progress) return;
    const articleTop = article.offsetTop + document.querySelector(".app-shell").offsetTop;
    const distance = Math.max(article.scrollHeight - innerHeight + 120, 1);
    const value = Math.min(Math.max((scrollY - articleTop + 80) / distance, 0), 1);
    progress.style.width = `${value * 100}%`;
  };
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();

  // Headings, anchors, and generated table of contents.
  const headings = [...document.querySelectorAll(".article-body h2, .article-body h3")];
  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const usedIds = new Set();
  headings.forEach((heading) => {
    let id = heading.id || slugify(heading.textContent);
    const base = id;
    let count = 2;
    while (usedIds.has(id)) id = `${base}-${count++}`;
    usedIds.add(id);
    heading.id = id;

    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${id}`;
    anchor.setAttribute("aria-label", `Link to ${heading.textContent}`);
    anchor.textContent = "#";
    heading.prepend(anchor);
  });

  const toc = document.querySelector("[data-page-toc]");
  if (toc && headings.length) {
    headings.forEach((heading) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.replace(/^#/, "").trim();
      link.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";
      toc.append(link);
    });

    const tocLinks = [...toc.querySelectorAll("a")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        tocLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
      },
      { rootMargin: "-90px 0px -72% 0px", threshold: [0, 1] }
    );
    headings.forEach((heading) => observer.observe(heading));
  } else {
    document.querySelector(".page-toc")?.setAttribute("hidden", "");
  }

  // Responsive tables.
  document.querySelectorAll(".article-body table").forEach((table) => {
    if (table.parentElement?.classList.contains("table-wrap")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrap";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.append(table);
  });

  // Copy buttons for code samples.
  document.querySelectorAll(".article-body pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      } catch {
        button.textContent = "Select text";
      }
    });
    pre.append(button);
  });

  // Full-text search.
  const dialog = document.querySelector("[data-search-dialog]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  let searchIndex = null;

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  const highlight = (value, query) => {
    const safe = escapeHtml(value);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp(`(${escapedQuery})`, "ig"), "<mark>$1</mark>");
  };

  const loadSearch = async () => {
    if (searchIndex) return searchIndex;
    const response = await fetch(`${baseUrl}/search.json`);
    if (!response.ok) throw new Error("Search index unavailable");
    searchIndex = await response.json();
    return searchIndex;
  };

  const showSearch = async () => {
    if (!dialog) return;
    dialog.showModal();
    input?.focus();
    try {
      await loadSearch();
    } catch {
      if (results) results.innerHTML = '<p class="search-empty">Search is temporarily unavailable. Use the navigation at left.</p>';
    }
  };

  document.querySelector("[data-search-open]")?.addEventListener("click", showSearch);
  document.addEventListener("keydown", (event) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (event.key === "/" && !typing) {
      event.preventDefault();
      showSearch();
    }
    if (event.key === "Escape" && body.classList.contains("nav-open")) closeNav();
  });

  input?.addEventListener("input", async () => {
    const query = input.value.trim().toLowerCase();
    if (!results) return;
    if (query.length < 2) {
      results.innerHTML = '<p class="search-hint">Type at least two characters to search the full guide.</p>';
      return;
    }

    const index = await loadSearch();
    const tokens = query.split(/\s+/).filter(Boolean);
    const ranked = index
      .map((item) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const content = item.content.toLowerCase();
        const score = tokens.reduce((total, token) => {
          if (title.includes(token)) total += 8;
          if (description.includes(token)) total += 4;
          if (content.includes(token)) total += 1;
          return total;
        }, 0);
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 10);

    if (!ranked.length) {
      results.innerHTML = `<p class="search-empty">No pages match “${escapeHtml(input.value.trim())}”.</p>`;
      return;
    }

    results.innerHTML = ranked
      .map(
        (item) => `
          <a class="search-result" href="${baseUrl}${item.url}">
            <strong>${highlight(item.title, query)}</strong>
            <span>${highlight(item.description || "Open this page", query)}</span>
          </a>`
      )
      .join("");
  });
})();
