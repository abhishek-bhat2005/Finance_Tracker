import { useEffect, useState } from 'react';
import api from '../api';
import TransactionList from '../components/TransactionList';
import BudgetList from '../components/BudgetList';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await api.get('/analytics/dashboard');
        // store whatever the server returned (may be missing some fields)
        setStats(response.data || {});
        // helpful debug log when dashboard appears blank
        console.debug('Dashboard analytics response:', response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="loading-card">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-card">{error}</div>;
  }
  // Safely read values with defaults so the UI never crashes
  const incomeTotal = Number(stats?.totalIncome ?? 0);
  const expenseTotal = Number(stats?.totalExpenses ?? 0);
  const totalBudgets = Number(stats?.budgetAnalysis?.length ?? 0);
  const avgTransaction = Number(stats?.insights?.averageTransactionSize ?? 0);
  const hasAnyData = incomeTotal !== 0 || expenseTotal !== 0 || totalBudgets !== 0 || avgTransaction !== 0;

  const formatRupee = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);

  return (
    <section className="dashboard-page">
      <div className="dashboard-panel">
        <header className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Summary of your finances</p>
          </div>
        </header>

        { !hasAnyData ? (
          <div className="empty-state">
            <p>No financial data yet. Start by adding a transaction or creating a budget.</p>
          </div>
        ) : null }

        <div className="dashboard-summary">
          <div className="card">
            <p className="card-label">Total Income</p>
            <p className="card-value">{formatRupee(incomeTotal)}</p>
          </div>
          <div className="card">
            <p className="card-label">Total Expense</p>
            <p className="card-value">{formatRupee(expenseTotal)}</p>
          </div>
          <div className="card">
            <p className="card-label">Total Budgets</p>
            <p className="card-value">{totalBudgets}</p>
          </div>
          <div className="card">
            <p className="card-label">Average Transaction</p>
            <p className="card-value">{formatRupee(avgTransaction)}</p>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <p>Review your latest income and expenses at a glance.</p>
          </div>
          <TransactionList refreshFlag={0} />
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Active Budgets</h3>
            <p>Monitor your spending targets and track progress.</p>
          </div>
          <BudgetList refreshFlag={0} />
        </section>
      </div>
    </section>
  );
}
