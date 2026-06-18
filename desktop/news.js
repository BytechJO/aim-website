let newsSections = [];

/* =========================
   LOAD NEWS
========================= */
async function loadNewsArticles() {
  const el = g("news-c");
  el.innerHTML = '<div class="loading"><div class="spin"></div></div>';

  try {
    const news = await api("/news");
    S.cache.news = news;

    if (!news.length) {
      el.innerHTML = empty("📰", "No news found.");
      return;
    }

    el.innerHTML = `
      <div class="tw"><table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Published</th>
            <th>Order</th>
            <th>Sections</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${news
            .map(
              (n) => `
            <tr>
              <td>
                <div style="font-weight:600;color:var(--dark)">${esc(n.title_en)}</div>
                <div style="font-size:11px;color:var(--muted)">${esc(n.title_ar)}</div>
              </td>
              <td>
                <span class="badge ${n.is_published ? "b-on" : "b-off"}">
                  ${n.is_published ? "Published" : "Draft"}
                </span>
              </td>
              <td>${n.sort_order ?? 0}</td>
              <td>${Array.isArray(n.sections) ? n.sections.length : 0}</td>
              <td class="acts">
                <button class="btn btn-ghost btn-sm" onclick="openNews(${n.id})">Edit</button>
                <button class="btn btn-ghost-err btn-sm" onclick="delNews(${n.id})">Delete</button>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table></div>
    `;
  } catch (e) {
    el.innerHTML = err(e.message);
  }
}

/* =========================
   MODAL
========================= */
function openNews(id) {
  const e = id ? (S.cache.news || []).find((x) => x.id === id) : null;

  try {
    newsSections = Array.isArray(e?.sections)
      ? JSON.parse(JSON.stringify(e.sections))
      : [];
  } catch {
    newsSections = [];
  }

  // normalize old sections
  newsSections = newsSections.map((sec) => ({
    title_en: sec.title_en || "",
    title_ar: sec.title_ar || "",
    blocks: Array.isArray(sec.blocks) ? sec.blocks : [],
  }));

  modal(
    id ? "Edit News" : "New News",
    `
      <div class="fsec">Main Info</div>

      <div class="fg">
        <label>Title EN *</label>
        <input id="n1" value="${esc(e?.title_en || "")}">
      </div>

      <div class="fg">
        <label>Title AR *</label>
        <input id="n2" value="${esc(e?.title_ar || "")}">
      </div>

      <div class="fg">
        <label>Description EN</label>
        <textarea id="n3">${esc(e?.description_en || "")}</textarea>
      </div>

      <div class="fg">
        <label>Description AR</label>
        <textarea id="n4">${esc(e?.description_ar || "")}</textarea>
      </div>

      <div class="fg">
        <label>Hero Image</label>
        ${upZoneHtml("news-img", e?.hero_image || "")}
      </div>
<div class="fg">
  <label>Thumbnail Image</label>
  ${upZoneHtml("news-thumb", e?.thumbnail_image || "")}
</div>

<div class="fg">
  <label>Title Color</label>
  <input
    id="n7"
    type="color"
    value="${e?.title_color || "#000000"}"
    style="height:50px"
  >
</div>
      <div class="frow">
        <div class="fg">
          <label>Sort Order</label>
          <input id="n5" type="number" value="${e?.sort_order ?? 0}">
        </div>

        <div class="fg">
          <label>Published</label>
          <select id="n6">
            <option value="true" ${e?.is_published ? "selected" : ""}>Yes</option>
            <option value="false" ${!e?.is_published ? "selected" : ""}>No</option>
          </select>
        </div>
      </div>

      <div class="fsec">Sections</div>

      <div style="margin-bottom:16px">
        <button class="btn btn-dark btn-sm" onclick="addNewsSection()">
          + Add Section
        </button>
      </div>

      <div id="news-sections-box"></div>
    `,
    [
      { l: "Cancel", c: "btn-ghost", a: closeModal },
      {
        l: id ? "Save Changes" : "Create News",
        c: "btn-dark",
        a: () => saveNews(id),
      },
    ],
    { wide: true },
  );

  renderNewsSections();
}

/* =========================
   SECTIONS
========================= */
function addNewsSection() {
  newsSections.push({
    title_en: "",
    title_ar: "",
    blocks: [],
  });

  renderNewsSections();
}

function removeNewsSection(index) {
  newsSections.splice(index, 1);
  renderNewsSections();
}

function moveNewsSection(index, dir) {
  const ni = index + dir;
  if (ni < 0 || ni >= newsSections.length) return;

  [newsSections[index], newsSections[ni]] = [
    newsSections[ni],
    newsSections[index],
  ];

  renderNewsSections();
}

function setNewsSection(index, key, value) {
  if (!newsSections[index]) return;
  newsSections[index][key] = value;
}

function renderNewsSections() {
  const box = g("news-sections-box");
  if (!box) return;

  if (!newsSections.length) {
    box.innerHTML = `<div class="empty" style="padding:28px">No sections yet.</div>`;
    return;
  }

  box.innerHTML = newsSections
    .map(
      (s, i) => `
    <div style="border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px;background:var(--white)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong>Section ${i + 1}</strong>

        <div class="acts">
          <button class="btn btn-ghost btn-sm" onclick="moveNewsSection(${i},-1)">↑</button>
          <button class="btn btn-ghost btn-sm" onclick="moveNewsSection(${i},1)">↓</button>
          <button class="btn btn-ghost-err btn-sm" onclick="removeNewsSection(${i})">Delete</button>
        </div>
      </div>

      ${renderNewsSectionFields(s, i)}
    </div>
  `,
    )
    .join("");
}

function renderNewsSectionFields(s, sectionIndex) {
  return `
    <div class="frow">
      <div class="fg">
        <label>Section Title EN</label>
        <input
          value="${esc(s.title_en || "")}"
          onchange="setNewsSection(${sectionIndex},'title_en',this.value)"
        >
      </div>

      <div class="fg">
        <label>Section Title AR</label>
        <input
          value="${esc(s.title_ar || "")}"
          onchange="setNewsSection(${sectionIndex},'title_ar',this.value)"
        >
      </div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0">
      <button class="btn btn-ghost btn-sm" onclick="addNewsBlock(${sectionIndex},'content')">+ Content</button>
      <button class="btn btn-ghost btn-sm" onclick="addNewsBlock(${sectionIndex},'image')">+ Image</button>
      <button class="btn btn-ghost btn-sm" onclick="addNewsBlock(${sectionIndex},'gallery')">+ Gallery</button>
      <button class="btn btn-ghost btn-sm" onclick="addNewsBlock(${sectionIndex},'list')">+ List</button>
    </div>

    <div>
      ${renderNewsBlocks(s.blocks || [], sectionIndex)}
    </div>
  `;
}

/* =========================
   BLOCKS
========================= */
function addNewsBlock(sectionIndex, type) {
  const section = newsSections[sectionIndex];
  if (!section) return;

  if (!Array.isArray(section.blocks)) {
    section.blocks = [];
  }

  if (type === "content") {
    section.blocks.push({
      type: "content",
      content_en: "",
      content_ar: "",
    });
  }

  if (type === "image") {
    section.blocks.push({
      type: "image",
      image: "",
    });
  }

  if (type === "gallery") {
    section.blocks.push({
      type: "gallery",
      images: [],
    });
  }

  if (type === "list") {
    section.blocks.push({
      type: "list",
      items_en: [],
      items_ar: [],
    });
  }

  renderNewsSections();
}

function removeNewsBlock(sectionIndex, blockIndex) {
  const blocks = newsSections[sectionIndex]?.blocks;
  if (!blocks) return;

  blocks.splice(blockIndex, 1);
  renderNewsSections();
}

function moveNewsBlock(sectionIndex, blockIndex, dir) {
  const blocks = newsSections[sectionIndex]?.blocks;
  if (!blocks) return;

  const ni = blockIndex + dir;
  if (ni < 0 || ni >= blocks.length) return;

  [blocks[blockIndex], blocks[ni]] = [blocks[ni], blocks[blockIndex]];

  renderNewsSections();
}

function blockHeader(title, sectionIndex, blockIndex) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <strong>${title}</strong>

      <div class="acts">
        <button class="btn btn-ghost btn-sm" onclick="moveNewsBlock(${sectionIndex},${blockIndex},-1)">↑</button>
        <button class="btn btn-ghost btn-sm" onclick="moveNewsBlock(${sectionIndex},${blockIndex},1)">↓</button>
        <button class="btn btn-ghost-err btn-sm" onclick="removeNewsBlock(${sectionIndex},${blockIndex})">Delete</button>
      </div>
    </div>
  `;
}

function renderNewsBlocks(blocks, sectionIndex) {
  if (!blocks.length) {
    return `<div class="empty" style="padding:12px">No blocks yet</div>`;
  }

  return blocks
    .map((block, blockIndex) => {
      if (block.type === "content") {
        return `
        <div style="margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--bg)">
          ${blockHeader("Content Block", sectionIndex, blockIndex)}

          <div class="fg">
            <label>Content EN</label>
            <textarea onchange="setNewsBlock(${sectionIndex},${blockIndex},'content_en',this.value)">${esc(block.content_en || "")}</textarea>
          </div>

          <div class="fg">
            <label>Content AR</label>
            <textarea onchange="setNewsBlock(${sectionIndex},${blockIndex},'content_ar',this.value)">${esc(block.content_ar || "")}</textarea>
          </div>
        </div>
      `;
      }

      if (block.type === "image") {
        return `
        <div style="margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--bg)">
          ${blockHeader("Image Block", sectionIndex, blockIndex)}

          ${newsBlockImageHtml(sectionIndex, blockIndex, block.image || "")}
        </div>
      `;
      }

      if (block.type === "gallery") {
        return `
        <div style="margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--bg)">
          ${blockHeader("Gallery Block", sectionIndex, blockIndex)}

          ${newsBlockGalleryHtml(sectionIndex, blockIndex, block.images || [])}
        </div>
      `;
      }

      if (block.type === "list") {
        return `
        <div style="margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--bg)">
          ${blockHeader("List Block", sectionIndex, blockIndex)}

          <div class="fg">
            <label>Items EN</label>
            <textarea
              placeholder="One item per line"
              onchange="setNewsBlockList(${sectionIndex},${blockIndex},'items_en',this.value)"
            >${esc((block.items_en || []).join("\n"))}</textarea>
          </div>

          <div class="fg">
            <label>Items AR</label>
            <textarea
              placeholder="كل نقطة بسطر"
              onchange="setNewsBlockList(${sectionIndex},${blockIndex},'items_ar',this.value)"
            >${esc((block.items_ar || []).join("\n"))}</textarea>
          </div>
        </div>
      `;
      }

      return "";
    })
    .join("");
}

function setNewsBlock(sectionIndex, blockIndex, key, value) {
  const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
  if (!block) return;

  block[key] = value;
}

function setNewsBlockList(sectionIndex, blockIndex, key, value) {
  const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
  if (!block) return;

  block[key] = value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

/* =========================
   IMAGE BLOCK
========================= */
function newsBlockImageHtml(sectionIndex, blockIndex, url) {
  return `
    <div class="upzone" onclick="g('news-block-img-${sectionIndex}-${blockIndex}').click()">
      <input
        type="file"
        id="news-block-img-${sectionIndex}-${blockIndex}"
        accept="image/*,.svg"
        hidden
        onchange="uploadNewsBlockImage(this,${sectionIndex},${blockIndex})"
      >

      <div class="upzone-in">
        ${
          url
            ? `
              <img src="${esc(url)}" class="up-preview" onerror="this.style.opacity='.3'">
              <button
                class="up-rm"
                onclick="event.stopPropagation();removeNewsBlockImage(${sectionIndex},${blockIndex})"
              >
                ✕ Remove
              </button>
            `
            : `
              <div class="up-ic-wrap">${UP_SVG}</div>
              <div class="up-txt">Click to upload image</div>
              <div class="up-hint">PNG · JPG · SVG · WebP</div>
            `
        }
      </div>
    </div>
  `;
}

async function uploadNewsBlockImage(input, sectionIndex, blockIndex) {
  if (!input.files?.[0]) return;

  const file = input.files[0];
  input.value = "";

  const fd = new FormData();
  fd.append("file", file);

  try {
    const r = await fetch(BASE + "/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${S.token}` },
      body: fd,
    });

    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Upload failed");

    const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
    if (!block) return;

    block.image = d.url;

    renderNewsSections();
    toast("Image uploaded", "ok");
  } catch (e) {
    toast("Upload failed: " + e.message, "err");
  }
}

function removeNewsBlockImage(sectionIndex, blockIndex) {
  const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
  if (!block) return;

  block.image = "";
  renderNewsSections();
}

/* =========================
   GALLERY BLOCK
========================= */
function newsBlockGalleryHtml(sectionIndex, blockIndex, urls) {
  return `
    <div class="arr-grid">
      ${(urls || [])
        .map(
          (url, imgIndex) => `
        <div class="arr-item">
          <img class="arr-thumb" src="${esc(url)}" onerror="this.style.opacity='.3'">
          <button
            class="arr-rm"
            onclick="removeNewsBlockGalleryImage(${sectionIndex},${blockIndex},${imgIndex})"
          >
            ✕
          </button>
        </div>
      `,
        )
        .join("")}

      <label class="arr-add">
        <input
          type="file"
          accept="image/*,.svg"
          multiple
          hidden
          onchange="addNewsBlockGalleryImages(this,${sectionIndex},${blockIndex})"
        >
        <span class="arr-add-ic">+</span>
        <span>Add</span>
      </label>
    </div>
  `;
}

async function addNewsBlockGalleryImages(input, sectionIndex, blockIndex) {
  if (!input.files?.length) return;

  const files = Array.from(input.files);
  input.value = "";

  const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
  if (!block) return;

  if (!Array.isArray(block.images)) {
    block.images = [];
  }

  try {
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      const r = await fetch(BASE + "/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${S.token}` },
        body: fd,
      });

      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Upload failed");

      block.images.push(d.url);
    }

    renderNewsSections();
    toast("Gallery images added", "ok");
  } catch (e) {
    toast("Upload failed: " + e.message, "err");
  }
}

