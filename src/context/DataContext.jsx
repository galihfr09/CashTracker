import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../supabaseClient';

export const DataContext = createContext();

const DEFAULT_CATEGORIES = ['Makan', 'Jajan', 'Aset', 'Investasi', 'Tagihan', 'Hiburan', 'Esensial'];
const LOCAL_STORAGE_CATEGORIES_KEY = 'cashTrackerCategories';

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    return storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    setSession(currentSession?.data?.session ?? null);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const fetchTransactions = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, transaction_date, description, amount, category, user_id')
        .eq('user_id', session.user.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      setTransactions(data.map(t => ({ ...t, amount: parseFloat(t.amount) })));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session, fetchTransactions]);

  const addTransaction = useCallback(async (transaction) => {
    if (!session?.user) {
      setError('You must be logged in to add a transaction.');
      return false;
    }

    const amountAsNumber = parseFloat(transaction.amount);
    if (isNaN(amountAsNumber)) {
        setError('Amount must be a valid number.');
        return false;
    }

    const { date: transaction_date, description, category } = transaction;
    if (!transaction_date || !description || !category || isNaN(amountAsNumber)) {
        setError('All fields are required and amount must be a number.');
        return false;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          { transaction_date, description, amount: amountAsNumber, category, user_id: session.user.id }
        ])
        .select('id, transaction_date, description, amount, category, user_id')
        .single();

      if (error) throw error;

      const newTx = { ...data, amount: parseFloat(data.amount) };
      setTransactions(prev => [newTx, ...prev]);
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message || 'Failed to add transaction');
      return false;
    }
  }, [session]);

  const addCategory = useCallback((newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
    }
  }, [categories]);
  
  return (
    <DataContext.Provider value={{
      transactions,
      categories,
      loading,
      error,
      session,
      fetchTransactions,
      addTransaction,
      addCategory,
    }}>
      {children}
    </DataContext.Provider>
  );
};