import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEMO_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_PRODUCTS,
  INITIAL_QUOTATIONS,
  INITIAL_SETTINGS,
  INITIAL_STAFF,
  INITIAL_TAXES,
  INITIAL_SUBSCRIPTIONS,
} from '../mock/initialData';
import {
  Customer,
  DiscountCode,
  Invoice,
  Payment,
  Plan,
  Product,
  Quotation,
  StaffMember,
  Subscription,
  SystemSettings,
  TaxRule,
  UserProfile,
  UserRole,
} from '../types';
import { useSupabaseAuth } from '../lib/useSupabaseAuth';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (email: string, pass: string) => boolean;
  loginWithGoogle: () => Promise<boolean>;
  registerAccount: (name: string, email: string, company?: string) => boolean;
  logout: () => void;

  // Supabase real auth (async)
  supabaseLoading: boolean;
  supabaseSignIn: (email: string, password: string) => Promise<void>;
  supabaseSignUp: (email: string, password: string, name: string, company?: string) => Promise<void>;
  supabaseSignInWithGoogle: () => Promise<void>;
  supabaseSignOut: () => Promise<void>;
  supabaseResetPassword: (email: string) => Promise<void>;

  // Products & Plans
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'activeSubscriptionsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addPlan: (productId: string, plan: Omit<Plan, 'id'>) => void;
  updatePlan: (productId: string, planId: string, updates: Partial<Plan>) => void;
  deletePlan: (productId: string, planId: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedDate' | 'totalSpent'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Subscriptions
  subscriptions: Subscription[];
  createSubscription: (sub: Omit<Subscription, 'id' | 'subscriptionCode'>) => Subscription;
  renewSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  changeSubscriptionPlan: (id: string, newPlanId: string, newAmount: number, newBillingCycle: any) => void;

  // Quotations
  quotations: Quotation[];
  createQuotation: (quote: Omit<Quotation, 'id' | 'quotationNumber'>) => Quotation;
  sendQuotation: (id: string) => void;
  approveQuotation: (id: string) => void;
  convertQuotationToSubscription: (quotationId: string) => { subscription: Subscription; invoice: Invoice };
  deleteQuotation: (id: string) => void;

  // Invoices & Payments
  invoices: Invoice[];
  payments: Payment[];
  payInvoice: (invoiceId: string, method?: string, upiOrCard?: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;

  // Discounts & Taxes
  discounts: DiscountCode[];
  addDiscount: (discount: Omit<DiscountCode, 'id' | 'usedCount'>) => void;
  toggleDiscount: (id: string) => void;
  deleteDiscount: (id: string) => void;
  taxes: TaxRule[];
  addTax: (tax: Omit<TaxRule, 'id'>) => void;
  toggleTax: (id: string) => void;

  // Staff
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'joinedDate' | 'assignedCustomersCount'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;

  // Feedback Toasts
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset Mock
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.admin);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bl_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bl_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('bl_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('bl_quotations');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bl_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('bl_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    const saved = localStorage.getItem('bl_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });
  const [taxes, setTaxes] = useState<TaxRule[]>(() => {
    const saved = localStorage.getItem('bl_taxes');
    return saved ? JSON.parse(saved) : INITIAL_TAXES;
  });
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('bl_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('bl_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // ─── Supabase Auth ────────────────────────────────────────────────────────
  const supabaseAuth = useSupabaseAuth();

  // Sync Supabase session → currentUser (real login / logout)
  useEffect(() => {
    if (supabaseAuth.loading) return;
    if (supabaseAuth.user) {
      // Fetch the profile row to get the role
      supabaseAuth.getProfile(supabaseAuth.user.id)
        .then((profile) => {
          setCurrentUser({
            id: profile.id,
            name: profile.full_name || supabaseAuth.user!.email!.split('@')[0],
            email: profile.email || supabaseAuth.user!.email || '',
            role: (profile.role as UserRole) || 'customer',
          });
        })
        .catch(() => {
          // Profile not yet synced (new user before trigger fires); keep demo user
        });
    }
    // If no supabase session, keep existing demo user (so demo mode still works)
  }, [supabaseAuth.user, supabaseAuth.loading]);

  // ─── Real Supabase auth methods ───────────────────────────────────────────
  const supabaseSignIn = async (email: string, password: string) => {
    try {
      await supabaseAuth.signIn(email, password);
      showToast({ type: 'success', title: 'Signed in', message: 'Welcome back to Brightloop!' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Sign in failed', message: err.message });
      throw err;
    }
  };

  const supabaseSignUp = async (email: string, password: string, name: string, company?: string) => {
    try {
      await supabaseAuth.signUp(email, password, { full_name: name, company });
      showToast({
        type: 'success',
        title: 'Account created',
        message: 'Welcome to Brightloop! Check your email to confirm your account.',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Registration failed', message: err.message });
      throw err;
    }
  };

  const supabaseSignOut = async () => {
    try {
      await supabaseAuth.signOut();
      setCurrentUser(null);
      showToast({ type: 'info', message: 'You have been signed out.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Sign out failed', message: err.message });
    }
  };

  const supabaseResetPassword = async (email: string) => {
    try {
      await supabaseAuth.sendPasswordReset(email);
      showToast({
        type: 'success',
        title: 'Reset email sent',
        message: `Password reset instructions sent to ${email}`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Reset failed', message: err.message });
      throw err;
    }
  };

  const supabaseSignInWithGoogle = async () => {
    try {
      await supabaseAuth.signInWithGoogle();
      showToast({ type: 'info', title: 'Connecting to Google', message: 'Redirecting to Google Sign-In...' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Google Sign-in failed', message: err.message });
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const hasAnonKey = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);
      if (hasAnonKey) {
        await supabaseAuth.signInWithGoogle();
        return true;
      }
    } catch (err) {
      console.warn('Supabase Google OAuth fallback to demo Google profile:', err);
    }
    const googleUser: UserProfile = {
      id: 'usr-google-1',
      name: 'Sahil Vishnoi',
      email: 'sahil.vishnoi@gmail.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      company: 'Google Cloud Partner',
    };
    setCurrentUser(googleUser);
    showToast({
      type: 'success',
      title: 'Google Sign-In Successful',
      message: 'Welcome back! Signed in with Google Account.',
    });
    return true;
  };

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('bl_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('bl_customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('bl_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem('bl_quotations', JSON.stringify(quotations));
  }, [quotations]);
  useEffect(() => {
    localStorage.setItem('bl_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('bl_payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('bl_discounts', JSON.stringify(discounts));
  }, [discounts]);
  useEffect(() => {
    localStorage.setItem('bl_taxes', JSON.stringify(taxes));
  }, [taxes]);
  useEffect(() => {
    localStorage.setItem('bl_staff', JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem('bl_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    if (selected) {
      setCurrentUser(selected);
      showToast({
        type: 'info',
        title: 'Persona Switched',
        message: `Viewing Brightloop as ${selected.name} (${role.toUpperCase()})`,
      });
    }
  };

  const loginAs = (role: UserRole) => {
    switchRole(role);
  };

  const loginWithCredentials = (email: string, _pass: string): boolean => {
    const normalized = email.toLowerCase().trim();
    if (normalized.includes('admin') || normalized === 'elena.vance@brightloop.io') {
      setCurrentUser(DEMO_USERS.admin);
      showToast({ type: 'success', title: 'Welcome back!', message: 'Logged in as Admin.' });
      return true;
    }
    if (normalized.includes('staff') || normalized === 'arjun.nair@brightloop.io') {
      setCurrentUser(DEMO_USERS.staff);
      showToast({ type: 'success', title: 'Welcome back!', message: 'Logged in as Operations Staff.' });
      return true;
    }
    // Default to Customer
    const foundCustomer = customers.find((c) => c.email.toLowerCase() === normalized);
    if (foundCustomer) {
      setCurrentUser({
        id: `usr-${foundCustomer.id}`,
        name: foundCustomer.name,
        email: foundCustomer.email,
        role: 'customer',
        avatar: foundCustomer.avatar,
        company: foundCustomer.company,
        phone: foundCustomer.phone,
        customerId: foundCustomer.id,
      });
    } else {
      setCurrentUser(DEMO_USERS.customer);
    }
    showToast({ type: 'success', title: 'Signed in successfully', message: 'Welcome to your Brightloop Customer Portal.' });
    return true;
  };

  const registerAccount = (name: string, email: string, company?: string): boolean => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      email,
      company: company || `${name}'s Organization`,
      phone: '+91 98000 00000',
      address: 'Business Park, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      totalSpent: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    setCurrentUser({
      id: `usr-${newCust.id}`,
      name: newCust.name,
      email: newCust.email,
      role: 'customer',
      avatar: newCust.avatar,
      company: newCust.company,
      phone: newCust.phone,
      customerId: newCust.id,
    });
    showToast({
      type: 'success',
      title: 'Account Created',
      message: `Welcome to Brightloop, ${name}! Your customer dashboard is ready.`,
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast({ type: 'info', message: 'You have been logged out.' });
  };

  // Products & Plans
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'activeSubscriptionsCount'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      activeSubscriptionsCount: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast({ type: 'success', title: 'Product Created', message: `${newProd.name} added to catalog.` });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast({ type: 'success', message: 'Product updated.' });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast({ type: 'info', message: 'Product deleted.' });
  };

  const addPlan = (productId: string, planData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...planData,
      id: `plan-${Date.now()}`,
    };
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, plans: [...p.plans, newPlan] } : p))
    );
    showToast({ type: 'success', title: 'Plan Added', message: `Plan "${newPlan.name}" configured.` });
  };

  const updatePlan = (productId: string, planId: string, updates: Partial<Plan>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          plans: p.plans.map((pl) => (pl.id === planId ? { ...pl, ...updates } : pl)),
        };
      })
    );
    showToast({ type: 'success', message: 'Plan updated.' });
  };

  const deletePlan = (productId: string, planId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          plans: p.plans.filter((pl) => pl.id !== planId),
        };
      })
    );
    showToast({ type: 'info', message: 'Plan removed.' });
  };

  // Customers
  const addCustomer = (custData: Omit<Customer, 'id' | 'joinedDate' | 'totalSpent'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      avatar:
        custData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast({ type: 'success', title: 'Customer Added', message: `${newCust.name} enrolled.` });
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast({ type: 'success', message: 'Customer profile updated.' });
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast({ type: 'info', message: 'Customer removed.' });
  };

  // Subscriptions
  const createSubscription = (subData: Omit<Subscription, 'id' | 'subscriptionCode'>): Subscription => {
    const nextCode = `${settings.subscriptionPrefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`,
      subscriptionCode: nextCode,
    };
    setSubscriptions((prev) => [newSub, ...prev]);

    // Also auto-generate the first recurring invoice for this subscription!
    const subtotal = newSub.amount;
    const taxRate = 18;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    const total = Number((subtotal + taxAmount).toFixed(2));

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `${settings.invoicePrefix}2026-${Math.floor(100 + Math.random() * 900)}`,
      subscriptionId: newSub.id,
      customerId: newSub.customerId,
      customerName: newSub.customerName,
      customerEmail: newSub.customerEmail,
      customerCompany: newSub.customerCompany,
      issueDate: newSub.startDate,
      dueDate: newSub.renewalDate,
      items: [
        {
          description: `${newSub.productName} - ${newSub.planName} (${newSub.billingCycle})`,
          quantity: 1,
          unitPrice: subtotal,
          amount: subtotal,
        },
      ],
      subtotal,
      taxRate,
      taxAmount,
      discountAmount: 0,
      total,
      status: 'pending',
    };
    setInvoices((prev) => [newInv, ...prev]);

    showToast({
      type: 'success',
      title: 'Subscription Activated',
      message: `${newSub.subscriptionCode} initiated. Recurring invoice generated.`,
    });
    return newSub;
  };

  const renewSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const curEnd = new Date(s.endDate);
        const nextEnd = new Date(curEnd);
        if (s.billingCycle === 'monthly') nextEnd.setDate(nextEnd.getDate() + 30);
        else if (s.billingCycle === 'quarterly') nextEnd.setDate(nextEnd.getDate() + 90);
        else nextEnd.setFullYear(nextEnd.getFullYear() + 1);

        const newDateStr = nextEnd.toISOString().split('T')[0];
        return {
          ...s,
          status: 'active',
          endDate: newDateStr,
          renewalDate: newDateStr,
        };
      })
    );
    showToast({ type: 'success', title: 'Renewed', message: 'Subscription successfully extended.' });
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'cancelled', autoRenew: false } : s))
    );
    showToast({ type: 'warning', title: 'Cancelled', message: 'Subscription status marked as Cancelled.' });
  };

  const changeSubscriptionPlan = (id: string, newPlanId: string, newAmount: number, newBillingCycle: any) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const product = products.find((p) => p.id === s.productId);
        const plan = product?.plans.find((p) => p.id === newPlanId);
        return {
          ...s,
          planId: newPlanId,
          planName: plan?.name || s.planName,
          amount: newAmount,
          billingCycle: newBillingCycle,
        };
      })
    );
    showToast({ type: 'success', title: 'Plan Changed', message: 'Subscription plan updated successfully.' });
  };

  // Quotations
  const createQuotation = (quoteData: Omit<Quotation, 'id' | 'quotationNumber'>): Quotation => {
    const qNum = `${settings.quotationPrefix}${Math.floor(8000 + Math.random() * 1000)}`;
    const newQuote: Quotation = {
      ...quoteData,
      id: `qt-${Date.now()}`,
      quotationNumber: qNum,
    };
    setQuotations((prev) => [newQuote, ...prev]);
    showToast({ type: 'success', title: 'Quotation Created', message: `${newQuote.quotationNumber} saved.` });
    return newQuote;
  };

  const sendQuotation = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'sent' } : q))
    );
    showToast({ type: 'info', title: 'Quotation Dispatched', message: 'Quotation PDF and link emailed to customer.' });
  };

  const approveQuotation = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'approved' } : q))
    );
    showToast({ type: 'success', title: 'Quotation Approved', message: 'Customer confirmed the quotation terms.' });
  };

  const convertQuotationToSubscription = (quotationId: string): { subscription: Subscription; invoice: Invoice } => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    const primaryItem = quote.items[0];
    const subCode = `${settings.subscriptionPrefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const renewalStr = nextMonth.toISOString().split('T')[0];

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      subscriptionCode: subCode,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerCompany: quote.customerCompany,
      customerEmail: quote.customerEmail,
      productId: primaryItem.productId,
      productName: primaryItem.productName,
      planId: primaryItem.planId,
      planName: primaryItem.planName,
      billingCycle: primaryItem.billingCycle,
      amount: quote.totalAmount,
      startDate: today,
      endDate: renewalStr,
      renewalDate: renewalStr,
      status: 'active',
      autoRenew: true,
      paymentMethod: 'UPI Autopay / Invoice Net 7',
    };

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `${settings.invoicePrefix}2026-${Math.floor(100 + Math.random() * 900)}`,
      subscriptionId: newSub.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerCompany: quote.customerCompany,
      issueDate: today,
      dueDate: renewalStr,
      items: quote.items.map((it) => ({
        description: `${it.productName} - ${it.planName} (${it.billingCycle})`,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        amount: it.total,
      })),
      subtotal: quote.subtotal,
      taxRate: quote.taxPercentage,
      taxAmount: quote.taxAmount,
      discountAmount: quote.discountAmount,
      total: quote.totalAmount,
      status: 'pending',
    };

    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'converted', convertedSubscriptionId: newSub.id } : q))
    );
    setSubscriptions((prev) => [newSub, ...prev]);
    setInvoices((prev) => [newInv, ...prev]);

    showToast({
      type: 'success',
      title: 'Workflow Complete!',
      message: `Quotation converted to Subscription ${newSub.subscriptionCode} & Invoice ${newInv.invoiceNumber}.`,
    });
    return { subscription: newSub, invoice: newInv };
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    showToast({ type: 'info', message: 'Quotation removed.' });
  };

  // Invoices & Payments
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const invNum = `${settings.invoicePrefix}2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast({ type: 'success', title: 'Invoice Issued', message: `${newInv.invoiceNumber} created.` });
    return newInv;
  };

  const payInvoice = (invoiceId: string, method: string = 'UPI', details?: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidDate: now.toISOString().split('T')[0],
              paymentMethod: method,
            }
          : inv
      )
    );

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      transactionReference: `TXN-${method.toUpperCase().slice(0, 4)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      amount: invoice.total,
      paymentDate: dateFormatted,
      paymentMethod: method as any,
      status: 'successful',
      upiId: method === 'UPI' ? details || 'customer@upi' : undefined,
      cardLast4: method === 'Credit Card' ? details || '4242' : undefined,
    };
    setPayments((prev) => [newPayment, ...prev]);

    setCustomers((prev) =>
      prev.map((c) => (c.id === invoice.customerId ? { ...c, totalSpent: c.totalSpent + invoice.total } : c))
    );

    showToast({
      type: 'success',
      title: 'Payment Successful',
      message: `₹${invoice.total.toLocaleString('en-IN')} received for ${invoice.invoiceNumber}. Receipt generated.`,
    });
  };

  // Discounts & Taxes
  const addDiscount = (disc: Omit<DiscountCode, 'id' | 'usedCount'>) => {
    const newDisc: DiscountCode = {
      ...disc,
      id: `disc-${Date.now()}`,
      usedCount: 0,
    };
    setDiscounts((prev) => [newDisc, ...prev]);
    showToast({ type: 'success', message: `Coupon ${newDisc.code} created.` });
  };

  const toggleDiscount = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const deleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    showToast({ type: 'info', message: 'Discount code deleted.' });
  };

  const addTax = (tax: Omit<TaxRule, 'id'>) => {
    const newTax: TaxRule = {
      ...tax,
      id: `tax-${Date.now()}`,
    };
    setTaxes((prev) => [newTax, ...prev]);
    showToast({ type: 'success', message: `Tax rule ${newTax.name} added.` });
  };

  const toggleTax = (id: string) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  // Staff
  const addStaff = (member: Omit<StaffMember, 'id' | 'joinedDate' | 'assignedCustomersCount'>) => {
    const newStaff: StaffMember = {
      ...member,
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      assignedCustomersCount: 0,
      avatar:
        member.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setStaff((prev) => [newStaff, ...prev]);
    showToast({ type: 'success', title: 'Staff Member Added', message: `${newStaff.name} appointed as ${newStaff.role}.` });
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast({ type: 'success', message: 'Staff profile updated.' });
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  // Settings
  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast({ type: 'success', title: 'Settings Saved', message: 'Platform configuration updated.' });
  };

  const resetToInitialData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setQuotations(INITIAL_QUOTATIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setDiscounts(INITIAL_DISCOUNTS);
    setTaxes(INITIAL_TAXES);
    setStaff(INITIAL_STAFF);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(DEMO_USERS.admin);
    localStorage.clear();
    showToast({ type: 'info', title: 'Reset Complete', message: 'Restored realistic sample dataset.' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || 'admin',
        switchRole,
        loginAs,
        loginWithCredentials,
        loginWithGoogle,
        registerAccount,
        logout,
        // Supabase real auth
        supabaseLoading: supabaseAuth.loading,
        supabaseSignIn,
        supabaseSignUp,
        supabaseSignInWithGoogle,
        supabaseSignOut,
        supabaseResetPassword,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        addPlan,
        updatePlan,
        deletePlan,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        subscriptions,
        createSubscription,
        renewSubscription,
        cancelSubscription,
        changeSubscriptionPlan,
        quotations,
        createQuotation,
        sendQuotation,
        approveQuotation,
        convertQuotationToSubscription,
        deleteQuotation,
        invoices,
        payments,
        payInvoice,
        createInvoice,
        discounts,
        addDiscount,
        toggleDiscount,
        deleteDiscount,
        taxes,
        addTax,
        toggleTax,
        staff,
        addStaff,
        updateStaff,
        toggleStaffStatus,
        settings,
        updateSettings,
        toasts,
        showToast,
        removeToast,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
