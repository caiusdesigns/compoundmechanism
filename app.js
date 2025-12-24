const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const mName = document.getElementById("mName");
const mCat = document.getElementById("mCat");
const mMech = document.getElementById("mMech");
const entryCount = document.getElementById("entryCount");
const categoryCount = document.getElementById("categoryCount");

if (closeBtn) {
  closeBtn.onclick = () => modal.close();
}

async function main() {
  const res = await fetch("./library.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load library.json: " + res.status);
  const items = await res.json();

  const categories = new Set();

  items.sort(
    (a, b) =>
      (a.category || "").localeCompare(b.category || "") ||
      (a.name || "").localeCompare(b.name || "")
  );

  for (const item of items) {
    if (item.category) {
      categories.add(item.category);
    }

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p class="name">${escapeHtml(item.name)}</p>
      <p class="cat">${escapeHtml(item.category)}</p>
    `;
    card.onclick = () => {
      mName.textContent = item.name || "";
      mCat.textContent = item.category || "";
      mMech.textContent = item.mechanism || "";
      modal.showModal();
    };
    grid.appendChild(card);
  }

  if (entryCount) {
    entryCount.textContent = items.length.toString();
  }

  if (categoryCount) {
    categoryCount.textContent = categories.size.toString();
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
