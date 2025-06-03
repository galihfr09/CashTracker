# Cash Tracker

A simple application to track personal cash transactions and visualize spending patterns.

## Project Setup

1.  **Clone the repository (if applicable) or ensure you have the project files.**
2.  **Navigate to the project directory:**
    ```bash
    cd CashTracker
    ```
3.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn) installed.
    ```bash
    npm install
    # or
    # yarn install
    ```

## Running the Development Server

1.  **Start the Vite development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
2.  Open your browser and go to the URL provided by Vite (usually `http://localhost:5173`).

## Key Features (Planned)

*   **Data Entry:** Manually add transaction records (date, description, amount, category).
*   **Visualization:**
    *   Time-series charts (spending/income over time).
    *   Category-based charts (pie/donut chart for spending breakdown).
*   **Filtering & Exploration:**
    *   Filter by date range.
    *   Filter by category.
    *   Search by transaction description.
*   **Transaction History:** View, sort, and (eventually) edit transactions.
*   **Category Management:** Add, edit, and delete spending/income categories.

## Project Structure

*   `public/`: Static assets.
*   `src/`: Main application source code.
    *   `components/`: Reusable UI components (e.g., `AddTransactionModal.jsx`).
    *   `pages/`: Top-level page components (e.g., `DashboardPage.jsx`, `TransactionsPage.jsx`).
    *   `App.jsx`: Main application component with routing.
    *   `main.jsx`: Entry point of the React application.
    *   `index.css`: Global styles and Tailwind CSS setup.
*   `index.html`: Main HTML file.
*   `vite.config.js`: Vite configuration.
*   `tailwind.config.js`: Tailwind CSS configuration.
*   `postcss.config.js`: PostCSS configuration.
*   `package.json`: Project dependencies and scripts.

## Technologies Used

*   React
*   Vite
*   React Router
*   Tailwind CSS
*   Chart.js (for visualizations - planned)
*   Lucide React (for icons)