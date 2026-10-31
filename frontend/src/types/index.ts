export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
  customerId?: string; // Links customer account to customer profile
}

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  billingCycle: BillingCycle;
  price: number; // in INR
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  iconName: string;
  plans: Plan[];
  createdAt: string;
  activeSubscriptionsCount: number;
  status: 'active' | 'archived';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstin?: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  avatar: string;
  totalSpent: number;
}

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
  id: string;
  subscriptionCode: string; // e.g. BL-SUB-1042
  customerId: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number; // in INR
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  paymentMethod: string;
  assignedStaffId?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'converted' | 'expired';

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. BL-QT-8092
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  issueDate: string;
  expiryDate: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  status: QuotationStatus;
  notes?: string;
  convertedSubscriptionId?: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. BL-INV-2026-081
  subscriptionId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  customerGstin?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: InvoiceStatus;
  paidDate?: string;
  paymentMethod?: string;
}

export type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  transactionReference: string; // e.g. TXN-IND-92841
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Razorpay' | 'NEFT';
  status: PaymentStatus;
  cardLast4?: string;
  upiId?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 500 for ₹500
  validUntil: string;
  isActive: boolean;
  usedCount: number;
  minimumAmount?: number;
}

export interface TaxRule {
  id: string;
  name: string;
  percentage: number;
  description: string;
  isActive: boolean;
  type: 'GST' | 'IGST' | 'CGST_SGST';
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Billing Operations' | 'Customer Support' | 'Sales Representative';
  department: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar: string;
  assignedCustomersCount: number;
}

export interface SystemSettings {
  companyName: string;
  legalEntity: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  currency: string;
  currencySymbol: string;
  invoicePrefix: string;
  quotationPrefix: string;
  subscriptionPrefix: string;
  defaultPaymentTermsDays: number;
  enableAutoRenewDefault: boolean;
  sendEmailOnInvoice: boolean;
  sendRenewalReminders: boolean;
}
