import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';

function CategoriesPage() {
  const { categories, addCategory, loading, error } = useContext(DataContext);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  // TODO: Implement edit and delete functionality for categories

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Categories</h2>

      {/* Add New Category Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Category</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Category Name"
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">Loading categories...</td></tr>}
            {error && <tr><td colSpan="2" className="px-6 py-4 text-center text-sm text-red-500">Error: {error}</td></tr>}
            {!loading && !error && categories.map((categoryName, index) => (
              // Assuming categories from context is an array of strings
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{categoryName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4" disabled>Edit</button> {/* TODO: Implement Edit */}
                  <button className="text-red-600 hover:text-red-900" disabled>Delete</button> {/* TODO: Implement Delete */}
                </td>
              </tr>
            ))}
            {!loading && !error && categories.length === 0 && (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No categories found. Add one above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriesPage;