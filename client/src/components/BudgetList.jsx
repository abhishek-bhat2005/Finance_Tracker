import { useEffect, useState } from 'react';
import api from '../api';

export default function BudgetList({ refreshFlag }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBudgets = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/budgets?active=true');
      setBudgets(res.data.budgets || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [refreshFlag]);

  if (loading) return <div className="loading-card">Loading budgets...</div>;
  if (error) return <div className="error-card">{error}</div>;
  if (!budgets.length) return <div className="empty-state">No active budgets yet.</div>;

  return (
    <div className="budget-list card">
      <div className="budget-list-header">
        <div>
          <h3>Active budgets</h3>
          <p>Track your spending across categories.</p>
        </div>
        <span className="budget-count">{budgets.length} active</span>
      </div>

      <div className="budgets-grid">
        {budgets.map((budget) => (
          <div key={budget._id} className="budget-card">
            <div className="budget-title">
              <span className="budget-icon">{budget.icon}</span>
              <div>
                <strong>{budget.name}</strong>
                <p>{budget.category}</p>
              </div>
            </div>
            <div className="budget-details">
              <span className={`status-pill status-${budget.status}`}>
                {budget.status}
              </span>
              <span>{budget.percentageUsed}% used</span>
            </div>
            <div className="budget-summary">
              <div>
                <p>Budget</p>
                <strong>₹{Number(budget.amount).toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <p>Remaining</p>
                <strong>₹{Number(budget.remaining).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
