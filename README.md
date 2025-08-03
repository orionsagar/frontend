# Product Management Frontend

This is a **React + TypeScript** frontend application for managing Products, Projects, and Items.  
It supports user authentication, protected routes, dashboard layout, full CRUD, search/filter, CSV export, and responsive UI with Bootstrap 5.

---

## Features

- User Authentication (Login & Registration) with JWT
- Protected routes with React Context API
- Sidebar dashboard layout with navigation
- Manage Products, Projects, and Items with full CRUD:
  - Create, Read, Update, Delete
  - Edit individual item status or all fields
- Search and filter functionality on all main pages
- Confirmation modal dialog for deletes
- Export filtered lists as CSV files
- Responsive design using Bootstrap 5

---

## Project Structure
```
src/
├── api/
│ └── api.ts # Axios instance setup for API calls
├── components/
│ ├── DashboardLayout.tsx # Sidebar + main content layout
│ ├── ProtectedRoute.tsx # Route guard for authentication
│ ├── LoadingSpinner.tsx # Spinner for loading states
│ └── ConfirmDialog.tsx # Reusable confirmation popup modal
├── context/
│ └── AuthContext.tsx # Auth state and JWT token management
├── pages/
│ ├── Login.tsx
│ ├── Register.tsx
│ ├── dashboard/
│ │ ├── Products.tsx # Products list, search, CRUD, CSV export
│ │ ├── Projects.tsx # Projects list, search, CRUD, CSV export
│ │ ├── Items.tsx # Items list per project, edit status, CRUD, CSV export
│ │ └── summary/
│ │ ├── ProductSummary.tsx
│ │ └── ProjectSummary.tsx
├── utils/
│ └── exportCSV.ts # CSV export utility function
├── App.tsx # Main app with routing
└── index.tsx # React DOM entry point
```
---

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Steps

1. Clone the repository:

git clone https://github.com/yourusername/product-management-frontend.git
cd product-management-frontend


## Install dependencies:

npm install
# or
yarn install

## Setup .env file for API base URL:
REACT_APP_API_BASE_URL=http://localhost:5000/api

## Start the development server:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Usage

    Visit /register to create an account or /login to sign in.

    After login, you will be redirected to the dashboard /dashboard/products.

    Use the sidebar navigation to switch between Products, Projects, and Items.

    Use the search box on each page to filter records dynamically.

    Click "Edit" to modify any entry or "Delete" to remove (with confirmation dialog).

    For Items, you can edit the status inline or click another edit button to edit all details.

    Export the visible filtered data as CSV using the "Export CSV" button on Products, Projects, and Items pages.

    Logout from the sidebar.
