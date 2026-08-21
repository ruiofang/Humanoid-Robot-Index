(() => {
  const data = window.ROBOT_DATA || [];
  const grid = document.querySelector("#robotGrid");
  const template = document.querySelector("#cardTemplate");
  const searchInput = document.querySelector("#searchInput");
  const regionFilter = document.querySelector("#regionFilter");
  const sceneFilter = document.querySelector("#sceneFilter");
  const resultCount = document.querySelector("#resultCount");
  const clearButton = document.querySelector("#clearButton");
  const emptyState = document.querySelector("#emptyState");
  const viewToggle = document.querySelector("#viewToggle");

  const normalize = value => value.toLocaleLowerCase().replace(/\s+/g, "");

  function render() {
    const query = normalize(searchInput.value);
    const region = regionFilter.value;
    const scene = sceneFilter.value;
    const filtered = data.filter(item => {
      const searchable = normalize([item.name, item.en, item.product, item.country, item.desc, ...item.scenes].join(" "));
      return (!query || searchable.includes(query)) &&
        (region === "all" || item.region === region) &&
        (scene === "all" || item.scenes.includes(scene));
    });

    grid.replaceChildren();
    filtered.forEach((item, index) => {
      const card = template.content.cloneNode(true);
      const article = card.querySelector("article");
      article.style.setProperty("--delay", `${Math.min(index * 25, 300)}ms`);
      card.querySelector(".index").textContent = String(data.indexOf(item) + 1).padStart(2, "0");
      card.querySelector(".country").textContent = item.country;
      card.querySelector(".monogram").textContent = item.mark;
      card.querySelector("h3").textContent = item.name;
      card.querySelector(".stage").textContent = item.stage;
      card.querySelector(".product").textContent = `${item.en} · ${item.product}`;
      card.querySelector(".description").textContent = item.desc;
      const tags = card.querySelector(".tags");
      item.scenes.forEach(sceneName => {
        const tag = document.createElement("span");
        tag.textContent = sceneName;
        tags.append(tag);
      });
      const link = card.querySelector(".visit");
      link.href = item.url;
      link.setAttribute("aria-label", `访问${item.name}官方网站`);
      grid.append(card);
    });

    resultCount.textContent = filtered.length;
    emptyState.hidden = filtered.length !== 0;
    clearButton.hidden = !query && region === "all" && scene === "all";
  }

  function clearFilters() {
    searchInput.value = "";
    regionFilter.value = "all";
    sceneFilter.value = "all";
    render();
  }

  document.querySelector("#totalCount").textContent = data.length;
  document.querySelector("#chinaCount").textContent = data.filter(item => item.region === "china").length;
  document.querySelector("#globalCount").textContent = data.filter(item => item.region === "global").length;
  document.querySelector("#year").textContent = new Date().getFullYear();

  searchInput.addEventListener("input", render);
  regionFilter.addEventListener("change", render);
  sceneFilter.addEventListener("change", render);
  clearButton.addEventListener("click", clearFilters);
  document.querySelector("#emptyClear").addEventListener("click", clearFilters);
  viewToggle.addEventListener("click", () => {
    const compact = grid.classList.toggle("compact");
    viewToggle.setAttribute("aria-pressed", String(compact));
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      searchInput.blur();
      render();
    }
  });

  render();

  // Lightweight animated network background. It pauses for reduced-motion users.
  const canvas = document.querySelector("#networkCanvas");
  const context = canvas?.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && context && !reducedMotion) {
    let width = 0;
    let height = 0;
    let points = [];
    let animationFrame;
    const pointer = { x: -1000, y: -1000 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(80, Math.max(32, Math.floor(width / 20)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .18,
        vy: (Math.random() - .5) * .18,
        size: Math.random() * 1.2 + .35
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < -20 || point.x > width + 20) point.vx *= -1;
        if (point.y < -20 || point.y > height + 20) point.vy *= -1;
        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (pointerDistance < 150) {
          point.x += (point.x - pointer.x) * .002;
          point.y += (point.y - pointer.y) * .002;
        }
        context.beginPath();
        context.fillStyle = index % 6 === 0 ? "rgba(174,255,95,.62)" : "rgba(136,121,255,.48)";
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
        for (let next = index + 1; next < points.length; next++) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 105) {
            context.beginPath();
            context.strokeStyle = `rgba(133,119,255,${(1 - distance / 105) * .09})`;
            context.lineWidth = .5;
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      });
      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationFrame);
      else draw();
    });
    resize();
    draw();
  }
})();
