import { useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

export default function Transactions() {
  // simple refresh trigger to ask list to reload after add
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleAdd = (tx) => {
    // bump flag to trigger list reload
    setRefreshFlag((f) => f + 1);
  };

  return (
    <section className="transactions-page">
      <div className="transactions-grid">
        <TransactionForm onAdd={handleAdd} />
        <TransactionList refreshFlag={refreshFlag} />
      </div>
    </section>
  );
}
