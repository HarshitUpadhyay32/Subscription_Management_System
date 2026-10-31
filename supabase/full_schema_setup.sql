-- ====================================================================
-- BRIGHTLOOP SUBSCRIPTION MANAGEMENT SYSTEM
-- Fully Idempotent Setup Script for Supabase SQL Editor
-- Project: https://ixcsplwnrwqbylivxkeq.supabase.co
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. CORE TABLES
-- ====================================================================

-- 1. Profiles Table (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'staff', 'customer')) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company_name TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'service',
    sales_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    description TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    billing_cycle TEXT CHECK (billing_cycle IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
    min_quantity INT DEFAULT 1,
    availability_start DATE,
    availability_end DATE,
    auto_close BOOLEAN DEFAULT FALSE,
    allow_early_closing BOOLEAN DEFAULT TRUE,
    allow_pause BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    plan_id UUID REFERENCES public.plans(id) ON DELETE RESTRICT,
    status TEXT CHECK (status IN ('draft', 'quotation', 'confirmed', 'active', 'paused', 'closed')) DEFAULT 'draft',
    start_date DATE NOT NULL,
    expiry_date DATE,
    payment_terms TEXT DEFAULT 'Due on receipt',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Subscription Items Table
CREATE TABLE IF NOT EXISTS public.subscription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_name TEXT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    status TEXT CHECK (status IN ('draft', 'confirmed', 'paid', 'cancelled')) DEFAULT 'draft',
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_sub_billing_period UNIQUE (subscription_id, billing_period_start, billing_period_end)
);

-- 8. Invoice Items Table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL
);

-- 9. Discounts Table
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('fixed', 'percentage')) NOT NULL,
    value NUMERIC(12, 2) NOT NULL,
    min_purchase NUMERIC(12, 2) DEFAULT 0,
    min_quantity INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    max_usage INT DEFAULT 0,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('upi', 'bank_transfer', 'cash', 'other')) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 11. Taxes Table
CREATE TABLE IF NOT EXISTS public.taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('GST', 'IGST', 'CGST_SGST')) NOT NULL DEFAULT 'GST',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. System Settings Table (Clean recreation with UUID to prevent type conflicts)
DROP TABLE IF EXISTS public.system_settings CASCADE;
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    company_name TEXT NOT NULL DEFAULT 'Brightloop Technologies India Pvt Ltd',
    legal_entity TEXT DEFAULT 'Brightloop SaaS Billing Platform',
    gstin TEXT DEFAULT '27AAGCB9210P1ZG',
    email TEXT DEFAULT 'billing@brightloop.io',
    phone TEXT DEFAULT '+91 22 4910 8800',
    address TEXT DEFAULT 'Level 14, Platina Tower, Bandra Kurla Complex',
    city TEXT DEFAULT 'Mumbai',
    state TEXT DEFAULT 'Maharashtra',
    pincode TEXT DEFAULT '400051',
    currency TEXT DEFAULT 'INR',
    currency_symbol TEXT DEFAULT '₹',
    invoice_prefix TEXT DEFAULT 'BL-INV-',
    quotation_prefix TEXT DEFAULT 'BL-QT-',
    subscription_prefix TEXT DEFAULT 'BL-SUB-',
    default_payment_terms_days INT DEFAULT 7,
    enable_auto_renew_default BOOLEAN DEFAULT TRUE,
    send_email_on_invoice BOOLEAN DEFAULT TRUE,
    send_renewal_reminders BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_profile_id ON public.customers(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);

-- ====================================================================
-- 2. USER REGISTRATION TRIGGER (auth.users -> public.profiles & customers)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    -- If customer role, also automatically ensure customer row exists
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN
        INSERT INTO public.customers (profile_id, name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            NEW.email
        )
        ON CONFLICT (email) DO UPDATE
        SET profile_id = EXCLUDED.profile_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users view own profile or admin/staff view all" ON public.profiles;
CREATE POLICY "Users view own profile or admin/staff view all"
    ON public.profiles FOR SELECT
    USING (id = auth.uid() OR public.get_current_role() IN ('admin', 'staff'));

DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles"
    ON public.profiles FOR ALL
    USING (public.get_current_role() = 'admin');

-- Products & Plans
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Public read plans" ON public.plans;
CREATE POLICY "Public read plans" ON public.plans FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage plans" ON public.plans;
CREATE POLICY "Admin manage plans" ON public.plans FOR ALL USING (public.get_current_role() = 'admin');

-- Customers
DROP POLICY IF EXISTS "Customers view own profile" ON public.customers;
CREATE POLICY "Customers view own profile" ON public.customers FOR SELECT
    USING (profile_id = auth.uid() OR public.get_current_role() IN ('admin', 'staff'));

