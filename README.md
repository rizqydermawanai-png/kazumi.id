# Kazumi HPP & Sales Calculator

A modern web application to calculate Cost of Goods Sold (HPP), manage sales, inventory, and generate comprehensive reports for a clothing business. Built with React and Tailwind CSS for a seamless user experience.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Chart.js
- **Database:** Google Firebase Firestore (for real-time functionality)
- **Deployment:** Firebase Hosting

## Setting up Firebase Real-time Database (Firestore)

This application is currently configured to use your browser's `localStorage` for data persistence, which means all data is stored locally on your machine. To enable real-time, multi-user functionality, you need to connect it to a cloud database. Follow these steps to set up Google Firebase Firestore.

### Prerequisites

- A Google account and a Firebase project. If you don't have one, create a project at the [Firebase Console](https://console.firebase.google.com/).

### Step 1: Create a Firestore Database

1.  Open your project in the [Firebase Console](https://console.firebase.google.com/).
2.  From the left-hand menu, navigate to **Build > Firestore Database**.
3.  Click the **Create database** button.
4.  A dialog will appear. Choose **Start in test mode**.
    -   **Important:** Test mode allows open access to your database for 30 days, which is convenient for initial development. For a production application, you **must** configure [Security Rules](https://firebase.google.com/docs/firestore/security/get-started) to protect your data.
5.  Click **Next**.
6.  Choose a location for your Firestore data (e.g., `asia-southeast2` for Jakarta). This cannot be changed later.
7.  Click **Enable**.

Your database is now ready to use.

### Step 2: Get Your Firebase Configuration

To connect your web app to Firebase, you need your project's configuration credentials.

1.  In the Firebase Console, go to **Project Overview** (click the gear icon ⚙️ next to it) and select **Project settings**.
2.  In the **General** tab, scroll down to the **Your apps** section.
3.  Click on the web icon (`</>`) to register a new web app.
4.  Give your app a nickname (e.g., "Kazumi Web App") and click **Register app**.
5.  Firebase will generate a configuration object. Copy the `firebaseConfig` object. It will look like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIza....",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "...",
      appId: "1:..."
    };
    ```

### Step 3: Integrate Firebase into the Application

1.  Create a new file in your project, for example: `src/firebase.ts`.
2.  Paste your `firebaseConfig` into this file and initialize Firebase.

    ```typescript
    // src/firebase.ts
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Export the Firestore database instance
    export const db = getFirestore(app);
    ```

3.  Now, you can import `db` in any component to interact with your database. To make the application fully real-time, you will need to replace the `usePersistentState` hook (which uses `localStorage`) with Firestore's real-time listeners (`onSnapshot`) to fetch and update data across all users.

## Deployment to Firebase

Follow these steps to deploy the application to Firebase Hosting.

### Prerequisites

1.  **Node.js and npm:** Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
2.  **Firebase Account:** You need a Google account to create a Firebase project. Go to the [Firebase Console](https://console.firebase.google.com/) to create a new project if you don't have one.

### Step 1: Install Firebase CLI

If you haven't already, install the Firebase Command Line Interface (CLI) globally using npm.

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

Log in to your Google account through the Firebase CLI. This command will open a browser window for you to authenticate.

```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project

Navigate to your project's root directory in the terminal and run the initialization command.

```bash
firebase init
```

The CLI will ask you a series of questions. Here’s how to answer them for this project:

1.  **Which Firebase features do you want to set up?**
    -   Use the arrow keys to navigate to `Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys`.
    -   Press the `Space` key to select it, then press `Enter`.

2.  **Please select an option:**
    -   Choose `Use an existing project` and select the Firebase project you created in the prerequisites.

3.  **What do you want to use as your public directory?**
    -   This is the most important step. Your built React app files will be in a folder, typically named `dist` or `build`.
    -   Type `dist` and press `Enter`. If your build process creates a different folder, enter that name instead.

4.  **Configure as a single-page app (rewrite all urls to /index.html)?**
    -   Type `y` (for Yes) and press `Enter`. This is crucial for React Router to work correctly.

5.  **Set up automatic builds and deploys with GitHub?**
    -   Type `n` (for No) and press `Enter` for a manual setup.

6.  **File dist/index.html already exists. Overwrite?**
    -   **IMPORTANT:** If you already have a `dist` folder, it might ask to overwrite `index.html`. Type `n` (for No) to keep your existing file.

This will create two new files in your project: `.firebaserc` and `firebase.json`. Your `firebase.json` should look something like this:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 4: Build the Application

Before deploying, you need to build the application for production. If you are using a standard React setup like Vite or Create React App, run the build command. This will generate the `dist` folder with optimized static files.

```bash
# Example for a Vite or Create React App project
npm run build
```

### Step 5: Deploy to Firebase

After the build process is complete, deploy your application with a single command.

```bash
firebase deploy
```

Firebase will upload your files and provide you with a unique URL for your live application (e.g., `https://your-project-id.web.app`). Congratulations, your app is now live!