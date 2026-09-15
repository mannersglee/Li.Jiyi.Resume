const renderList = (items) => items.map((item) => `<li>${item}</li>`).join("");

const renderPortfolioItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${item.title}</h3>
      <span class="status">${item.type} · ${item.status}</span>
    </div>
    <p>${item.summary}</p>
  </article>
`).join("");

const renderNoteItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3><a href="${item.link}">${item.title}</a></h3>
      <span class="status">${item.category} · ${item.date}</span>
    </div>
    <p>${item.summary || ""}</p>
  </article>
`).join("");

const renderExperienceItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${item.company}</h3>
      <span class="status">${item.role} · ${item.period}</span>
    </div>
    <ul>${renderList(item.items)}</ul>
  </article>
`).join("");

const renderProjectItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${item.title}</h3>
      <span class="status">${item.role} · ${item.period}</span>
    </div>
    <div class="project-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    <p>${item.description}</p>
    <p class="achievement">${item.achievement}</p>
  </article>
`).join("");

const textList = (items, limit = items.length) => items
  .slice(0, limit)
  .map((item) => `<li>${item}</li>`)
  .join("");

const renderResumeDocument = (data) => {
  const root = document.getElementById("resume-root");
  if (!root) {
    return;
  }

  const person = data.person;
  const contact = [
    ["基本信息", `${person.gender} | ${person.age}`],
    ["电话", person.phone],
    ["邮箱", person.email],
    ["求职方向", person.target]
  ];

  root.innerHTML = `
    <header class="resume-header">
      <div class="resume-heading">
        <p class="resume-eyebrow">Internship Resume</p>
        <h1 class="resume-name">${person.name}</h1>
        <p class="resume-role">${person.role}</p>
        <p class="resume-summary">${person.summary}</p>
      </div>
      <aside class="resume-sidebar">
        <img class="resume-photo" src="${data.assets.photo}" alt="${person.name}证件照">
        <dl class="resume-contact">
          ${contact.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
        </dl>
      </aside>
    </header>

    <section class="resume-section">
      <h2>教育经历</h2>
      ${data.education.map((item) => `
        <article class="resume-item">
          <div class="resume-item-head">
            <h3>${item.school} · ${item.degree} · ${item.major}</h3>
            <span class="resume-meta">${item.period}</span>
          </div>
          <p class="resume-compact"><strong>主修课程：</strong>${item.courses.join("、")}</p>
          ${item.highlights.length ? `<ul class="resume-list">${textList(item.highlights, 2)}</ul>` : ""}
        </article>
      `).join("")}
    </section>

    <section class="resume-section">
      <h2>实习经历</h2>
      ${data.experience.map((item) => `
        <article class="resume-item">
          <div class="resume-item-head">
            <h3>${item.company} · ${item.role}</h3>
            <span class="resume-meta">${item.period}</span>
          </div>
          <ul class="resume-list">${textList(item.items, 5)}</ul>
        </article>
      `).join("")}
    </section>

    <section class="resume-section">
      <h2>项目经历</h2>
      ${data.projects.map((item) => `
        <article class="resume-item">
          <div class="resume-item-head">
            <h3>${item.title} · ${item.role}</h3>
            <span class="resume-meta">${item.period}</span>
          </div>
          <div class="resume-tags">${item.tags.join(" / ")}</div>
          <p>${item.description}</p>
          <p class="resume-note">${item.achievement}</p>
        </article>
      `).join("")}
    </section>

    <section class="resume-section">
      <h2>专业技能</h2>
      <p class="resume-skill-line">${data.skills.join("、")}</p>
      ${data.certificates.length ? `<p>资格证书：${data.certificates.join("、")}</p>` : ""}
    </section>
  `;
};

const setupResumeDownload = () => {
  const buttons = [
    document.getElementById("download-resume"),
    document.getElementById("download-resume-footer")
  ].filter(Boolean);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.open("resume-template.html", "_blank", "noopener,noreferrer");
    });
  });
};

const renderProfile = (data) => {
  if (!document.getElementById("role")) {
    return;
  }

  document.getElementById("role").textContent = data.person.role;
  document.getElementById("profile-role").textContent = data.person.target;
  document.getElementById("summary").textContent = data.person.summary;
  document.getElementById("portrait").src = data.assets.photo;
  document.getElementById("year").textContent = new Date().getFullYear();

  const info = [
    ["基本信息", `${data.person.gender} | ${data.person.age}`],
    ["电话", data.person.phone],
    ["邮箱", data.person.email],
    ["定位", data.person.role]
  ];

  document.getElementById("personal-info").innerHTML = info
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");

  document.getElementById("education").innerHTML = data.education.map((item) => `
    <article class="timeline-item">
      <h3>${item.school} · ${item.major}</h3>
      <p class="meta">${item.degree} | ${item.period}</p>
      <p>主修课程：${item.courses.join("、")}</p>
      <ul>${renderList(item.highlights)}</ul>
    </article>
  `).join("");

  document.getElementById("experience").innerHTML = renderExperienceItems(data.experience.slice(0, 3));

  document.getElementById("project-list").innerHTML = renderProjectItems(data.projects);

  document.getElementById("skills").innerHTML = data.skills
    .map((skill) => `<span class="tag">${skill}</span>`)
    .join("");

  document.getElementById("certificates").innerHTML = data.certificates
    .map((cert) => `<span class="cert">${cert}</span>`)
    .join("");

  document.getElementById("portfolio-list").innerHTML = renderPortfolioItems(data.portfolio.slice(0, 3));

  document.getElementById("notes-list").innerHTML = renderNoteItems(data.notes.slice(0, 3));
  setupResumeDownload();
};

fetch("data/profile.json")
  .then((response) => response.json())
  .then(renderProfile)
  .catch(() => {
    const summary = document.getElementById("summary");
    if (summary) {
      summary.textContent = "个人信息加载失败，请通过本地服务器或 GitHub Pages 访问本站点。";
    }
  });
