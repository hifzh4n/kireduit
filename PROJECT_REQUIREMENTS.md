# KireDuit

## Overview

KireDuit is a simple personal finance web application built for individual users.

The application focuses on only three core functions:

1. Track daily expenses
2. Record money that I owe to other people
3. Record money that other people owe to me

The application should remain simple, clean, mobile-friendly, and easy to use.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Sonner
* Lucide React
* React Hook Form
* Zod
* date-fns
* next-themes

## Backend

* Firebase Authentication
* Firestore Database

## Font

* Inter

---

# Design Principles

## Mobile First

This application is primarily designed for mobile devices.

Requirements:

* Mobile-first layout
* Responsive design
* Touch-friendly interface
* Large tap targets
* Easy navigation
* Fast interaction

---

## User Experience

Requirements:

* Clean interface
* Simple forms
* Easy navigation
* Minimal clicks
* Consistent spacing
* Clear labels
* Friendly empty states
* Friendly error messages

Avoid:

* Complex animations
* Glassmorphism
* Unnecessary gradients
* Over-engineering
* Cluttered layouts

---

# Theme System

## Light Theme

* Primary: Emerald
* Background: White
* Card: White
* Border: Slate 200
* Text: Slate 900

## Dark Theme

* Primary: Emerald
* Background: Slate 950
* Card: Slate 900
* Border: Slate 800
* Text: Slate 100

---

# Logo

Logo will be added later.

Temporary placeholder:

* Icon: KD
* Text: KireDuit

---

# Authentication

## Features

* Register
* Login
* Logout
* Forgot Password
* Reset Password

## Requirements

* No email verification
* Redirect to Dashboard after login
* Redirect to Dashboard after registration
* Root route redirects to Login when unauthenticated
* Root route redirects to Dashboard when authenticated

---

# Application Routes

## Public

```
/
```

Redirect based on authentication state.

---

## Authentication

```
/login
/register
/forgot-password
/reset-password
```

---

## Protected

```
/dashboard

/expenses
/expenses/new
/expenses/[expenseId]
/expenses/[expenseId]/edit

/debts
/debts/new
/debts/[debtId]
/debts/[debtId]/edit

/settings
/settings/profile
/settings/security
/settings/appearance
/settings/account
```

---

# Navigation

Use Bottom Navigation.

Items:

1. Dashboard
2. Expenses
3. Debts
4. Settings

Do not use a desktop sidebar as the primary navigation.

---

# Dashboard Module

## Summary Cards

Display:

* Today's Expenses
* This Month's Expenses
* I Owe
* Owe Me

## Additional Sections

* Recent Expenses
* Recent Debts

## Quick Actions

Floating Action Button:

* Add Expense
* Add Debt

---

# Expenses Module

## Features

* Add Expense
* Edit Expense
* Delete Expense
* View Expense List
* View Expense Details

## Fields

* Amount
* Category
* Date
* Description
* Created At
* Updated At
* User ID

## Categories

* Food
* Transport
* Shopping
* Bills
* Health
* Entertainment
* Education
* Other

---

# Debts Module

## Features

* Add Debt
* Edit Debt
* Delete Debt
* View Debt List
* View Debt Details
* Mark Paid
* Mark Unpaid

## Debt Types

### I Owe

Money that I owe to another person.

### Owe Me

Money that another person owes to me.

## Fields

* Person Name
* Amount
* Debt Type
* Status
* Due Date (Optional)
* Description
* Created At
* Updated At
* User ID

## Status

* Paid
* Unpaid

## Tabs

* I Owe
* Owe Me

---

# Settings Module

## Profile

Route:

```
/settings/profile
```

Fields:

* Display Name
* Email

---

## Security

Route:

```
/settings/security
```

Features:

* Change Password

---

## Appearance

Route:

```
/settings/appearance
```

Features:

* Light Theme
* Dark Theme

---

## Account

Route:

```
/settings/account
```

Features:

* Logout
* Delete Account

---

# Firestore Structure

## Users

```
users/{userId}
```

Fields:

```
displayName
email
createdAt
updatedAt
```

---

## Expenses

```
users/{userId}/expenses/{expenseId}
```

Fields:

```
amount
category
date
description
createdAt
updatedAt
userId
```

---

## Debts

```
users/{userId}/debts/{debtId}
```

Fields:

```
personName
amount
type
status
dueDate
description
createdAt
updatedAt
userId
```

---

# Security Rules

Requirements:

* Users can only access their own data
* Users cannot read other users' expenses
* Users cannot read other users' debts
* Users cannot modify other users' records

---

# UI Components

Use shadcn/ui components:

* Button
* Card
* Input
* Label
* Textarea
* Select
* Dialog
* Alert Dialog
* Sheet
* Dropdown Menu
* Badge
* Tabs
* Avatar
* Separator
* Skeleton
* Calendar
* Popover
* Form

---

# Toast Notifications

Use Sonner.

Success examples:

* Login successful
* Registration successful
* Expense added
* Expense updated
* Expense deleted
* Debt added
* Debt updated
* Debt deleted
* Debt marked as paid
* Logout successful

Error examples:

* Authentication failed
* Validation failed
* Network error
* Permission denied

---

# UX Requirements

## Loading

Show:

* Skeleton loaders
* Loading indicators

---

## Empty States

Display friendly messages when:

* No expenses found
* No debts found

---

## Delete Actions

Always show confirmation dialog before deletion.

---

## Forms

Requirements:

* Short
* Clear
* Easy to complete
* Mobile-friendly

---

# Scope

Keep the application simple.

Do not add:

* Income tracking
* Budget planning
* Analytics dashboard
* Reports
* Admin panel
* Team collaboration
* Notifications
* Email verification
* Unnecessary features

Focus only on:

1. Expenses
2. Debts I owe
3. Debts owed to me
