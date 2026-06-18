console.log("cover_extra loaded");
/* =========================
   LOAD Cover Extras
========================= */
async function loadCoverExtras() {
  const el = g("cover-extras-c");
  el.innerHTML = '<div class="loading"><div class="spin"></div></div>';

  try {
    const extras = await api("/cover-extras");
    S.cache.coverExtras = extras;

    if (!extras.length) {
      el.innerHTML = empty("📚", "No cover extras found.");
      return;
    }

    el.innerHTML = `
      <div class="tw">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            ${extras
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

                    <td class="acts">
                      <button
                        class="btn btn-ghost btn-sm"
                        onclick="openCoverExtra(${n.id})"
                      >
                        Edit
                      </button>

                      <button
                        class="btn btn-ghost-err btn-sm"
                        onclick="delCoverExtra(${n.id})"
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
function openCoverExtra(id) {
  const e = id ? (S.cache.coverExtras || []).find((x) => x.id === id) : null;

  modal(
    id ? "Edit Cover Extra" : "New Cover Extra",
    `
      <div class="fg">
        <label>Title EN *</label>
        <input id="ce1" value="${esc(e?.title_en || "")}">
      </div>

      <div class="fg">
        <label>Title AR *</label>
        <input id="ce2" value="${esc(e?.title_ar || "")}">
      </div>

      <div class="fg">
        <label>Description EN</label>
        <textarea id="ce3">${esc(e?.description_en || "")}</textarea>
      </div>

      <div class="fg">
        <label>Description AR</label>
        <textarea id="ce4">${esc(e?.description_ar || "")}</textarea>
      </div>

      <div class="fg">
        <label>Images</label>
        ${arrZoneHtml("cover-extra-images", e?.image_url || [])}
      </div>

      <div class="fg">
        <label>Sort Order</label>
        <input
          id="ce5"
          type="number"
          value="${e?.sort_order ?? 0}"
        >
      </div>
    `,
    [
      {
        l: "Cancel",
        c: "btn-ghost",
        a: closeModal,
      },
      {
        l: id ? "Save Changes" : "Create Cover Extra",
        c: "btn-dark",
        a: () => saveCoverExtra(id),
      },
    ],
    { wide: true },
  );
}


/* =========================
   SAVE / DELETE
========================= */
async function saveCoverExtra(id) {
  const body = {
    title_en: v("ce1"),
    title_ar: v("ce2"),
    description_en: v("ce3"),
    description_ar: v("ce4"),
    image_url: JSON.parse(g("cover-extra-images").value || "[]"),
    sort_order: +v("ce5") || 0,
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
      await api(`/cover-extras/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await api("/cover-extras", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    closeModal();
    toast(id ? "Cover extra updated" : "Cover extra created", "ok");
    loadCoverExtras();
  } catch (e) {
    toast(e.message, "err");
  }
}

function delCoverExtra(id) {
  confirm2(
    `Delete this cover extra?<br><br><span style="font-size:12px;color:var(--muted)">This action cannot be undone.</span>`,
    async () => {
      try {
        await api(`/cover-extras/${id}`, {
          method: "DELETE",
        });

        toast("Cover extra deleted", "ok");
        loadCoverExtras();
      } catch (e) {
        toast(e.message, "err");
      }
    },
  );
}
