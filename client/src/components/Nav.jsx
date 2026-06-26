import { Link } from 'react-router-dom';

export default function Nav({ auth, onLogout }) {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <Link to="/">Finance Tracker</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {auth.token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/budgets">Budgets</Link>
            <button className="nav-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
