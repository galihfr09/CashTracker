import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
// import SettingsPage from './pages/SettingsPage'; // Optional
import AddTransactionModal from './components/AddTransactionModal';
import { PlusCircle } from 'lucide-react';
import { DataContext } from './context/DataContext';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { addTransaction } = useContext(DataContext);

  // Removed useEffect for fetchTransactions as DataContext handles it

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
          <h1 className="text-2xl font-semibold mb-6">Cash Tracker</h1>
          <nav>
            <ul>
              <li><NavLink to="/" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>Dashboard</NavLink></li>
              <li><NavLink to="/transactions" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>Transactions</NavLink></li>
              <li><NavLink to="/categories" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>Categories</NavLink></li>
              {/* <li><NavLink to="/settings" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}>Settings</NavLink></li> */}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-150 ease-in-out"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Transaction
            </button>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
          </div>
        </main>
      </div>
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTransaction} // Pass the addTransaction function
      />
    </Router>
  );
}

export default App;