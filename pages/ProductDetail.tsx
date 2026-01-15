import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Plus, Settings, Trash, Mail } from 'lucide-react';
import { EnrichedAccount } from '../types';
import { AccountRow } from '../components/AccountRow';
import { Modal } from '../components/Modal';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, accounts, productAccounts, deleteProduct, linkAccountToProduct, updateProduct } = useStore();
  
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Find current product
  const product = products.find(p => p.id === id);

  // Derive enriched accounts
  const linkedAccounts = useMemo<EnrichedAccount[]>(() => {
    if (!product) return [];
    
    // 1. Find all relation records for this product
    const relations = productAccounts.filter(pa => pa.productId === product.id);
    
    // 2. Map relations to actual Account objects
    return relations.map(relation => {
        const acc = accounts.find(a => a.id === relation.accountId);
        if (!acc) return null;
        return {
            ...acc,
            relationId: relation.id
        };
    }).filter((a): a is EnrichedAccount => a !== null);
  }, [product, productAccounts, accounts]);

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
        linkAccountToProduct(product.id, emailInput.trim());
        setEmailInput('');
        setIsAddAccountOpen(false);
    }
  };

  const handleDeleteProduct = () => {
    if (confirm(`Are you sure you want to delete ${product.name}? This will unlink all accounts.`)) {
        deleteProduct(product.id);
        navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-surface border border-gray-700 rounded-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-gray-400">{product.description}</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsEditProductOpen(true)}
                    className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit Product"
                >
                    <Settings size={20} />
                </button>
                <button 
                    onClick={handleDeleteProduct}
                    className="p-2 text-gray-400 hover:text-danger bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Product"
                >
                    <Trash size={20} />
                </button>
            </div>
        </div>

        <div className="flex items-center justify-between mb-4 mt-8 border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Linked Accounts
            </h2>
            <button 
                onClick={() => setIsAddAccountOpen(true)}
                className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
                <Plus size={16} /> Add Account
            </button>
        </div>

        <div className="space-y-3">
            {linkedAccounts.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-black/20 rounded-lg border border-gray-800 border-dashed">
                    No accounts linked yet. Add an email to start tracking.
                </div>
            ) : (
                linkedAccounts.map(account => (
                    <AccountRow key={account.relationId} account={account} />
                ))
            )}
        </div>
      </div>

      {/* Add Account Modal */}
      <Modal isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} title="Link Account">
        <form onSubmit={handleAddAccount} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input 
                        type="email" 
                        required
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="user@example.com"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    If this email exists in another product, it will be linked. Otherwise, a new account is created.
                </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAddAccountOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600">Add Account</button>
            </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      {isEditProductOpen && (
        <EditProductModal 
            isOpen={isEditProductOpen} 
            onClose={() => setIsEditProductOpen(false)} 
            product={product}
            onUpdate={updateProduct}
        />
      )}
    </div>
  );
};

// Helper sub-component for edit modal
const EditProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: { id: string, name: string, description: string };
    onUpdate: (id: string, name: string, desc: string) => void;
}> = ({ isOpen, onClose, product, onUpdate }) => {
    const [name, setName] = useState(product.name);
    const [desc, setDesc] = useState(product.description);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(product.id, name, desc);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea 
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};