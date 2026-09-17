const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const noteViewerLink = (link) => `note-viewer.html?file=${encodeURIComponent(link)}`;

const renderList = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderAttachments = (attachments = []) => {
  if (!attachments.length) {
    return `
      <div class="card-attachments empty" aria-label="附件">
        <span class="attachment-button disabled" aria-disabled="true"><span aria-hidden="true">↓</span>附件待上传</span>
      </div>
    `;
  }

  return `
    <div class="card-attachments" aria-label="附件下载">
      ${attachments.map((attachment) => {
        const file = typeof attachment === "string" ? attachment : attachment.file;
        const label = typeof attachment === "string" ? "下载附件" : attachment.label || "下载附件";
        return `<a class="attachment-button" href="${escapeHtml(file)}" download><span aria-hidden="true">↓</span>${escapeHtml(label)}</a>`;
      }).join("")}
    </div>
  `;
};

const renderPortfolioItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${escapeHtml(item.title)}</h3>
      <span class="status">${escapeHtml(item.type)}${item.status ? ` · ${escapeHtml(item.status)}` : ""}</span>
    </div>
    <p>${escapeHtml(item.summary)}</p>
    ${renderAttachments(item.attachments)}
  </article>
`).join("");

const renderNoteItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3><a href="${noteViewerLink(item.link)}">${escapeHtml(item.title)}</a></h3>
      <span class="status">${escapeHtml(item.category)} · ${escapeHtml(item.date)}</span>
    </div>
    <p>${escapeHtml(item.summary || "")}</p>
  </article>
`).join("");

const renderExperienceItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${escapeHtml(item.company)}</h3>
      <span class="status">${escapeHtml(item.role)} · ${escapeHtml(item.period)}</span>
    </div>
    <ul>${renderList(item.items)}</ul>
    ${renderAttachments(item.attachments)}
  </article>
`).join("");

const renderProjectItems = (items) => items.map((item) => `
  <article class="content-card">
    <div class="item-head">
      <h3>${escapeHtml(item.title)}</h3>
      <span class="status">${escapeHtml(item.role)} · ${escapeHtml(item.period)}</span>
    </div>
    <div class="project-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <p>${escapeHtml(item.description)}</p>
    <p class="achievement">${escapeHtml(item.achievement)}</p>
    ${renderAttachments(item.attachments)}
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

const renderMarkdown = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inCode = false;
  let inMath = false;
  let inHtmlHeading = false;
  let htmlHeadingLevel = 1;
  let htmlHeadingLines = [];
  let codeLang = "";
  let codeLines = [];
  let mathLines = [];
  let listLines = [];
  let listType = "";
  let quoteLines = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listLines.length) {
      const tag = listType === "ol" ? "ol" : "ul";
      html.push(`<${tag}>${listLines.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${tag}>`);
      listLines = [];
      listType = "";
    }
  };

  const flushQuote = () => {
    if (quoteLines.length) {
      html.push(`<blockquote>${quoteLines.map((item) => `<p>${inlineMarkdown(item)}</p>`).join("")}</blockquote>`);
      quoteLines = [];
    }
  };

  const flushCode = () => {
    html.push(`<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
    codeLang = "";
  };

  const flushMath = () => {
    html.push(`<div class="math-block">\\[${escapeHtml(mathLines.join("\n"))}\\]</div>`);
    mathLines = [];
  };

  const renderMathBlock = (value) => {
    html.push(`<div class="math-block">\\[${escapeHtml(value.trim())}\\]</div>`);
  };

  const flushHtmlHeading = () => {
    html.push(`<h${htmlHeadingLevel} class="align-center">${inlineMarkdown(htmlHeadingLines.join(" ").trim())}</h${htmlHeadingLevel}>`);
    htmlHeadingLines = [];
    htmlHeadingLevel = 1;
  };

  lines.forEach((line) => {
    if (inHtmlHeading) {
      const closeHeading = line.match(/^\s*<\/h([1-5])>\s*$/i);
      if (closeHeading) {
        flushHtmlHeading();
        inHtmlHeading = false;
      } else {
        htmlHeadingLines.push(line.trim());
      }
      return;
    }

    const codeMatch = line.match(/^```(\w+)?\s*$/);
    if (codeMatch) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
        codeLang = codeMatch[1] || "";
      }
      return;
    }

    if (line.trim() === "$$") {
      if (inMath) {
        flushMath();
        inMath = false;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        inMath = true;
      }
      return;
    }

    const singleLineMath = line.trim().match(/^\$\$(.+)\$\$$/);
    if (singleLineMath) {
      flushParagraph();
      flushList();
      flushQuote();
      renderMathBlock(singleLineMath[1]);
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (inMath) {
      mathLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      return;
    }

    const rawHtmlHeading = line.match(/^<h([1-5])(?:\s+[^>]*)?>\s*(.*?)\s*<\/h\1>$/i);
    if (rawHtmlHeading) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push(`<h${rawHtmlHeading[1]} class="align-center">${inlineMarkdown(rawHtmlHeading[2])}</h${rawHtmlHeading[1]}>`);
      return;
    }

    const openHtmlHeading = line.match(/^<h([1-5])(?:\s+[^>]*)?>\s*$/i);
    if (openHtmlHeading) {
      flushParagraph();
      flushList();
      flushQuote();
      inHtmlHeading = true;
      htmlHeadingLevel = Number(openHtmlHeading[1]);
      htmlHeadingLines = [];
      return;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push("<hr>");
      return;
    }

    const heading = line.match(/^(#{1,5})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`);
      return;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ul") {
        flushList();
      }
      listType = "ul";
      listLines.push(listItem[1]);
      return;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if (orderedItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ol") {
        flushList();
      }
      listType = "ol";
      listLines.push(orderedItem[1]);
      return;
    }

    const quote = line.match(/^>\s*(.*)$/);
    if (quote) {
      flushParagraph();
      flushList();
      quoteLines.push(quote[1]);
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushQuote();
  if (inCode) {
    flushCode();
  }
  if (inMath) {
    flushMath();
  }
  if (inHtmlHeading) {
    flushHtmlHeading();
  }

  return html.join("\n");
};

