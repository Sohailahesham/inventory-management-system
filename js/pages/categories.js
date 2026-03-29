import renderTable from "../components/table.js";
import { fetchData, deleteData, postData } from "../services/api.js"; // ✅ ADDED: postData for activity log
import { getModal } from "../components/modal.js";
import renderPagination, { paginateData } from "../components/pagination.js";
import { GetCurrentDate } from "../utils/helpers.js"; // ✅ ADDED: for activity log timestamp

let products = [];
let categories = [];
let lastFiltered = [];
let currentPage = 1;
let PAGE_SIZE = 5;

export async function loadCategories() {
  await loadData();
  renderCategories();
  setupEventListeners();
}

async function loadData() {
  products = await fetchData("products");
  categories = await fetchData("categories");
  lastFiltered = [...categories];
}

function renderCategories() {
  let html = `
    <div class="d-flex gap-2 mb-3 align-items-center p-3 bg-white rounded border">
      <i class="bi bi-search text-muted"></i>
      <input type="text" id="searchCat" placeholder="Search categories..." 
        class="form-control form-control-sm border-0 shadow-none">
      <button class="btn btn-primary btn-sm px-3 ms-auto text-nowrap" id="addCategoryBtn">
        <i class="bi bi-plus-lg"></i> Add Category
      </button>
    </div>
    <div id="searchStats" class="mb-2 small text-muted"></div>
    <div id="categoriesTableContainer">
      ${getTableHtml()}
    </div>
  `;
  document.getElementById("pageContent").innerHTML = html;
}

function getTableHtml(filteredCategories = categories) {
  const paginated = paginateData(filteredCategories, currentPage, PAGE_SIZE);
  let tableData = paginated.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || "-",
    products: getProductsNumber(c.id),
  }));
  let columns = ["name", "description", "products"];
  return (
    renderTable(tableData, columns)
    + renderPagination(filteredCategories.length, currentPage, PAGE_SIZE)
  );
}

function setupEventListeners() {
  document.getElementById("searchCat")?.addEventListener("input", filterCategories);

  document.querySelector("#categoriesTableContainer").addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");
    if (editBtn) handleEdit(editBtn.dataset.id);
    else if (deleteBtn) handleDelete(deleteBtn.dataset.id);

    const pageBtn = e.target.closest(".page-link");
    if (pageBtn) {
      const page = Number(pageBtn.dataset.page);
      const totalPages = Math.ceil(lastFiltered.length / PAGE_SIZE);
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      document.getElementById("categoriesTableContainer").innerHTML = getTableHtml(lastFiltered);
    }
  });

  document.querySelector("#categoriesTableContainer").addEventListener("change", (e) => {
    const pageSizeSelect = e.target.closest(".page-size-select");
    if (pageSizeSelect) {
      PAGE_SIZE = Number(pageSizeSelect.value);
      currentPage = 1;
      document.getElementById("categoriesTableContainer").innerHTML = getTableHtml(lastFiltered);
    }
  });

  document.querySelector("#addCategoryBtn").addEventListener("click", () => handleAdd());
}

function filterCategories() {
  let searchTerm = document.getElementById("searchCat").value.toLowerCase();
  let filtered = categories.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm)
      || (c.description && c.description.toLowerCase().includes(searchTerm))
    );
  });
  lastFiltered = filtered;
  currentPage = 1;
  document.getElementById("categoriesTableContainer").innerHTML = getTableHtml(filtered);
  updateStats(filtered.length, searchTerm);
}

function updateStats(count, searchTerm) {
  let statsDiv = document.getElementById("searchStats");
  if (!statsDiv) return;
  statsDiv.innerHTML = searchTerm
    ? `Found ${count} categor${count !== 1 ? "ies" : "y"} matching "${searchTerm}"`
    : "";
}

function getProductsNumber(id) {
  let count = products.filter((p) => p.categoryId == id).length;
  return `<span class="badge rounded-pill px-2" style="background:#eff6ff; color:#3b82f6;">${count}</span>`;
}

function handleAdd() {
  getModal("categories", "Add", "", async () => {
    await loadData();
    filterCategories();
  });
}

function handleEdit(id) {
  getModal("categories", "Edit", id, async () => {
    await loadData();
    filterCategories();
  });
}

async function handleDelete(id) {
  let c = categories.find((e) => e.id == id);
  if (!c) return;

  let productsCount = products.filter((p) => p.categoryId == id).length;
  if (productsCount > 0) {
    alert("You can't delete this category because it has products.");
    return;
  }

  let ok = confirm(`Delete category "${c.name}"?`);
  if (!ok) return;

  await deleteData("categories", id);

  await postData("activityLog", {
    action: "DELETE_CATEGORY",
    details: `Category deleted: ${c.name}`,
    user: "admin",
    timestamp: GetCurrentDate(),
  });

  await loadData();
  lastFiltered = [...categories];
  currentPage = 1;
  filterCategories();
}