import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import AddTransactionModal from './components/AddTransactionModal';
import { PlusCircle } from 'lucide-react';
import { DataContext } from './context/DataContext';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addTransaction } = useContext(DataContext);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Welcome to Cash Tracker</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    );
  }

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
            </ul>
          </nav>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-150 ease-in-out"
          >
            Sign Out
          </button>
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
            </Routes>
          </div>
        </main>
      </div>
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTransaction} 
      />
    </Router>
  );
}

export default App;