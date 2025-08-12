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

## 📊 Step 7: Monitor Usage

1. **View Usage in Firebase Console**
   - Go to "Usage and billing" in Firebase console
   - Monitor your Firestore usage

2. **Free Tier Limits**
   - 1GB storage
   - 50,000 reads/day
   - 20,000 writes/day
   - 20,000 deletes/day

## 🔧 Advanced Configuration

### Environment Variables (Recommended)

1. **Create Environment File**
   - Create `.env.local` in your project root:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. **Update Firebase Config**
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

### Production Security Rules

For production, use more restrictive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    match /stories/{storyId} {
      allow read, write: if request.auth != null;
    }
    match /sprints/{sprintId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**
   - Check your Firebase configuration
   - Ensure all required fields are filled

2. **"Permission denied" error**
   - Check Firestore security rules
   - Ensure you're in test mode or have proper rules

3. **"Network error"**
   - Check your internet connection
   - Verify Firebase project is active

4. **"Quota exceeded" error**
   - Check your Firebase usage
   - Consider upgrading to paid plan

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## 🎉 Congratulations!

Your Scrum Simulator now has real cloud storage! Your data will be:
- ✅ Stored securely in the cloud
- ✅ Accessible from any device
- ✅ Automatically backed up
- ✅ Scalable for team collaboration

## 📈 Next Steps

1. **Test the full workflow** - Create projects, add stories, run sprints
2. **Invite team members** - Share your Firebase project for collaboration
3. **Monitor usage** - Keep an eye on your Firebase console
4. **Set up authentication** - Add user login for better security
5. **Deploy to production** - Use environment variables for security
