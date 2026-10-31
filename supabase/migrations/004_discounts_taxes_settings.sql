-- 004_discounts_taxes_settings.sql
-- Taxes and System Settings Tables

-- 1. Taxes Table
CREATE TABLE IF NOT EXISTS public.taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('GST', 'IGST', 'CGST_SGST')) NOT NULL DEFAULT 'GST',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. System Settings Table (Singleton pattern)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INT PRIMARY KEY DEFAULT 1,
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view taxes"
    ON public.taxes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin can manage taxes"
    ON public.taxes FOR ALL
    USING (public.get_current_role() = 'admin');

CREATE POLICY "Anyone authenticated can view settings"
    ON public.system_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin can manage settings"
    ON public.system_settings FOR ALL
    USING (public.get_current_role() = 'admin');

-- Seed initial settings row
INSERT INTO public.system_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Seed initial taxes
INSERT INTO public.taxes (name, percentage, description, type, is_active)
VALUES
    ('Integrated GST (IGST)', 18.00, 'Standard 18% interstate GST for Indian B2B digital SaaS services.', 'IGST', true),
    ('Intrastate GST (CGST 9% + SGST 9%)', 18.00, 'Split tax for domestic state customers with matching state code.', 'CGST_SGST', true),
    ('Export / SEZ Zero Tax', 0.00, 'Zero-rated supply for verified Special Economic Zone & export clients.', 'GST', false)
ON CONFLICT DO NOTHING;
