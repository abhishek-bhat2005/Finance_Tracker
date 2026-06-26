import { useState } from 'react';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';

export default function Budgets() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleCreate = () => {
    setRefreshFlag((value) => value + 1);
  };

  return (
    <section className="budgets-page">
      <div className="budgets-grid">
        <BudgetForm onCreate={handleCreate} />
        <BudgetList refreshFlag={refreshFlag} />
      </div>
    </section>
  );
}
