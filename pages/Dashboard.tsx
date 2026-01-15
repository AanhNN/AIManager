import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const Dashboard: React.FC = () => {
  const { products, productAccounts, addProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  const getAccountCount = (productId: string) => {
    return productAccounts.filter(pa => pa.productId === productId).length;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName.trim()) {
        addProduct(newProductName, newProductDesc);
        setNewProductName('');
        setNewProductDesc('');
        setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Products</h1>
            <p className="text-gray-400">Manage your subscription accounts and availability.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
            <Plus size={18} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl">
            <Box size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No products found</h3>
            <p className="text-gray-500 mt-2">Add your first AI service to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <Link key={product.id} to={`/products/${product.id}`} className="group">
                    <div className="bg-surface border border-gray-700 rounded-xl p-6 h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">
                                {getAccountCount(product.id)} Accounts
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{product.description || "No description provided."}</p>
                    </div>
                </Link>
            ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                <input 
                    type="text" 
                    required
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. ChatGPT Plus"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                    value={newProductDesc}
                    onChange={e => setNewProductDesc(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                    placeholder="Brief description..."
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600">Create Product</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};