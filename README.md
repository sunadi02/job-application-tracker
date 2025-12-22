# 🎯 JobTracker - Your Ultimate Job Application Manager

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, intuitive web application to track and manage your job applications throughout your career journey. Built with Next.js 15, Firebase, and TypeScript for a seamless experience across all devices.

## 📸 Screenshots

### Landing Page
<img width="3840" height="2160" alt="Screenshot (390)" src="https://github.com/user-attachments/assets/e0b3275e-b263-46a8-a9b7-88ea3f14c8c4" />
<img width="3840" height="2160" alt="Screenshot (391)" src="https://github.com/user-attachments/assets/e3e2daa0-b881-4261-8fad-ec497c44b212" />

### Login Page
<img width="3840" height="2160" alt="Screenshot (393)" src="https://github.com/user-attachments/assets/169608b9-72e5-4deb-8bd7-2ca7a118f43e" />

### Signup Page
<img width="3840" height="2160" alt="Screenshot (392)" src="https://github.com/user-attachments/assets/c306643b-63c9-4c32-9cf3-b2b38709dfa7" />

### Dashboard
<img width="3840" height="2160" alt="Screenshot (394)" src="https://github.com/user-attachments/assets/abd600d9-7e10-425f-9c1b-04927a27f9c0" />

### Application Details
<img width="3840" height="2160" alt="Screenshot (395)" src="https://github.com/user-attachments/assets/780d1f3f-47b3-459e-86ff-3d54f1e50e0d" />

### Profile Management
<img width="3840" height="2160" alt="Screenshot (396)" src="https://github.com/user-attachments/assets/66746b95-1c80-41dc-9e27-4af8446e981a" />

### Mobile View
<img width="1251" height="2077" alt="Screenshot (398)" src="https://github.com/user-attachments/assets/769121c7-fe9a-4246-bf06-26fec03959e1" />


---

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure email/password authentication via Firebase Auth
- User profile management with photo upload
- Persistent sessions with automatic re-authentication
- Profile customization (name, email, phone, bio, location, website)

### 📊 **Application Tracking**
- Add, edit, and delete job applications
- Track multiple application statuses:
  - Applied
  - Interview
  - Offer
  - Rejected
- Real-time updates across all devices
- Search and filter applications by company, role, or status
- Add detailed notes for each application

### 📈 **Analytics Dashboard**
- Visual statistics showing:
  - Total applications
  - Applications by status
  - Success rate tracking
- Quick overview cards for at-a-glance insights

### 🎨 **Modern UI/UX**
- Beautiful gradient design with blue-to-purple theme
- Fully responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive navigation and user flows
- Dark mode support (system preference)

### 🚀 **Performance & Features**
- Real-time data synchronization with Firestore
- Image optimization and compression
- Fast page loads with Next.js 15
- Type-safe development with TypeScript
- Secure file uploads to Firebase Storage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Firebase Auth** | User authentication |
| **Cloud Firestore** | Real-time NoSQL database |
| **Firebase Storage** | Profile image storage |
| **Tailwind CSS** | Utility-first styling |
| **React Hooks** | State and lifecycle management |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- A **Firebase account** (free tier works perfectly)
- A code editor (VS Code recommended)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/jobtracker.git
cd jobtracker
```

### 2️⃣ Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3️⃣ Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Once created, click on the web icon (`</>`) to register your app

#### Enable Firebase Services
1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Firestore Database:**
   - Go to Firestore Database → Create database
   - Start in **production mode** or **test mode** (for development)
   - Choose a location closest to your users

3. **Storage:**
   - Go to Storage → Get started
   - Start in **test mode** (for development)
   - Set up security rules (see below)

#### Get Firebase Configuration
1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps" section
3. Copy your Firebase configuration object

### 4️⃣ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **⚠️ Security Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 5️⃣ Firebase Security Rules

#### Firestore Rules
Go to Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Storage Rules
Go to Storage → Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 6️⃣ Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📁 Project Structure

```
jobtracker/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Signup page
│   │   ├── profile/
│   │   │   └── page.tsx          # Profile management page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── AddApplicationForm.tsx   # Form to add applications
│   │   ├── ApplicationList.tsx      # List of applications
│   │   └── ProfileModal.tsx         # Profile edit modal
│   ├── lib/
│   │   ├── firebase.ts             # Firebase configuration
│   │   └── uploadImage.ts          # Image upload utilities
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── public/                         # Static assets
├── .env.local                      # Environment variables (create this)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎯 Usage Guide

### Creating an Account
1. Click "Sign Up" from the landing page
2. Enter your name, email, and password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### Adding a Job Application
1. In the dashboard, fill out the "Add New Application" form:
   - Company Name (required)
   - Role/Title (required)
   - Status (required)
   - Date Applied (required)
   - Notes (optional)
2. Click "Add Application"

### Managing Applications
- **Update Status:** Click the status dropdown on any application card
- **Search:** Use the search bar to find applications by company or role
- **Filter:** Use the status filter to view specific application types
- **Delete:** Click the trash icon to remove an application (requires confirmation)

### Profile Management
1. Click your profile picture/name in the header
2. Update your information:
   - Profile picture (JPG, PNG, WebP up to 5MB)
   - Name, email, phone
   - Bio, location, website
3. Click "Save Changes"

---

## 🔧 Configuration

### Customizing Tailwind
Edit `tailwind.config.js` to customize colors, fonts, and more:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',  // Customize primary color
        secondary: '#8b5cf6', // Customize secondary color
      },
    },
  },
}
```

### Adjusting Layout Padding
Edit `globals.css` or component classes to reduce horizontal padding:

```css
.max-w-7xl {
  max-width: 90rem; /* Increase max width */
  padding-left: 1rem; /* Reduce padding */
  padding-right: 1rem;
}
```

---

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type check
npx tsc --noEmit

# Build for production
npm run build
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Add environment variables in project settings
5. Deploy! 🎉

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in site settings

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues

- Email updates require recent authentication (Firebase security feature)
- Large images may take longer to upload on slow connections
- Application list may have a small delay on first load (Firestore cold start)

---

## 🔮 Roadmap

- [ ] Calendar view for interview schedules
- [ ] Email notifications for upcoming interviews
- [ ] Export applications to CSV/PDF
- [ ] Resume attachment support
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Analytics graphs and charts
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

---

## 📞 Support

If you encounter any issues or have questions:

- 🐛 [Open an issue](https://github.com/yourusername/jobtracker/issues)
- 💬 [Discussions](https://github.com/yourusername/jobtracker/discussions)
- 📧 Email: your.email@example.com

---

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🍴 Forking for your own use
- 📢 Sharing with others
- 💖 Sponsoring the project

---

<div align="center">
  <p>Made with Love by Sunadi @Sunadi02</p>
  <p>© 2024 JobTracker. All rights reserved.</p>
</div>
