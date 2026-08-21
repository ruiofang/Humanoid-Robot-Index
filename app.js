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
})();
