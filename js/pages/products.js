import renderTable from "../components/table.js";
import renderPagination, { paginateData } from "../components/pagination.js";
import { fetchData, updateData, postData, deleteData } from "../services/api.js";
import { getModal } from "../components/modal.js";
import { GetCurrentDate } from "../utils/helpers.js"; 

let products = [];
let categories = [];
let suppliers = [];
let lastFiltered = [];
let currentPage = 1;
let PAGE_SIZE = 5;

export async function loadProducts() {
  await loadData();
  lastFiltered = [...products];
  renderProducts();
  setupEventListeners();
}

async function loadData() {
  products = await fetchData("products");
  categories = await fetchData("categories");
  suppliers = await fetchData("suppliers");
}

function renderProducts() {
  let categoryOptions = categories
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");

  let html = `
    <div class="mb-3 p-3 bg-white rounded border">
      <div class="d-flex align-items-center gap-2 mb-2">
        <i class="bi bi-search text-muted"></i>
        <input type="text" id="searchProd" placeholder="Search products..."
          class="form-control form-control-sm border-0 shadow-none flex-grow-1">
      </div>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <select id="categoryFilter"
          class="form-select form-select-sm border-0 shadow-none flex-grow-1"
          style="min-width:130px; max-width:200px;">
          <option value="">All Categories</option>
          ${categoryOptions}
        </select>
        <select id="statusFilter"
          class="form-select form-select-sm border-0 shadow-none flex-grow-1"
          style="min-width:120px; max-width:180px;">
          <option value="">All Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button class="btn btn-primary btn-sm px-3 ms-auto text-nowrap" id="addProductBtn">
          <i class="bi bi-plus-lg"></i> Add Product
        </button>
      </div>
    </div>
    <div id="searchStats" class="mb-2 small text-muted px-1"></div>
    <div id="productsTableContainer">
      ${getTableHtml()}
    </div>
  `;
  document.getElementById("pageContent").innerHTML = html;
}

function getTableHtml(filteredProducts = products) {
  const paginated = paginateData(filteredProducts, currentPage, PAGE_SIZE);
  let tableData = paginated.map((p) => ({
    id: p.id,
    sku: `<span class="sku-badge">${p.sku}</span>`,
    name: p.name,
    category: getCategoryName(p.categoryId),
    supplier: getSupplierName(p.supplierId),
    price: p.price,
    quantity: p.quantity,
    status: getStatus(p.quantity, p.reorderLevel),
  }));
  let columns = ["sku", "name", "category", "supplier", "price", "quantity", "status"];
  return (
    renderTable(tableData, columns)
    + renderPagination(filteredProducts.length, currentPage, PAGE_SIZE)
  );
}

function setupEventListeners() {
  document.getElementById("searchProd")?.addEventListener("input", filterProducts);
  document.getElementById("categoryFilter")?.addEventListener("change", filterProducts);
  document.getElementById("statusFilter")?.addEventListener("change", filterProducts);

  document.querySelector("#productsTableContainer").addEventListener("click", function (e) {
    const pageBtn = e.target.closest(".page-link");
    if (pageBtn) {
      const page = Number(pageBtn.dataset.page);
      const totalPages = Math.ceil(lastFiltered.length / PAGE_SIZE);
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      document.getElementById("productsTableContainer").innerHTML = getTableHtml(lastFiltered);
      return;
    }
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");
    if (editBtn) handleEdit(editBtn.dataset.id);
    else if (deleteBtn) handleDelete(deleteBtn.dataset.id);
  });

  document.querySelector("#productsTableContainer").addEventListener("change", (e) => {
    const pageSizeSelect = e.target.closest(".page-size-select");
    if (pageSizeSelect) {
      PAGE_SIZE = Number(pageSizeSelect.value);
      currentPage = 1;
      document.getElementById("productsTableContainer").innerHTML = getTableHtml(lastFiltered);
    }
  });

  document.querySelector("#addProductBtn").addEventListener("click", () => handleAdd());
}

function filterProducts() {
  let searchTerm = document.getElementById("searchProd").value.toLowerCase();
  let categoryId = document.getElementById("categoryFilter").value;
  let statusFilter = document.getElementById("statusFilter").value;

  let filtered = products.filter((p) => {
    if (searchTerm) {
      let matches =
        p.name.toLowerCase().includes(searchTerm)
        || p.sku.toLowerCase().includes(searchTerm)
        || getCategoryName(p.categoryId).toLowerCase().includes(searchTerm)
        || getSupplierName(p.supplierId).toLowerCase().includes(searchTerm);
      if (!matches) return false;
    }
    if (categoryId && p.categoryId != categoryId) return false;
    if (statusFilter) {
      if (statusFilter === "out" && p.quantity > 0) return false;
      if (statusFilter === "low" && (p.quantity <= 0 || p.quantity > Number(p.reorderLevel))) return false;
      if (statusFilter === "in" && p.quantity <= Number(p.reorderLevel)) return false;
    }
    return true;
  });

  lastFiltered = filtered;
  currentPage = 1;
  document.getElementById("productsTableContainer").innerHTML = getTableHtml(filtered);
  updateStats(filtered.length, searchTerm, categoryId, statusFilter);
}

function updateStats(count, searchTerm, categoryId, statusFilter) {
  let statsDiv = document.getElementById("searchStats");
  if (!statsDiv) return;
  statsDiv.innerHTML =
    searchTerm || categoryId || statusFilter
      ? `Found ${count} product${count !== 1 ? "s" : ""}`
      : "";
}

function getCategoryName(id) {
  let cat = categories.find((e) => e.id == id);
  return cat ? cat.name : "undefined";
}
function getSupplierName(id) {
  let sup = suppliers.find((e) => e.id == id);
  return sup ? sup.name : "undefined";
}
function getStatus(quantity, reorderLevel) {
  if (quantity <= 0) return `<span class="status-badge status-out">Out of stock</span>`;
  else if (quantity <= Number(reorderLevel)) return `<span class="status-badge status-low">Low stock</span>`;
  else return `<span class="status-badge status-in">In stock</span>`;
}

function handleAdd() {
  getModal("products", "Add", "", async () => {
    await loadData();
    lastFiltered = [...products];
    filterProducts();
  });
}

function handleEdit(id) {
  getModal("products", "Edit", id, async () => {
    await loadData();
    lastFiltered = [...products];
    filterProducts();
  });
}

async function handleDelete(id) {
  let p = products.find((e) => e.id == id);
  if (!p) return;

  let ok = confirm(`Delete product "${p.name}"?`);
  if (!ok) return;

  await deleteData("products", id);

  await postData("activityLog", {
    action: "DELETE_PRODUCT",
    details: `Product deleted: ${p.name} (${p.sku})`,
    user: "admin",
    timestamp: GetCurrentDate(),
  });

  await loadData();
  lastFiltered = [...products];
  currentPage = 1;
  filterProducts();
}