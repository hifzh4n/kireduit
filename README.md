KireDuit is a simple mobile-first personal finance app for tracking expenses and debts.

## Setup

Create `.env.local` from `.env.example` and fill in your Firebase web app values. Enable Email/Password sign-in in Firebase Authentication, create Firestore, then publish `firestore.rules`.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Firebase Authentication: register, login, logout, forgot password, reset password
- Firestore data scoped under `users/{userId}`
- Expenses: add, edit, delete, list, details
- Debts: add, edit, delete, mark paid/unpaid, list by I Owe and Owe Me
- Settings: profile, security, appearance, account
- Mobile bottom navigation and dark mode

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
