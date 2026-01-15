import React, { useState, useEffect } from 'react';
import { EnrichedAccount } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { useStore } from '../context/StoreContext';
import { Trash2, RefreshCw, Play, Clock, CheckCircle, Timer } from 'lucide-react';

interface AccountRowProps {
  account: EnrichedAccount;
}

export const AccountRow: React.FC<AccountRowProps> = ({ account }) => {
  const { startCountdown, resetCountdown, unlinkAccount } = useStore();
  const [days, setDays] = useState<number>(30); // Default 30 days
  const { formatted, isExpired } = useCountdown(account.countdownEndAt);

  // Auto-reset logic: If timer ends (isExpired) and we are in cooldown, revert to active.
  useEffect(() => {
    if (isExpired && account.status === 'cooldown' && account.countdownEndAt) {
      resetCountdown(account.id);
    }
  }, [isExpired, account.status, account.countdownEndAt, account.id, resetCountdown]);

  const handleStart = () => {
    if (days >= 1 && days <= 365) {
      startCountdown(account.id, days);
    }
  };

  return (
    <div className={`bg-surface/50 border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        account.status === 'active' 
        ? 'border-gray-700/50 hover:border-success/30' 
        : 'border-orange-900/30 bg-orange-950/10 hover:border-orange-700/50'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white truncate">{account.email}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium border flex items-center gap-1 ${
            account.status === 'active' 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
          }`}>
            {account.status === 'active' ? (
                <><CheckCircle size={10} /> Active</>
            ) : (
                <><Timer size={10} /> Cooldown</>
            )}
          </span>
        </div>
        <div className="text-sm text-gray-400 font-mono flex items-center gap-1">
            <Clock size={14} />
            {account.status === 'cooldown' ? (
                <span className="text-orange-400 font-bold">{formatted}</span>
            ) : (
                <span className="text-gray-500">Ready to start</span>
            )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {account.status === 'active' ? (
            <div className="flex items-center gap-2 bg-gray-900 rounded-md p-1 border border-gray-700">
                <select 
                    value={days} 
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="bg-transparent text-sm text-white focus:outline-none px-2 py-1"
                >
                    {[1, 3, 7, 14, 30].map(d => (
                        <option key={d} value={d} className="bg-surface">{d} days</option>
                    ))}
                </select>
                <button 
                    onClick={handleStart}
                    className="flex items-center gap-1 bg-primary hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                >
                    <Play size={12} fill="currentColor" /> Start
                </button>
            </div>
        ) : (
             <button 
                onClick={() => resetCountdown(account.id)}
                className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded transition-colors border border-gray-700"
                title="Reset to Active"
            >
                <RefreshCw size={12} /> Reset
            </button>
        )}

        <div className="h-6 w-[1px] bg-gray-700 mx-1 hidden md:block"></div>

        <button 
            onClick={() => {
                if(confirm('Are you sure you want to remove this account from the product?')) {
                    unlinkAccount(account.relationId);
                }
            }}
            className="text-gray-500 hover:text-danger transition-colors p-1"
            title="Unlink Account"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};