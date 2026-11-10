import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import OrderList from './features/orders/OrderList';
import OrderForm from './features/orders/OrderForm';

export function App() {
  const location = useLocation();
  const isEditing = location.pathname.startsWith('/orders/') && location.pathname !== '/orders/new';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            Order Management
          </h1>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontWeight: '500'
          }}>
            Client
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to="/orders"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              backgroundColor: location.pathname === '/orders' ? '#2563eb' : 'transparent',
              color: location.pathname === '/orders' ? '#ffffff' : '#64748b'
            }}
          >
            Orders
          </Link>
          <Link
            to="/orders/new"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              backgroundColor: location.pathname === '/orders/new' ? '#2563eb' : '#2563eb',
              color: '#ffffff'
            }}
          >
            + New Order
          </Link>
        </nav>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id" element={<OrderForm />} />
        </Routes>
      </main>

      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>
          Order Management Client • Powered by React & TanStack Query
        </p>
      </footer>
    </div>
  );
}