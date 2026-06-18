let subEnhancements = [];

/* =========================
   LOAD Enhancements
========================= */
async function loadEnhancements() {
  const el = g("enhancements-c");
  el.innerHTML = '<div class="loading"><div class="spin"></div></div>';

  try {
    const enhancement = await api("/enhancements");
    S.cache.enhancement = enhancement;

    if (!enhancement.length) {
      el.innerHTML = empty("✨", "No enhancements found.");
      return;
    }

    el.innerHTML = `
      <div class="tw">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Order</th>
              <th>Sub Enhancements</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            ${enhancement
              .map(
                (n) => `
                  <tr>
                    <td>
                      <div style="font-weight:600;color:var(--dark)">
                        ${esc(n.title_en)}
                      </div>

                      <div style="font-size:11px;color:var(--muted)">
                        ${esc(n.title_ar)}
                      </div>
                    </td>

                    <td>${n.sort_order ?? 0}</td>

                    <td>
                      ${
                        Array.isArray(n.sub_enhancements)
                          ? n.sub_enhancements.length
                          : 0
                      }
                    </td>

                    <td class="acts">
                      <button
                        class="btn btn-ghost btn-sm"
                        onclick="openEnhancement(${n.id})"
                      >
                        Edit
                      </button>

                      <button
                        class="btn btn-ghost-err btn-sm"
                        onclick="delEnhancement(${n.id})"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    el.innerHTML = err(e.message);
  }
}

/* =========================
   MODAL
========================= */
function openEnhancement(id) {
  const e = id ? (S.cache.enhancement || []).find((x) => x.id === id) : null;

  try {
    subEnhancements = Array.isArray(e?.sub_enhancements)
      ? JSON.parse(JSON.stringify(e.sub_enhancements))
      : [];
  } catch {
    subEnhancements = [];
  }

  subEnhancements = subEnhancements.map((s) => ({
    title_en: s.title_en || "",
    title_ar: s.title_ar || "",
    description_en: s.description_en || "",
    description_ar: s.description_ar || "",
    image_url: Array.isArray(s.image_url) ? s.image_url : [],
    sort_order: s.sort_order || 0,
  }));

  modal(
    id ? "Edit Enhancement" : "New Enhancement",
    `
      <div class="fsec">Main Info</div>

      <div class="fg">
        <label>Title EN *</label>
        <input id="e1" value="${esc(e?.title_en || "")}">
      </div>

      <div class="fg">
        <label>Title AR *</label>
        <input id="e2" value="${esc(e?.title_ar || "")}">
      </div>

      <div class="fg">
        <label>Description EN</label>
        <textarea id="e3">${esc(e?.description_en || "")}</textarea>
      </div>

      <div class="fg">
        <label>Description AR</label>
        <textarea id="e4">${esc(e?.description_ar || "")}</textarea>
      </div>

      <div class="fg">
        <label>Images</label>
        ${arrZoneHtml("enh-images", e?.image_url || [])}
      </div>

      <div class="fg">
        <label>Sort Order</label>
        <input
          id="e5"
          type="number"
          value="${e?.sort_order ?? 0}"
        >
      </div>

      <div class="fsec">Sub Enhancements</div>

      <div style="margin-bottom:16px">
        <button
          class="btn btn-dark btn-sm"
          onclick="addSubEnhancement()"
        >
          + Add Sub Enhancement
        </button>
      </div>

      <div id="enhancement-sub-enhancements-box"></div>
    `,
    [
      {
        l: "Cancel",
        c: "btn-ghost",
        a: closeModal,
      },
      {
        l: id ? "Save Changes" : "Create Enhancement",
        c: "btn-dark",
        a: () => saveEnhancement(id),
      },
    ],
    { wide: true },
  );

  renderSubEnhancements();
}

/* =========================
   SECTIONS
========================= */
function addSubEnhancement() {
  subEnhancements.push({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image_url: [],
    sort_order: subEnhancements.length,
  });

  renderSubEnhancements();
}

function removeSubEnhancement(index) {
  subEnhancements.splice(index, 1);
  renderSubEnhancements();
}

