<p align="center">
  <img src="public/logo.png" alt="KireDuit Logo" width="180" />
</p>

# KireDuit

KireDuit is a production-ready, mobile-first personal finance web application for tracking daily expenses and personal debts. It helps individual users manage three essential money flows in one clean dashboard:

1. Expenses you spend every day
2. Money you owe to other people
3. Money other people owe to you

The system is designed to be simple, fast, secure, bilingual, and easy to use on mobile devices.

---

## Production Overview

KireDuit is built with a modern full-stack web architecture:

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Authentication:** Firebase Authentication with Email/Password login
- **Database:** Cloud Firestore with user-scoped records
- **Validation:** React Hook Form and Zod
- **Charts & Reports:** Recharts with monthly spending insights
- **Internationalization:** English and Bahasa Melayu using `next-intl`
- **Deployment-ready:** Supports Vercel or Firebase Hosting workflows

Every user's financial records are scoped under their own Firebase user ID, keeping data separated between accounts.

---

## Key Features

### Authentication & Account Access

- Register new account
- Login with email and password
- Logout with confirmation dialog
- Forgot password flow
- Reset password flow
- Change password from Settings
- Delete account flow with password confirmation
- Protected routes for authenticated users only
- Public-only authentication pages for unauthenticated users

### Dashboard

- Financial summary at a glance
- Today's expenses
- Current month expenses
- Total amount you owe
- Total amount owed to you
- Recent expense records
- Recent debt records
- Quick access to add new records
- Mobile bottom navigation for fast access

### Expense Management

- Add expense
- Edit expense
- View expense details
- Delete expense
- Restore deleted expense
- Permanently delete expired/deleted expense
- Filter expenses by category
- Track amount, category, date, and description

Supported categories:

- Food
- Transport
- Shopping
- Bills
- Health
- Entertainment
- Education
- Other

### Debt Management

- Add debt record
- Edit debt record
- View debt details
- Delete debt record
- Restore deleted debt
- Permanently delete expired/deleted debt
- Track people you owe
- Track people who owe you
- Mark debt as paid
- Mark debt as unpaid
- Track person, amount, status, debt date, and description

Debt types:

- **I Owe** — money you owe someone else
- **Owe Me** — money someone else owes you

Debt statuses:

- Paid
- Unpaid

### Monthly Reports

- Monthly expense and debt summary
- Month navigation: previous, current, next
- Category filtering
- Total monthly expenses
- Total transactions
- Average daily spending
- Top spending category
- Highest spending day
- Comparison with previous month
- Expenses by category chart
- Biggest expense summary
- Daily spending bar chart
- Debt status chart
- Monthly insight summary
- Localized chart labels and tooltips

### Settings

- Profile management and display name update
- Security and password change
- Light, dark, and system theme modes
- Accent color customization
- Language selection for English and Bahasa Melayu
- Recently deleted records management
- Account logout and account deletion

### Internationalization

KireDuit supports English and Bahasa Melayu. The language system covers labels, buttons, placeholders, reports, settings, detail screens, empty states, chart tooltips, and date formatting.

### Recently Deleted

- Deleted expenses and debts are moved to Recently Deleted
- Records remain recoverable for 30 days
- Users can restore deleted records
- Users can permanently delete records
- Clear empty states when no deleted records exist

### User Experience

- Mobile-first layout
- Touch-friendly controls and large tap targets
- Clean cards and simple forms
- Friendly empty states
- Clear success and error toast messages
- Dark mode support
- Responsive layout for larger screens
- Accessible labels and password visibility controls

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Forms | React Hook Form |
| Validation | Zod |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Charts | Recharts |
| Internationalization | next-intl |
| Icons | Lucide React |
| Notifications | Sonner |
| Dates | date-fns |
| Linting | ESLint |

---

## Project Structure

