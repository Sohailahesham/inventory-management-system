# 📦 Inventory Management System

> A responsive web application for managing products, suppliers, categories, purchase orders, stock adjustments, and activity logs — built for small businesses.

---

## 🧩 Overview

This system helps small businesses track their inventory, manage suppliers, handle purchase orders, and monitor stock levels with real-time low stock alerts and a clean, intuitive interface.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure and content |
| CSS3 | Custom styling |
| Bootstrap 5 | Responsive layout and components |
| Bootstrap Icons | Icon library |
| JavaScript ES6+ | Application logic and interactivity |
| jQuery 3.7.1 | DOM manipulation and AJAX |
| JSON Server | Mock REST API for development |

---

## ✨ Features

- 📦 **Product Management** — Add, edit, delete, search, and filter products by category and status
- 🏷️ **Categories** — Manage product categories with product count tracking
- 🚛 **Suppliers** — Manage supplier contacts with product count tracking
- 🛒 **Purchase Orders** — Create orders, filter by status, and receive stock
- 🔄 **Stock Adjustments** — Increase or decrease quantities with reason tracking
- 📈 **Reports** — Low stock and inventory value reports
- 📋 **Activity Log** — Track all important actions
- 🚨 **Low Stock Alerts** — Visual warnings based on reorder level
- 📄 **Pagination** — Dynamic rows-per-page control across all tables
- 📱 **Responsive UI** — Full sidebar on desktop, icon-only on mobile

---

## 📁 Project Structure

```
inventory-management-system/
│
├── index.html                  # Main entry point
├── package.json                # Dependencies (JSON Server)
├── README.md
│
├── 📁 css/
│   └── style.css               # Global styles
│
├── 📁 data/
│   └── db.json                 # JSON Server database
│
└── 📁 js/
    ├── main.js                 # App entry: routing & navigation
    │
    ├── 📁 services/
    │   └── api.js              # Fetch wrapper (GET, POST, PUT, DELETE)
    │
    ├── 📁 utils/
    │   └── helpers.js          # Validation functions for all entities
    │
    ├── 📁 components/
    │   ├── table.js            # Dynamic table generator
    │   ├── pagination.js       # Pagination + rows-per-page component
    │   ├── modal.js            # Generic modal handler
    │   └── form.js             # Form builders for each entity
    │
    └── 📁 pages/
        ├── dashboard.js        # Overview with stats and alerts
        ├── products.js         # Product management
        ├── categories.js       # Category management
        ├── suppliers.js        # Supplier management
        ├── orders.js           # Purchase order handling
        ├── stockadjustment.js      # Stock adjustments
        ├── reports.js          # Reports page
        └── activity.js         # Activity log
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/inventory-management-system.git
cd inventory-management-system

# 2. Install dependencies
npm install

# 3. Start JSON Server
npx json-server --watch data/db.json --port 3000

# 4. Open index.html in your browser
```

---

## 🗄️ API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Add new product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/categories` | Get all categories |
| POST | `/categories` | Add new category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |
| GET | `/suppliers` | Get all suppliers |
| POST | `/suppliers` | Add new supplier |
| PUT | `/suppliers/:id` | Update supplier |
| DELETE | `/suppliers/:id` | Delete supplier |
| GET | `/orders` | Get all purchase orders |
| POST | `/orders` | Create new order |
| PUT | `/orders/:id` | Update order (e.g. receive) |
| GET | `/adjustments` | Get all stock adjustments |
| POST | `/adjustments` | Add stock adjustment |
| GET | `/activityLog` | Get activity log |

---

## 🧩 Components

### `table.js`
Generates a dynamic HTML table from any array of objects.

```javascript
renderTable(data, columns, actions)
// data    — array of objects
// columns — array of column keys to display
// actions — boolean, show edit/delete buttons (default: true)
```

### `pagination.js`
Renders pagination controls with rows-per-page selector.

```javascript
renderPagination(totalItems, currentPage, pageSize)
paginateData(data, currentPage, pageSize)
```

### `modal.js`
Generic modal that loads the right form based on entity type.

```javascript
getModal(obj, action, id, onSuccess)
// obj       — "products" | "categories" | "suppliers" | "orders"
// action    — "Add" | "Edit"
// id        — entity ID (empty string for Add)
// onSuccess — callback after successful save
```

### `form.js`
Builds form HTML for each entity.

```javascript
makeProductForm(id)
makeCategoryForm(id)
makeSupplierForm(id)
makeOrderForm()
```

---

## ✅ Validation Rules

### Product
- Name: required, 4–25 characters
- SKU: required, format `LETTERS-000` (e.g. `LP-001`)
- Price, Quantity, Reorder Level: required, greater than zero
- Unit: required, must be `pcs`, `kg`, or `box`

### Category
- Name: required, 4–25 characters
- Description: required, 11–40 characters

### Supplier
- Name: required
- Contact: required, full name (two words, letters only)
- Email: required, valid email format
- Phone: required, valid phone format
- Address: required, 3–20 characters

### Order
- Supplier: required
- Items: at least one item required

---

## 👥 Team

| Role | Name |
|---|---|
| 👑 Team Leader | Abdulrahman Siraj El-deen |
| 👩‍💻 Member | Sohaila Hesham |
| 👨‍💻 Member | Ammar Fayez |
| 👨‍💻 Member | Omar Alsheikh |

---

<p align="center">Made with ❤️</p>
