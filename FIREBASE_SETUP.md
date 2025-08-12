# 🔥 Firebase Setup Guide for Scrum Simulator

This guide will help you set up Firebase for your Scrum Simulator to enable cloud storage functionality.

## 📋 Prerequisites

- A Google account
- Basic knowledge of web development

## 🚀 Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project" or "Add project"
   - Enter a project name (e.g., "scrum-simulator")
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

3. **Wait for Project Creation**
   - Firebase will set up your project (takes a few minutes)
   - Click "Continue" when ready

## 🔧 Step 2: Enable Firestore Database

1. **Navigate to Firestore**
   - In the Firebase console, click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (we'll secure it later)
   - Click "Next"

3. **Choose Location**
   - Select a location close to your users (e.g., "us-central1")
   - Click "Done"

## 🔑 Step 3: Get Your Firebase Configuration

1. **Go to Project Settings**
   - Click the gear icon next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps" section
   - Click the web icon (</>)
   - Enter app nickname (e.g., "scrum-simulator-web")
   - Click "Register app"

3. **Copy Configuration**
   - You'll see a configuration object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

## ⚙️ Step 4: Update Your App Configuration

1. **Open the Firebase Config File**
   - Navigate to `src/config/firebase.ts` in your project

2. **Replace the Configuration**
   - Replace the placeholder config with your actual Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-actual-project-id.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-actual-project-id.appspot.com",
     messagingSenderId: "your-actual-messaging-sender-id",
     appId: "your-actual-app-id"
   };
   ```

## 🔒 Step 5: Configure Firestore Security Rules (Optional but Recommended)

1. **Go to Firestore Rules**
   - In Firebase console, go to Firestore Database
   - Click "Rules" tab

2. **Update Rules**
   - Replace the default rules with these more secure ones:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to all users under any document
       // WARNING: This is for development only!
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **Click "Publish"**

## 🧪 Step 6: Test Your Setup

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Storage Configuration**
   - Go to "Storage Config" in your app
   - Select "Cloud Storage" mode
   - Enter your Firebase configuration
   - Click "Test Connection"

3. **Verify Connection**
   - You should see "Cloud connection test successful!"
   - If you see an error, check your configuration


1. **Test the full workflow** - Create projects, add stories, run sprints
2. **Invite team members** - Share your Firebase project for collaboration
3. **Monitor usage** - Keep an eye on your Firebase console
4. **Set up authentication** - Add user login for better security
5. **Deploy to production** - Use environment variables for security