```txt
src/
├── app/                    # Next.js App Router pages and route groups
│   └── [locale]/           # Localized application routes
├── components/             # Reusable UI and feature components
│   ├── auth/               # Authentication UI
│   ├── debts/              # Debt detail and debt-related components
│   ├── expenses/           # Expense detail and expense-related components
│   ├── reports/            # Monthly report charts and summaries
│   └── ui/                 # Shared UI primitives
├── contexts/               # Auth, data, theme, and app providers
├── i18n/                   # Internationalized routing helpers
├── lib/                    # Firebase, formatting, schemas, utilities, types
└── messages/               # Translation files
    ├── en.json
    └── ms.json
```

---

## Application Routes

KireDuit uses locale-prefixed routes such as `/en/dashboard` and `/ms/dashboard`.

### Public Routes

```txt
/
/[locale]/login
/[locale]/register
/[locale]/forgot-password
/[locale]/reset-password
```

### Protected Routes

```txt
/[locale]/dashboard
/[locale]/expenses
/[locale]/expenses/new
/[locale]/expenses/[expenseId]
/[locale]/expenses/[expenseId]/edit
/[locale]/debts
/[locale]/debts/new
/[locale]/debts/[debtId]
/[locale]/debts/[debtId]/edit
/[locale]/reports/monthly
/[locale]/settings
/[locale]/settings/profile
/[locale]/settings/security
/[locale]/settings/appearance
/[locale]/settings/language
/[locale]/settings/recently-deleted
/[locale]/settings/account
```

---

## Data Model Summary

Firestore records are scoped per user.

```txt
users/{userId}/expenses/{expenseId}
users/{userId}/debts/{debtId}
```

### Expense Record

```ts
type Expense = {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description?: string;
  deletedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

### Debt Record

```ts
type Debt = {
  id: string;
  userId: string;
  person: string;
  amount: number;
  type: "i-owe" | "owe-me";
  status: "paid" | "unpaid";
  dueDate?: string;
  description?: string;
  deletedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

---

## Getting Started

### Prerequisites

- Node.js 22
- npm
- Firebase project
- Firebase Authentication enabled with Email/Password provider
- Cloud Firestore database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` from `.env.example` and fill in your Firebase web app values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 3. Configure Firebase

In Firebase Console:

1. Create or select a Firebase project
2. Add a Web App
3. Enable **Authentication > Email/Password**
4. Create a **Cloud Firestore** database
5. Publish the rules from `firestore.rules`

### 4. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server after building |
| `npm run lint` | Runs ESLint checks |

---

## Production Readiness Checklist

Before deploying KireDuit to production, verify the following:

- [ ] Firebase environment variables are configured in the hosting provider
- [ ] Email/Password authentication is enabled
- [ ] Firestore database is created
- [ ] `firestore.rules` are reviewed and deployed
- [ ] Production domain is added to Firebase authorized domains
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Authentication flows are tested
- [ ] Expense and debt CRUD flows are tested
- [ ] Monthly report charts are tested with real data
- [ ] English and Bahasa Melayu screens are reviewed
- [ ] Account deletion behavior is understood and documented for your deployment

---

## Deployment

### Deploy to Vercel

1. Import the repository into Vercel
2. Set all `NEXT_PUBLIC_FIREBASE_*` environment variables
3. Use `npm run build` as the build command
4. Add the production domain to Firebase Authentication authorized domains

### Deploy to Firebase Hosting

The repository includes Firebase configuration files. Ensure your Firebase project is selected and your hosting/framework setup is configured correctly.

```bash
firebase login
firebase use <project-id>
firebase deploy
```

---

## Security Notes

- Firebase API keys are public client identifiers, but Firebase rules must protect user data.
- Do not commit `.env.local` or private credentials.
- Keep Firestore rules strict so users can only access their own records.
- Account deletion removes the Firebase Authentication account; Firestore cleanup should be handled according to your production policy, such as a backend cleanup function.
- Validate all user input before writing to Firestore.

---

## Quality Standards

- Type-safe code with TypeScript
- Schema-based validation with Zod
- User-friendly forms and error states
- Consistent mobile-first design
- Localized user-facing text
- Clear domain separation between expenses, debts, reports, settings, and authentication
- Build and lint checks before release

---

## License

This project is private unless a license is added.
