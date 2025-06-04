import React, { createContext, useState, useEffect, useCallback } from 'react';

export const DataContext = createContext();

const DEFAULT_CATEGORIES = ['Makan', 'Jajan', 'Aset', 'Investasi', 'Tagihan', 'Hiburan', 'Esensial'];
const LOCAL_STORAGE_CATEGORIES_KEY = 'cashTrackerCategories';

import { supabase } from '../supabaseClient';

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    return storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update local storage when categories change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, transaction_date, description, amount, category')
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      setTransactions(data.map(t => ({ ...t, amount: parseFloat(t.amount) })));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transaction) => {
    // Ensure amount is a number
    const amountAsNumber = parseFloat(transaction.amount);
    if (isNaN(amountAsNumber)) {
        setError('Amount must be a valid number.');
        return false;
    }

    const { date: transaction_date, description, category } = transaction;
    // Basic validation
    if (!transaction_date || !description || !category || isNaN(amountAsNumber)) {
        setError('All fields are required and amount must be a number.');
        return false;
    }

    // SQL Injection prevention: Ideally, the mcp tool should handle parameterized queries.
    // If not, ensure values are properly sanitized. For now, assuming text values are safe enough for this context.
    // Escaping single quotes in string values for SQL
    const descEscaped = description.replace(/'/g, "''");
    const catEscaped = category.replace(/'/g, "''");

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          { transaction_date, description, amount: amountAsNumber, category }
        ])
        .select('id, transaction_date, description, amount, category')
        .single();

      if (error) throw error;

      // Add to local state, ensuring amount is a number
      const newTx = { ...data, amount: parseFloat(data.amount) };
      setTransactions(prev => [newTx, ...prev]);
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message || 'Failed to add transaction');
      return false;
    }
  }, []);

  const addCategory = useCallback((newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
  }, [categories]);
  
  // TODO: Implement updateTransaction and deleteTransaction if needed
  // TODO: Implement updateCategory and deleteCategory for local storage

  return (
    <DataContext.Provider value={{
      transactions,
      categories,
      loading,
      error,
      fetchTransactions,
      addTransaction,
      addCategory,
      // Pass a wrapper for fetchData or expect runMcpFunc to be passed where needed
    }}>
      {children}
    </DataContext.Provider>
  );
};