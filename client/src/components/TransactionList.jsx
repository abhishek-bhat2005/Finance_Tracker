import { useEffect, useState } from 'react';
import api from '../api';

export default function TransactionList({ refreshFlag }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/transactions?limit=50');
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setError('');
    setDeletingId(id);
    try {
      await api.delete(`/transactions/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete transaction');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    load();
  }, [refreshFlag]);

  if (loading) return <div className="loading-card">Loading transactions...</div>;
  if (error) return <div className="error-card">{error}</div>;

  if (!transactions.length) return <div className="empty-state">No transactions yet.</div>;

  const formatRupee = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);

  return (
    <div className="transaction-list card">
      <h3>Recent transactions</h3>
      <ul className="tx-list">
        {transactions.map((t) => (
          <li key={t._id} className={`tx-item tx-${t.type}`}>
            <div>
              <div className="tx-header">
                <strong>{t.category}</strong>
                <span className="tx-type">{t.type === 'expense' ? 'Expense' : 'Income'}</span>
              </div>
              <p className="tx-desc">{t.description || 'No description'}</p>
            </div>
            <div className="tx-meta">
              <span className="tx-date">{new Date(t.date).toLocaleDateString()}</span>
              <span className="tx-amount">{t.type === 'expense' ? '-' : '+'}{formatRupee(Number(t.amount))}</span>
              <button
                type="button"
                className="tx-delete"
                onClick={() => handleDelete(t._id)}
                disabled={deletingId === t._id}
              >
                {deletingId === t._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
