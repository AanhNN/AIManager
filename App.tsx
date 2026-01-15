import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Dashboard } from './pages/Dashboard';
import { ProductDetail } from './pages/ProductDetail';
import { Layout } from 'lucide-react';

// Simple Layout Wrapper
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-gray-100 flex flex-col">
            <header className="bg-surface/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-primary to-blue-400 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <Layout className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">AI Manager</span>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
            <footer className="py-6 text-center text-gray-600 text-sm border-t border-gray-800/50">
                <p>© {new Date().getFullYear()} AI Account Manager. Single-user mode.</p>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
        <HashRouter>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AppLayout>
        </HashRouter>
    </StoreProvider>
  );
};

export default App;