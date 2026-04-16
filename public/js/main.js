//* using fake server
//^ run `npm run server` in the terminal before using the app

import { loadProducts } from "./pages/products.js";
import { loadCategories } from "./pages/categories.js";
import { loadSuppliers } from "./pages/suppliers.js";
import { loadReports } from "./pages/reports.js";
import { loadOrders } from "./pages/orders.js";
import { loadActivityLog } from "./pages/activity.js";
import { loadDashboard } from "./pages/dashboard.js";
import { loadStockAdjustments } from "./pages/stockadjustment.js";
import { checkAuth, initLogoutButton } from "./pages/login.js";

$(document).ready(function () {
  const currentUser = checkAuth();
  if (!currentUser) return;

  initLogoutButton();

  const savedPage = localStorage.getItem("currentPage") || "Dashboard";
  navigateTo(savedPage);

  $(".nav-item").on("click", function () {
    const text = $(this).data("page");
    if (!text) return;
    navigateTo(text);
  });
});

function navigateTo(text) {
  $("#pageTitle").text(text);
  $(".nav-item").removeClass("active-content");
  $(`.nav-item[data-page="${text}"]`).addClass("active-content");

  localStorage.setItem("currentPage", text);

  switch (text) {
    case "Dashboard":
      loadDashboard();
      break;
    case "Products":
      loadProducts();
      break;
    case "Categories":
      loadCategories();
      break;
    case "Suppliers":
      loadSuppliers();
      break;
    case "Reports":
      loadReports();
      break;
    case "Purchase Orders":
      loadOrders();
      break;
    case "Stock Adjustments":
      loadStockAdjustments();
      break;
    case "Activity Log":
      loadActivityLog();
      break;
    default:
      loadDashboard();
      break;
  }
}
