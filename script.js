const works = [
  {
    title: "Executive Strategy Deck: Product Expansion",
    type: "presentation",
    year: "2025",
    summary: "Narrative-led board presentation mapping market entry options and expected revenue impact.",
    tags: ["strategy", "board", "market"],
    link: "#"
  },
  {
    title: "Q4 Customer Research Synthesis",
    type: "document",
    year: "2025",
    summary: "50-page findings doc translating interviews and survey data into product decisions.",
    tags: ["research", "insights", "ux"],
    link: "#"
  },
  {
    title: "Designing Decision-Making Rituals",
    type: "article",
    year: "2024",
    summary: "Long-form article on team operating systems and lightweight governance for fast organizations.",
    tags: ["leadership", "operations", "writing"],
    link: "#"
  },
  {
    title: "Sales Enablement Storyline",
    type: "presentation",
    year: "2024",
    summary: "Global sales kick-off deck with product positioning, objection handling, and GTM sequencing.",
    tags: ["sales", "enablement", "gtm"],
    link: "#"
  },
  {
    title: "Knowledge Base Architecture",
    type: "document",
    year: "2024",
    summary: "Internal documentation system blueprint with governance, ownership, and taxonomy model.",
    tags: ["documentation", "systems", "operations"],
    link: "#"
  },
  {
    title: "How to Write Better Product Narratives",
    type: "article",
    year: "2023",
    summary: "Practical framework for building product communication that aligns users, design, and engineering.",
    tags: ["product", "storytelling", "communication"],
    link: "#"
  },
  {
    title: "Annual Impact Review",
    type: "presentation",
    year: "2023",
    summary: "Performance narrative tying initiative-level outcomes to company-level strategic priorities.",
    tags: ["impact", "analytics", "leadership"],
    link: "#"
  },
  {
    title: "Editorial Standards and Voice Guide",
    type: "document",
    year: "2022",
    summary: "Reference guide for writing quality, consistency, and tone across customer and internal channels.",
    tags: ["editorial", "style", "brand"],
    link: "#"
  },
  {
    title: "Building Better Briefs",
    type: "article",
    year: "2022",
    summary: "A concise playbook for project briefs that reduce ambiguity and accelerate execution.",
    tags: ["process", "planning", "execution"],
    link: "#"
  }
];

const grid = document.getElementById("portfolio-grid");
const template = document.getElementById("card-template");
const resultMeta = document.getElementById("results-meta");
const searchInput = document.getElementById("search");
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));

let activeFilter = "all";
let searchTerm = "";

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function syncMetrics() {
  const counts = {
    total: works.length,
    presentation: works.filter((item) => item.type === "presentation").length,
    document: works.filter((item) => item.type === "document").length,
    article: works.filter((item) => item.type === "article").length
  };

  document.getElementById("metric-total").textContent = counts.total;
  document.getElementById("metric-presentations").textContent = counts.presentation;
  document.getElementById("metric-documents").textContent = counts.document;
  document.getElementById("metric-articles").textContent = counts.article;
}

function applyFilters() {
  return works.filter((item) => {
    const filterPass = activeFilter === "all" || item.type === activeFilter;
    if (!filterPass) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const blob = [item.title, item.summary, item.tags.join(" "), item.year, item.type]
      .join(" ")
      .toLowerCase();

    return blob.includes(searchTerm);
  });
}

function renderWorks() {
  const filtered = applyFilters();
  grid.innerHTML = "";

  resultMeta.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"} shown`;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No work found. Try another keyword or switch the active filter.";
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((item, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.style.animationDelay = `${0.03 * index}s`;

    card.querySelector(".work-type").textContent = titleCase(item.type);
    card.querySelector(".work-year").textContent = item.year;
    card.querySelector(".work-title").textContent = item.title;
    card.querySelector(".work-summary").textContent = item.summary;

    const tagsContainer = card.querySelector(".work-tags");
    item.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      tagsContainer.appendChild(li);
    });

    const link = card.querySelector(".work-link");
    link.href = item.link;
    link.textContent = item.link === "#" ? "Add project URL" : "Open work";

    grid.appendChild(card);
  });
}

function setActiveFilter(type) {
  activeFilter = type;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === type;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  renderWorks();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderWorks();
});

syncMetrics();
renderWorks();
