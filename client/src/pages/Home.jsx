import { Link } from 'react-router-dom';

export default function Home({ auth }) {
  const features = [
    {
      icon: '📊',
      title: 'Smart Dashboard',
      desc: 'Real-time summary of income, expenses, budgets, and average transactions.'
    },
    {
      icon: '💳',
      title: 'Track Transactions',
      desc: 'Categorize and manage all your financial transactions in one place.'
    },
    {
      icon: '💰',
      title: 'Budget Management',
      desc: 'Set spending targets and monitor progress with visual status indicators.'
    },
    {
      icon: '📈',
      title: 'Analytics',
      desc: 'Get insights into your spending patterns and financial trends over time.'
    }
  ];

  return (
    <section className="home-page">
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Take Control of Your Finances</h1>
            <p>Track income, expenses, and budgets all in one place. Finance Tracker helps you stay on top of your spending, savings, and financial goals.</p>
            {!auth.token ? (
              <div className="hero-actions">
                <Link className="button" to="/login">Login</Link>
                <Link className="button button-secondary" to="/register">Register</Link>
              </div>
            ) : (
              <div className="welcome-section">
                <p className="welcome-text">Welcome back, <strong>{auth.user?.name}!</strong></p>
                <Link className="button" to="/dashboard">Go to Dashboard</Link>
              </div>
            )}
          </div>
          <div className="hero-visual">
            <div className="hero-icon">📱</div>
          </div>
        </div>

        {!auth.token && (
          <div className="features-section">
            <h2>Why Choose Finance Tracker?</h2>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <span className="feature-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