function removeNewsBlockGalleryImage(sectionIndex, blockIndex, imgIndex) {
  const block = newsSections[sectionIndex]?.blocks?.[blockIndex];
  if (!block?.images) return;

  block.images.splice(imgIndex, 1);
  renderNewsSections();
}

/* =========================
   SAVE / DELETE
========================= */
async function saveNews(id) {
  const body = {
    title_en: v("n1"),
    title_ar: v("n2"),
    description_en: v("n3"),
    description_ar: v("n4"),
    hero_image: v("news-img"),
    thumbnail_image: v("news-thumb"),
    title_color: v("n7"),
    sort_order: +v("n5") || 0,
    is_published: v("n6") === "true",
    sections: newsSections,
  };

  if (!body.title_en || !body.title_ar) {
    toast("Please enter both titles", "err");
    return;
  }

  try {
    if (id) {
      await api(`/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await api("/news", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    closeModal();
    toast(id ? "News updated" : "News created", "ok");
    loadNewsArticles();
  } catch (e) {
    toast(e.message, "err");
  }
}

function delNews(id) {
  confirm2(
    `Delete this news article?<br><br><span style="font-size:12px;color:var(--muted)">This action cannot be undone.</span>`,
    async () => {
      try {
        await api(`/news/${id}`, { method: "DELETE" });
        toast("News deleted", "ok");
        loadNewsArticles();
      } catch (e) {
        toast(e.message, "err");
      }
    },
  );
}
