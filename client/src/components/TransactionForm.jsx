import { useState } from 'react';
import api from '../api';

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      const res = await api.post('/transactions', payload);
      onAdd(res.data.transaction);
      setForm({ ...form, amount: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form card">
      <h3>Add transaction in INR</h3>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="field-group">
          <label>Amount</label>
          <input name="amount" type="number" step="0.01" placeholder="₹ 0.00" value={form.amount} onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label>Category</label>
          <input name="category" type="text" placeholder="e.g. groceries" value={form.category} onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Payment Method</label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank transfer</option>
            <option value="digital_wallet">Digital wallet</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="field-group">
          <label>Description</label>
          <input name="description" type="text" placeholder="Optional note" value={form.description} onChange={handleChange} />
        </div>

        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Transaction'}</button>
      </form>
    </div>
  );
}
