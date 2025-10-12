# Kazumi - HPP & Sales Dashboard (Next.js Version)

A modern web application to calculate Cost of Goods Sold (HPP), manage sales, inventory, and generate comprehensive reports for a clothing business. Rebuilt with Next.js for enhanced performance, scalability, and a superior user experience.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Chart.js

## Getting Started

To run this project locally, you'll need Node.js and npm (or yarn/pnpm) installed.

### 1. Install Dependencies

First, navigate to your project directory and install the necessary packages:

```bash
npm install
```

### 2. Run the Development Server

Once the installation is complete, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application uses your browser's `localStorage` for data persistence, so all data is stored locally on your machine.

## Key Features

- **HPP Calculator:** Dynamically calculate the cost of goods sold based on material prices, order details, and additional costs.
- **Inventory Management:** Track raw materials and finished goods in real-time.
- **Point of Sale (POS):** A dedicated interface for processing in-store sales.
- **Online Catalog:** A customer-facing view to browse products and place online orders.
- **Reporting:** Generate and print comprehensive reports for sales, production, and inventory.
- **User Management:** Role-based access control for different departments (Super Admin, Admin, Production, Warehouse, Sales).
- **Modern UI/UX:** A clean, responsive, and intuitive interface with smooth animations.

## Deployment

This Next.js application is ready for deployment on platforms like Vercel, Netlify, or any other provider that supports Node.js applications.

### Deploying with Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Import your project into Vercel.
3.  Vercel will automatically detect that it's a Next.js project, configure the build settings, and deploy it.

Your application will be live in minutes!
