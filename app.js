const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const mName = document.getElementById("mName");
const mCat = document.getElementById("mCat");
const mMech = document.getElementById("mMech");

if (closeBtn) {
  closeBtn.onclick = () => modal.close();
}

async function main() {
  const res = await fetch("./library.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load library.json: " + res.status);
  const items = await res.json();

  items.sort(
    (a, b) =>
      (a.category || "").localeCompare(b.category || "") ||
      (a.name || "").localeCompare(b.name || "")
  );

  for (const item of items) {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.innerHTML = `
      <span class="bottle">
        <span class="label">${escapeHtml(item.name)}</span>
      </span>
      <span class="cat">${escapeHtml(item.category)}</span>
    `;
    card.onclick = () => {
      mName.textContent = item.name || "";
      mCat.textContent = item.category || "";
      mMech.textContent = item.mechanism || "";
      modal.showModal();
    };
    grid.appendChild(card);
  }
}

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c])
  );
}

main().catch((err) => {
  document.body.insertAdjacentHTML("beforeend", `<pre>${err}</pre>`);
  console.error(err);
});
