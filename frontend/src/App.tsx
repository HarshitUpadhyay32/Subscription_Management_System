import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Entry Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { ProductsPlansPage } from './pages/admin/ProductsPlansPage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { SubscriptionsPage } from './pages/admin/SubscriptionsPage';
import { QuotationsPage } from './pages/admin/QuotationsPage';
import { InvoicesPaymentsPage } from './pages/admin/InvoicesPaymentsPage';
import { DiscountsTaxesPage } from './pages/admin/DiscountsTaxesPage';
import { StaffManagementPage } from './pages/admin/StaffManagementPage';
import { AnalyticsReportsPage } from './pages/admin/AnalyticsReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Staff Pages
import { StaffOverview } from './pages/staff/StaffOverview';

// Customer Pages
import { CustomerOverview } from './pages/customer/CustomerOverview';
import { CustomerSubscriptionsPage } from './pages/customer/CustomerSubscriptionsPage';
import { CustomerInvoicesPage } from './pages/customer/CustomerInvoicesPage';
import { CustomerPaymentsPage } from './pages/customer/CustomerPaymentsPage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';

const MainApp: React.FC = () => {
  const { currentUser, currentRole, switchRole } = useApp();

  // Root view can be 'landing' | 'login' | 'register' | 'forgot-password' | 'dashboard'
  const [rootView, setRootView] = useState<'landing' | 'login' | 'register' | 'forgot-password' | 'dashboard'>('landing');

  // Sub-path inside dashboard
  const [currentPath, setCurrentPath] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // If user role changes, make sure currentPath is valid for that role
  useEffect(() => {
    if (currentRole === 'customer') {
      if (['products', 'discounts-taxes', 'staff', 'analytics', 'settings'].includes(currentPath)) {
        setCurrentPath('overview');
      }
    } else if (currentRole === 'staff') {
      if (['products', 'discounts-taxes', 'staff', 'analytics', 'settings'].includes(currentPath)) {
        setCurrentPath('overview');
      }
    }
  }, [currentRole, currentPath]);

  // Check if returning from OAuth redirect
  useEffect(() => {
    if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
      setRootView('dashboard');
    }
  }, []);

  // Handle Landing page
  if (rootView === 'landing') {
    return (
      <LandingPage
        onNavigateAuth={(v) => setRootView(v)}
        onEnterDashboard={(role: UserRole) => {
          switchRole(role);
          setRootView('dashboard');
          setCurrentPath('overview');
        }}
      />
    );
  }

  // Handle Login page
  if (rootView === 'login') {
    return (
      <LoginPage
        onNavigateLanding={() => setRootView('landing')}
        onNavigateRegister={() => setRootView('register')}
        onNavigateForgotPassword={() => setRootView('forgot-password')}
        onSuccessLogin={() => {
          setRootView('dashboard');
          setCurrentPath('overview');
        }}
      />
    );
  }

  // Handle Register page
  if (rootView === 'register') {
    return (
      <RegisterPage
        onNavigateLanding={() => setRootView('landing')}
        onNavigateLogin={() => setRootView('login')}
        onSuccessRegister={() => {
          setRootView('dashboard');
          setCurrentPath('overview');
        }}
      />
    );
  }

  // Handle Forgot Password page
  if (rootView === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigateLogin={() => setRootView('login')}
        onNavigateLanding={() => setRootView('landing')}
      />
    );
  }

  // Dashboard routing
  const renderDashboardContent = () => {
    if (currentRole === 'admin') {
      switch (currentPath) {
        case 'overview':
          return <AdminOverview onNavigate={(p) => setCurrentPath(p)} searchQuery={searchQuery} />;
        case 'products':
          return <ProductsPlansPage searchQuery={searchQuery} />;
        case 'customers':
          return <CustomersPage searchQuery={searchQuery} />;
        case 'subscriptions':
          return <SubscriptionsPage searchQuery={searchQuery} />;
        case 'quotations':
          return <QuotationsPage searchQuery={searchQuery} />;
        case 'invoices':
          return <InvoicesPaymentsPage searchQuery={searchQuery} initialTab="invoices" />;
        case 'payments':
          return <InvoicesPaymentsPage searchQuery={searchQuery} initialTab="payments" />;
        case 'discounts-taxes':
          return <DiscountsTaxesPage searchQuery={searchQuery} />;
        case 'staff':
          return <StaffManagementPage searchQuery={searchQuery} />;
        case 'analytics':
          return <AnalyticsReportsPage />;
        case 'settings':
          return <SettingsPage />;
        default:
          return <AdminOverview onNavigate={(p) => setCurrentPath(p)} searchQuery={searchQuery} />;
      }
    }

    if (currentRole === 'staff') {
      switch (currentPath) {
        case 'overview':
          return <StaffOverview onNavigate={(p) => setCurrentPath(p)} searchQuery={searchQuery} />;
        case 'customers':
          return <CustomersPage searchQuery={searchQuery} />;
        case 'subscriptions':
          return <SubscriptionsPage searchQuery={searchQuery} />;
        case 'quotations':
          return <QuotationsPage searchQuery={searchQuery} />;
        case 'invoices':
          return <InvoicesPaymentsPage searchQuery={searchQuery} initialTab="invoices" />;
        case 'payments':
          return <InvoicesPaymentsPage searchQuery={searchQuery} initialTab="payments" />;
        default:
          return <StaffOverview onNavigate={(p) => setCurrentPath(p)} searchQuery={searchQuery} />;
      }
    }

    // Customer Portal
    switch (currentPath) {
      case 'overview':
        return <CustomerOverview onNavigate={(p) => setCurrentPath(p)} />;
      case 'my-subscriptions':
        return <CustomerSubscriptionsPage />;
      case 'my-invoices':
        return <CustomerInvoicesPage />;
      case 'payment-history':
        return <CustomerPaymentsPage />;
      case 'account-settings':
        return <CustomerSettingsPage />;
      default:
        return <CustomerOverview onNavigate={(p) => setCurrentPath(p)} />;
    }
  };

  return (
    <DashboardLayout
      currentPath={currentPath}
      onNavigate={(path) => {
        if (path === 'landing') {
          setRootView('landing');
        } else {
          setCurrentPath(path);
        }
      }}
      searchQuery={searchQuery}
      onSearchChange={(q) => setSearchQuery(q)}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
