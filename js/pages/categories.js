import renderTable from "../components/table.js";
import {
  fetchData,
  postData,
  updateData,
  deleteData,
} from "../services/api.js";

let products = [];
let categories = [];
let suppliers = [];

export async function loadCategories() {
  await loadData();
  renderCategories();
  exposeTableHandlers();
  setupEventListeners();
}

async function loadData() {
  products = await fetchData("products");
  categories = await fetchData("categories");
  suppliers = await fetchData("suppliers");
}

//* render the whole html of Categories page
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
    
    <!-- Search Stats -->
    <div id="searchStats" class="mb-2 small text-muted"></div>
    
    <!-- Categories Table -->
    <div id="categoriesTableContainer">
      ${getTableHtml()}
    </div>
  `;

  document.getElementById("pageContent").innerHTML = html;
}

//* to bring the table whatever there is a filter/ search/ all cats
function getTableHtml(filteredCategories = categories) {
  let tableData = filteredCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || "-",
    products: getProductsNumber(c.id),
  }));

  let columns = ["id", "name", "description", "products"];

  return renderTable(tableData, columns);
}

//* for all event listeners
function setupEventListeners() {
  document
    .getElementById("searchCat")
    ?.addEventListener("input", filterCategories);
}

function exposeTableHandlers() {
  window.handleDelete = handleDelete;
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
  await loadData();
  filterCategories();
}

//* search
function filterCategories() {
  let searchTerm = document.getElementById("searchCat").value.toLowerCase();

  //^ Search by name
  let filtered = categories.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm)
      || (c.description && c.description.toLowerCase().includes(searchTerm))
    );
  });

  //& Change Table data
  document.getElementById("categoriesTableContainer").innerHTML =
    getTableHtml(filtered);

  //& update status
  updateStats(filtered.length, searchTerm);
}

//* stats
function updateStats(count, searchTerm) {
  let statsDiv = document.getElementById("searchStats");
  if (!statsDiv) return;

  if (searchTerm) {
    statsDiv.innerHTML = `Found ${count} categor${count !== 1 ? "ies" : "y"} matching "${searchTerm}"`;
  } else {
    statsDiv.innerHTML = "";
  }
}

function getProductsNumber(id) {
  let count = products.filter((p) => p.categoryId == id).length;
  return `<span class="badge rounded-pill px-2" style="background:#eff6ff; color:#3b82f6;">${count}</span>`;
}