function moveSubEnhancement(index, dir) {
  const ni = index + dir;
  if (ni < 0 || ni >= subEnhancements.length) return;

  [subEnhancements[index], subEnhancements[ni]] = [
    subEnhancements[ni],
    subEnhancements[index],
  ];

  renderSubEnhancements();
}

function setSubEnhancement(index, key, value) {
  if (!subEnhancements[index]) return;
  subEnhancements[index][key] = value;
}

function renderSubEnhancements() {
  const box = g("enhancement-sub-enhancements-box");
  if (!box) return;

  if (!subEnhancements.length) {
    box.innerHTML = `<div class="empty" style="padding:28px">No sub enhancements yet.</div>`;
    return;
  }

  box.innerHTML = subEnhancements
    .map(
      (s, i) => `
      <div style="border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px;background:var(--white)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <strong>Sub Enhancement ${i + 1}</strong>

          <div class="acts">
            <button class="btn btn-ghost btn-sm" onclick="moveSubEnhancement(${i},-1)">↑</button>
            <button class="btn btn-ghost btn-sm" onclick="moveSubEnhancement(${i},1)">↓</button>
            <button class="btn btn-ghost-err btn-sm" onclick="removeSubEnhancement(${i})">Delete</button>
          </div>
        </div>

        <div class="frow">
          <div class="fg">
            <label>Title EN</label>
            <input value="${esc(s.title_en || "")}" onchange="setSubEnhancement(${i},'title_en',this.value)">
          </div>

          <div class="fg">
            <label>Title AR</label>
            <input value="${esc(s.title_ar || "")}" onchange="setSubEnhancement(${i},'title_ar',this.value)">
          </div>
        </div>

        <div class="fg">
          <label>Description EN</label>
          <textarea onchange="setSubEnhancement(${i},'description_en',this.value)">${esc(s.description_en || "")}</textarea>
        </div>

        <div class="fg">
          <label>Description AR</label>
          <textarea onchange="setSubEnhancement(${i},'description_ar',this.value)">${esc(s.description_ar || "")}</textarea>
        </div>

        <div class="fg">
          <label>Images</label>
          ${arrZoneHtml(`sub-imgs-${i}`, s.image_url || [])}
        </div>

        <div class="fg">
          <label>Sort Order</label>
          <input type="number" value="${s.sort_order ?? i}" onchange="setSubEnhancement(${i},'sort_order',+this.value || 0)">
        </div>
      </div>
    `,
    )
    .join("");
}

/* =========================
   SAVE / DELETE
========================= */
async function saveEnhancement(id) {
  const body = {
    title_en: v("e1"),
    title_ar: v("e2"),
    description_en: v("e3"),
    description_ar: v("e4"),
    image_url: JSON.parse(g("enh-images").value || "[]"),
    sort_order: +v("e5") || 0,

    sub_enhancements: subEnhancements.map((s, i) => ({
      title_en: s.title_en || "",
      title_ar: s.title_ar || "",
      description_en: s.description_en || "",
      description_ar: s.description_ar || "",
      image_url: JSON.parse(g(`sub-imgs-${i}`)?.value || "[]"),
      sort_order: +s.sort_order || i,
    })),
  };

  if (
    !body.title_en ||
    !body.title_ar ||
    !body.description_en ||
    !body.description_ar
  ) {
    toast("Please fill required fields", "err");
    return;
  }

  try {
    if (id) {
      await api(`/enhancements/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await api("/enhancements", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    closeModal();
    toast(id ? "Enhancement updated" : "Enhancement created", "ok");
    loadEnhancements();
  } catch (e) {
    toast(e.message, "err");
  }
}

function delEnhancement(id) {
  confirm2(
    `Delete this enhancement?<br><br><span style="font-size:12px;color:var(--muted)">This action cannot be undone.</span>`,
    async () => {
      try {
        await api(`/enhancements/${id}`, { method: "DELETE" });
        toast("Enhancement deleted", "ok");
        loadEnhancements();
      } catch (e) {
        toast(e.message, "err");
      }
    },
  );
}
