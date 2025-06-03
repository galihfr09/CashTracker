import React, { useState, useContext, useMemo } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { DataContext } from '../context/DataContext';

function TransactionsPage() {
  const { transactions, categories, loading, error } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Adjust end date to include the whole day
      if (end) end.setHours(23, 59, 59, 999);

      const matchesSearchTerm = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
      const matchesDateRange = 
        (!start || transactionDate >= start) && 
        (!end || transactionDate <= end);

      return matchesSearchTerm && matchesCategory && matchesDateRange;
    });
  }, [transactions, searchTerm, startDate, endDate, selectedCategory]);

  // TODO: Implement sorting, pagination, inline editing

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Transactions</h2>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center">
        <input 
          type="text" 
          placeholder="Search description..." 
          className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <select 
          className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories && categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading transactions...</td></tr>}
            {error && <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-red-500">Error loading transactions: {error}</td></tr>}
            {!loading && !error && filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
          <td className="py-2 px-4 border-b border-gray-200">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {/* Inline edit for category will go here */}
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  {/* Add delete button if needed */}
                </td>
              </tr>
            ))}
            {!loading && !error && filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
        <span className="text-sm text-gray-700">Page 1 of 1</span>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
      </div>

    </div>
  );
}

export default TransactionsPage;