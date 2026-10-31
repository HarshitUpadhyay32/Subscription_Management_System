
# Subscription Management System

A centralized platform to manage products, subscription plans, recurring billing, invoices, payments, discounts, and revenue analytics.

Built to simplify the complete subscription lifecycle for businesses through a unified management system.

---

## About the Project

The **Subscription Management System** is designed to help businesses manage their subscription-based operations from a single platform.

The project is based on the Brightloop Software business scenario, where customers purchase monthly or yearly subscriptions, businesses manage products and plans, and finance teams handle recurring invoices and payments.

The system aims to replace manual spreadsheets, invoice creation, renewal tracking, and financial reporting with an integrated software solution.

## Key Features

### 1. Authentication & User Management
- Customer registration and login.
- Role-based access control.
- Admin, Staff, and Customer roles.
- Secure password hashing.
- Password reset functionality.
- Admin-controlled staff creation.

### 2. Product & Plan Management
- Create, update, and manage products.
- Product variants with additional pricing.
- Create subscription plans.
- Daily, weekly, monthly, and yearly billing cycles.
- Minimum quantity and plan availability settings.
- Pause, renew, and close subscription plans.

### 3. Quotation & Subscription Management
- Reusable quotation templates.
- Generate quotations for customers.
- Convert quotations into subscriptions.
- Automatic subscription numbering.
- Subscription start and expiry dates.
- Subscription lifecycle tracking.

### 4. Recurring Billing & Invoices
- Automatic invoice generation.
- Invoice creation from subscriptions.
- Automatic tax calculations.
- Invoice confirmation and cancellation.
- Invoice sending and printing.
- Prevention of duplicate billing.

### 5. Discount Management
- Fixed amount discounts.
- Percentage-based discounts.
- Minimum purchase requirements.
- Product-specific discounts.
- Subscription-wide discounts.
- Discount validity and usage limits.

### 6. Payment Management
- Record customer payments.
- Multiple payment methods.
- Payment date and amount tracking.
- Invoice-payment association.
- Outstanding and overdue invoice tracking.

### 7. Finance Dashboard
- Active subscription overview.
- Revenue summaries.
- Total payments received.
- Outstanding amounts.
- Overdue invoice reports.
- Filtering and financial summaries.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| UI Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| API Documentation | Swagger |
| Version Control | Git & GitHub |

*The technology stack represents the proposed development architecture.*

---

## Project Architecture

```text
Subscription-Management-System/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── app.ts
│
├── docs/
│   ├── database-design.md
│   ├── api-documentation.md
│   └── project-architecture.md
│
├── .gitignore
└── README.md
```

---

## Team & Responsibilities

The project is being developed by a team of four developers.

| Developer | Module | Responsibilities |
|---|---|---|
| Developer 1 | Authentication & Customer Portal | User management, authentication, authorization, customer dashboard |
| Developer 2 | Products & Plans | Product management, variants, plans, taxes, discounts |
| Developer 3 | Subscriptions & Billing | Quotations, subscription lifecycle, recurring billing |
| Developer 4 | Invoices & Finance | Invoice management, payments, finance dashboard, testing |

Each developer is responsible for implementing, testing, and integrating their assigned module.

---

## Development Roadmap

- [ ] Project initialization and architecture.
- [ ] Database schema and relationships.
- [ ] Authentication and role management.
- [ ] Product and variant management.
- [ ] Subscription plan management.
- [ ] Tax and discount management.
- [ ] Quotation management.
- [ ] Subscription lifecycle management.
- [ ] Recurring billing automation.
- [ ] Invoice management.
- [ ] Payment management.
- [ ] Finance dashboard and reporting.
- [ ] Module integration.
- [ ] End-to-end testing.
- [ ] Performance optimization.
- [ ] Production deployment.

---

## Performance Requirements

The system is designed with scalability in mind.

- Target response time: Under 2 seconds per page.
- Support thousands of subscription records.
- Server-side pagination and filtering.
- Efficient database queries.
- Prevention of duplicate recurring invoices.
- Secure role-based access to business data.

Performance targets will be validated through testing.

---

## Getting Started

### Prerequisites

Install the following:

- Node.js (LTS)
- PostgreSQL
- npm
- Git

### Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/Subscription_Management_System.git

cd Subscription_Management_System
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/subscription_db"
JWT_SECRET="your-secret-key"
```

Then run:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

*Note: These commands describe the planned setup. They will work once the corresponding application files, scripts and Prisma schema have been implemented.*

---

## Future Enhancements

- Payment gateway integration.
- Automated email notifications.
- Advanced financial analytics.
- Subscription usage tracking.
- Automated renewal reminders.
- Exportable financial reports.

---

## Project Objective

To develop a reliable, scalable, and user-friendly subscription management platform that automates business operations, simplifies recurring billing, and provides real-time financial visibility.

---

## Contributors

Developed collaboratively by a team of four developers.

**Project:** Subscription Management System  
**Domain:** Full-Stack Web Development  
**Repository:** GitHub

---

## License

This project is developed for educational and project-development purposes.
