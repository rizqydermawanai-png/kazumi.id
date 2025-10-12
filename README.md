# Kazumi HPP & Sales Calculator (Next.js Version)

A modern web application to calculate Cost of Goods Sold (HPP), manage sales, inventory, and generate comprehensive reports for a clothing business. This version is built with Next.js, React, and Tailwind CSS for a performant, server-rendered, and seamless user experience.

This project was upgraded from a standard Client-Side Rendered (CSR) React app to a Next.js application to leverage server-side rendering, improved performance, and a more robust, scalable architecture.

## Tech Stack

- **Framework:** Next.js
- **Frontend Library:** React, TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Chart.js
- **Local Storage:** `localStorage` is used for data persistence in this demo version. For a multi-user environment, this should be replaced with a database like Firestore or Supabase.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js (version 18.x or later) and npm installed on your machine.

- [Node.js](https://nodejs.org/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd kazumi-nextjs
    ```

2.  **Install dependencies:**
    Open a terminal in the project's root directory and run the following command to install all the required packages.
    ```bash
    npm install
    ```

### Running the Development Server

Once the installation is complete, you can start the development server:

```bash
npm run dev
```

This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page will auto-update as you edit the code.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server (requires a build first).
-   `npm run lint`: Runs the Next.js linter to check for code quality issues.

## Application Structure

The project uses the Next.js App Router structure:

-   `app/`: Contains all routes, components, and application logic.
    -   `layout.tsx`: The root layout of the application.
    -   `page.tsx`: The main entry point of the application, handling auth and dashboard logic.
    -   `globals.css`: Global styles and Tailwind CSS directives.
    -   `components/`: Shared React components (UI elements, layout parts).
    -   `views/`: Components that represent a full "page" view within the SPA-like dashboard (e.g., `ProductionPage`, `SalesPage`).
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Helper functions, constants, and business logic.
    -   `types/`: TypeScript type definitions.
