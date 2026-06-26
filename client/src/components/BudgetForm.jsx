import { useState } from 'react';
import api from '../api';

export default function BudgetForm({ onCreate }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
    color: '#667eea',
    icon: '💰',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      const res = await api.post('/budgets', payload);
      setForm((prev) => ({ ...prev, name: '', category: '', amount: '', description: '' }));
      onCreate(res.data.budget);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form card">
      <div className="budget-form-header">
        <div>
          <h3>Create budget</h3>
          <p>Set a new spending target and track progress.</p>
        </div>
        <span className="budget-form-chip">INR</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Monthly groceries" required />
          </div>
          <div>
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="groceries" required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Amount</label>
            <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="₹ 2000" required />
          </div>
          <div>
            <label>Period</label>
            <select name="period" value={form.period} onChange={handleChange}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Start date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          </div>
          <div>
            <label>End date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Color</label>
            <input name="color" type="color" value={form.color} onChange={handleChange} />
          </div>
          <div>
            <label>Icon</label>
            <input name="icon" value={form.icon} onChange={handleChange} placeholder="💰" />
          </div>
        </div>

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional description" rows="3" />

        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Budget'}</button>
      </form>
    </div>
  );
}
