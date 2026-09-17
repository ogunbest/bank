# Horizon Banking App

🚀 **Live Demo:** https://bank-six-tawny.vercel.app

A modern Nigerian banking web application built with **Next.js, TypeScript, Tailwind CSS, Appwrite, and Paystack**.

The application provides a digital banking experience with deposits, transfers, withdrawals, transaction history, bank account management, notifications, and an administrative dashboard.

## ✨ Features

### 👤 User Features

* Secure user authentication
* User profile management
* Account balance
* Deposit through Paystack
* Nigerian bank account linking
* Bank account verification
* Withdraw funds to a bank account
* Transfer money to other registered users
* Transaction history
* Transaction filtering
* Beneficiary management
* Notifications
* Password management

### 🛡️ Admin Features

* Secure admin-only dashboard
* View all registered users
* View user account balances
* View total customer funds
* View all bank accounts
* View all transactions
* Search transactions
* Filter transactions by type
* Filter transactions by status
* View individual transaction details
* View individual customer activity
* Manage user account status
* Monitor deposits, transfers, and withdrawals

## 🧑‍💻 Tech Stack

| Technology    | Purpose                      |
| ------------- | ---------------------------- |
| Next.js       | Full-stack React framework   |
| React         | User interface               |
| TypeScript    | Type safety                  |
| Tailwind CSS  | Styling                      |
| Appwrite      | Authentication and database  |
| Paystack      | Nigerian payment integration |
| Lucide React  | Icons                        |
| Framer Motion | Animations                   |

## 📁 Project Structure

```text
app/
├── admin/
│   ├── accounts/
│   ├── transactions/
│   ├── users/
│   └── page.tsx
│
├── dashboard/
│   ├── accounts/
│   ├── analytics/
│   ├── banking/
│   ├── beneficiaries/
│   ├── cards/
│   ├── settings/
│   ├── transactions/
│   ├── transfers/
│   └── withdrawals/
│
components/
├── admin/
├── common/
└── dashboard/

lib/
├── actions/
├── appwrite.ts
├── paystack.ts
└── utils.ts
```

## 💳 Payment Integration

The application uses **Paystack** for payment processing.

The current integration supports:

* Payment initialization
* Payment verification
* Balance updates
* Transaction records
* Nigerian bank lookup
* Bank account verification
* Withdrawals

## 🏦 Banking

Users can:

1. Add a Nigerian bank account.
2. Verify the account.
3. Save the account to their profile.
4. Select the account for withdrawals.
5. View their linked bank accounts.
6. Remove eligible bank accounts.

## 🔄 Transfers

Users can transfer funds to another registered user using their email address.

The application validates:

* Recipient existence
* Transfer amount
* Available balance
* Self-transfer attempts

Both sender and recipient receive transaction records and notifications.

## 🔔 Notifications

The application provides notifications for important account activity, including:

* Deposits
* Transfers
* Withdrawals
* Account activity

Users can view notifications and mark them as read.

## 🔐 Security

Admin access is protected using both:

* Configured administrator email
* `admin` user role

Sensitive environment variables are stored in `.env` and should **never be committed to GitHub**.

## ⚙️ Environment Variables

Create a `.env` file containing the required configuration:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_SAVINGS_GOALS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID=

ADMIN_EMAIL=

PAYSTACK_SECRET_KEY=
```

**Never expose or commit secret API keys.**

## 🚀 Getting Started

Clone the repository and enter the project:

```bash
git clone https://github.com/ogunbest/bank.git
cd bank
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🧪 Development

Run TypeScript checking with:

```bash
npm exec tsc -- --noEmit
```

## 📊 Admin Dashboard

The admin dashboard is available at:

```text
/admin
```

Admin access is restricted to the configured administrator account.

The admin dashboard provides visibility into:

* Registered users
* Customer balances
* Bank accounts
* Transactions
* Deposits
* Transfers
* Withdrawals
* Customer activity

The **Total Customer Funds** figure represents the combined balances of customer accounts for reporting purposes. It does not transfer or merge customer funds into the administrator's personal account.

## ⚠️ Disclaimer

This project is currently a **development and testing banking application**.

It should not be used to hold or process real customer funds in production without appropriate security reviews, financial compliance, infrastructure, monitoring, and regulatory requirements.

## 👨‍💻 Author

**Joshua Ogunbukola**

GitHub: [@ogunbest](https://github.com/ogunbest)

## 📄 License

This project is currently intended for educational and development purposes.

<!-- Vercel deployment test -->