DROP POLICY IF EXISTS "Staff and Admin manage customers" ON public.customers;
CREATE POLICY "Staff and Admin manage customers" ON public.customers FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Subscriptions
DROP POLICY IF EXISTS "Customer view own subscriptions" ON public.subscriptions;
CREATE POLICY "Customer view own subscriptions" ON public.subscriptions FOR SELECT
    USING (
        customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid())
        OR public.get_current_role() IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Staff and Admin manage subscriptions" ON public.subscriptions;
CREATE POLICY "Staff and Admin manage subscriptions" ON public.subscriptions FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Subscription Items
DROP POLICY IF EXISTS "Customer view own subscription items" ON public.subscription_items;
CREATE POLICY "Customer view own subscription items" ON public.subscription_items FOR SELECT
    USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions 
            WHERE customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid())
        )
        OR public.get_current_role() IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Staff and Admin manage subscription items" ON public.subscription_items;
CREATE POLICY "Staff and Admin manage subscription items" ON public.subscription_items FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Invoices
DROP POLICY IF EXISTS "Customer view own invoices" ON public.invoices;
CREATE POLICY "Customer view own invoices" ON public.invoices FOR SELECT
    USING (
        customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid())
        OR public.get_current_role() IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Staff and Admin manage invoices" ON public.invoices;
CREATE POLICY "Staff and Admin manage invoices" ON public.invoices FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Invoice Items
DROP POLICY IF EXISTS "Customer view own invoice items" ON public.invoice_items;
CREATE POLICY "Customer view own invoice items" ON public.invoice_items FOR SELECT
    USING (
        invoice_id IN (
            SELECT id FROM public.invoices 
            WHERE customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid())
        )
        OR public.get_current_role() IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Staff and Admin manage invoice items" ON public.invoice_items;
CREATE POLICY "Staff and Admin manage invoice items" ON public.invoice_items FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Discounts
DROP POLICY IF EXISTS "Public read discounts" ON public.discounts;
CREATE POLICY "Public read discounts" ON public.discounts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage discounts" ON public.discounts;
CREATE POLICY "Admin manage discounts" ON public.discounts FOR ALL
    USING (public.get_current_role() = 'admin');

-- Payments
DROP POLICY IF EXISTS "Customer view payments for their invoices" ON public.payments;
CREATE POLICY "Customer view payments for their invoices" ON public.payments FOR SELECT
    USING (
        invoice_id IN (
            SELECT id FROM public.invoices 
            WHERE customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid())
        )
        OR public.get_current_role() IN ('admin', 'staff')
    );

DROP POLICY IF EXISTS "Staff and Admin record payments" ON public.payments;
CREATE POLICY "Staff and Admin record payments" ON public.payments FOR ALL
    USING (public.get_current_role() IN ('admin', 'staff'));

-- Taxes & Settings
DROP POLICY IF EXISTS "Anyone authenticated can view taxes" ON public.taxes;
CREATE POLICY "Anyone authenticated can view taxes" ON public.taxes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage taxes" ON public.taxes;
CREATE POLICY "Admin manage taxes" ON public.taxes FOR ALL USING (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Anyone authenticated can view settings" ON public.system_settings;
CREATE POLICY "Anyone authenticated can view settings" ON public.system_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage settings" ON public.system_settings;
CREATE POLICY "Admin manage settings" ON public.system_settings FOR ALL USING (public.get_current_role() = 'admin');

-- ====================================================================
-- 4. SEED DATA
-- ====================================================================

INSERT INTO public.system_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, type, sales_price, cost_price, description, variants)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Business CRM', 'software', 799.00, 200.00, 'Enterprise pipeline management, client communications, and deal tracking.', 
     '[{"name": "Standard", "price_adjustment": 0}, {"name": "WhatsApp Connector", "price_adjustment": 500}]'::jsonb),
    ('a0000000-0000-0000-0000-000000000002', 'Cloud ERP Core', 'software', 3499.00, 1000.00, 'Multi-warehouse stock control, procurement, and GST e-invoicing compliance.',
     '[{"name": "Growth", "price_adjustment": 0}, {"name": "Scale Enterprise", "price_adjustment": 6500}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.plans (id, product_id, name, price, billing_cycle, min_quantity, allow_pause)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Starter Monthly', 799.00, 'monthly', 1, true),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Professional Annual', 14990.00, 'yearly', 1, true),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Growth Monthly', 3499.00, 'monthly', 1, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.taxes (name, percentage, description, type, is_active)
VALUES
    ('Integrated GST (IGST)', 18.00, 'Standard 18% interstate GST for Indian B2B digital SaaS services.', 'IGST', true),
    ('Intrastate GST (CGST 9% + SGST 9%)', 18.00, 'Split tax for domestic state customers with matching state code.', 'CGST_SGST', true)
ON CONFLICT DO NOTHING;
