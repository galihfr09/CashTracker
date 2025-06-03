import React, { useContext, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils/currencyFormatter';
import { DataContext } from '../context/DataContext';

function DashboardPage() {
  const { transactions, loading, error } = useContext(DataContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate.getMonth() + 1 === selectedMonth && transactionDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const summaryStats = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        totalExpenses: 0,
        totalIncome: 0,
        netTotal: 0,
        transactionCount: 0,
      };
    }

    let expenses = 0;
    let income = 0;
    filteredTransactions.forEach(t => {
      if (t.amount < 0) {
        expenses += Math.abs(t.amount);
      } else {
        income += t.amount;
      }
    });

    return {
      totalExpenses: expenses,
      totalIncome: income,
      netTotal: income - expenses,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const expensesByCategoryData = useMemo(() => {
    const categoryMap = {};
    filteredTransactions.forEach(t => {
      // Since all saved data is an expense and amounts are positive, sum all amounts directly
      const category = t.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + t.amount;
    });
    return Object.keys(categoryMap).map(category => ({
      category,
      amount: categoryMap[category],
    }));
  }, [filteredTransactions]);

  console.log('Expenses by Category Data:', expensesByCategoryData); // Debugging line

  const spendingOverTimeData = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return [];
    }

    // Group transactions by date and sum amounts
    const dailyTotals = filteredTransactions.reduce((acc, t) => {
      const date = new Date(t.transaction_date).toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting
      acc[date] = (acc[date] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.keys(dailyTotals)
      .map(date => ({
        date,
        amount: dailyTotals[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredTransactions]);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading dashboard data...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error loading data: {error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
      
      {/* Month and Year Selectors */}
      <div className="flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="p-2 border rounded-md"
        >
          {[...Array(12).keys()].map((month) => (
            <option key={month + 1} value={month + 1}>
              {new Date(0, month).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded-md"
        >
          {[...Array(5).keys()].map((i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-3xl font-semibold text-red-600 mt-1">{formatCurrency(summaryStats.totalExpenses)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-3xl font-semibold text-green-600 mt-1">{formatCurrency(summaryStats.totalIncome)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Net Total</h3>
          <p className={`text-3xl font-semibold ${summaryStats.netTotal >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {formatCurrency(summaryStats.netTotal)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Transaction Count</h3>
          <p className="text-3xl font-semibold text-gray-800 mt-1">{summaryStats.transactionCount}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Chart (Full Width on smaller screens, 2/3 on lg) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Spending Over Time</h3>
          {spendingOverTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No spending data for the selected period.</p>
            </div>
          )}
        </div>

        {/* Category Breakdown (Full Width on smaller screens, 1/3 on lg) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Category Breakdown</h3>
          {expensesByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No category data for the selected period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Charts Section - Category Totals */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Category Totals</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByCategoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default DashboardPage;