const inlineMarkdown = (value) => escapeHtml(value)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/(^|[^$])\$([^$\n]+)\$(?!\$)/g, '$1<span class="math-inline">\\($2\\)</span>');

const normalizeOutputData = (value) => Array.isArray(value) ? value.join("") : value || "";

const renderNotebookOutput = (output) => {
  if (output.output_type === "stream") {
    return `
      <div class="nb-output nb-output-stream ${output.name === "stderr" ? "stderr" : ""}">
        <pre>${escapeHtml(normalizeOutputData(output.text))}</pre>
      </div>
    `;
  }

  if (output.output_type === "error") {
    const traceback = output.traceback ? output.traceback.join("\n") : `${output.ename}: ${output.evalue}`;
    return `
      <div class="nb-output nb-output-error">
        <pre>${escapeHtml(traceback)}</pre>
      </div>
    `;
  }

  if (output.output_type === "display_data" || output.output_type === "execute_result") {
    const data = output.data || {};

    if (data["image/png"]) {
      return `
        <div class="nb-output nb-output-image">
          <img src="data:image/png;base64,${normalizeOutputData(data["image/png"])}" alt="notebook output">
        </div>
      `;
    }

    if (data["image/jpeg"]) {
      return `
        <div class="nb-output nb-output-image">
          <img src="data:image/jpeg;base64,${normalizeOutputData(data["image/jpeg"])}" alt="notebook output">
        </div>
      `;
    }

    if (data["text/html"]) {
      return `<div class="nb-output nb-output-html">${normalizeOutputData(data["text/html"])}</div>`;
    }

    if (data["text/plain"]) {
      return `
        <div class="nb-output nb-output-plain">
          <pre>${escapeHtml(normalizeOutputData(data["text/plain"]))}</pre>
        </div>
      `;
    }
  }

  return "";
};

const renderNotebookOutputs = (cell) => {
  if (!cell.outputs || cell.outputs.length === 0) {
    return `<div class="nb-output-empty">未执行</div>`;
  }

  return `<div class="nb-outputs">${cell.outputs.map(renderNotebookOutput).join("")}</div>`;
};

const renderNotebook = (notebook) => notebook.cells.map((cell) => {
  const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source || "";
  if (cell.cell_type === "markdown") {
    return `<section class="note-cell markdown-cell">${renderMarkdown(source)}</section>`;
  }

  if (cell.cell_type === "code") {
    const count = cell.execution_count === null ? "" : `[${cell.execution_count}]`;
    return `
      <section class="note-cell code-cell">
        <div class="nb-input">
          <div class="cell-label">In ${count}</div>
          <pre><code>${escapeHtml(source)}</code></pre>
        </div>
        ${renderNotebookOutputs(cell)}
      </section>
    `;
  }

  return "";
}).join("");

const typesetMath = async (root) => {
  if (!window.MathJax) {
    return;
  }

  if (window.MathJax.startup?.promise) {
    await window.MathJax.startup.promise;
  }

  if (window.MathJax.typesetPromise) {
    await window.MathJax.typesetPromise([root]);
  }
};

const renderNoteViewer = async () => {
  const root = document.getElementById("note-content");
  if (!root) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");
  const title = document.getElementById("note-title");
  const meta = document.getElementById("note-meta");
  const rawLink = document.getElementById("note-raw-link");

  if (!file || !file.startsWith("notes/")) {
    root.innerHTML = "<p>未找到笔记文件。</p>";
    return;
  }

  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    rawLink.href = file;
    rawLink.textContent = "查看原文件";
    title.textContent = decodeURIComponent(file.split("/").pop());
    meta.textContent = file.endsWith(".ipynb") ? "Jupyter Notebook" : "Markdown Note";

    if (file.endsWith(".ipynb")) {
      const notebook = await response.json();
      root.innerHTML = renderNotebook(notebook);
      await typesetMath(root);
      return;
    }

    const markdown = await response.text();
    root.innerHTML = `<section class="note-cell markdown-cell">${renderMarkdown(markdown)}</section>`;
    await typesetMath(root);
  } catch (error) {
    root.innerHTML = `<p>笔记加载失败：${escapeHtml(error.message)}</p>`;
  }
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

  document.getElementById("project-list").innerHTML = renderProjectItems(data.projects.slice(0, 3));

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

renderNoteViewer();
