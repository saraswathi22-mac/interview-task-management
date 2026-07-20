# 🚀 PrepFlow

A full-stack interview preparation planner that turns scattered prep notes into a structured, trackable routine — built with React, Redux Toolkit, and Firebase.

## 🔗 Live Demo: [View Live App](https://interview-task-management.netlify.app/)


## 💡 Why I Built This

During my own interview prep, I found it hard to track what I'd practiced, how consistently, and where the gaps were (e.g., too much DSA, not enough system design). PrepFlow is my answer to that — a self-hosted planner with real analytics, not just a to-do list.

## ✨ Features

* ✅ Add, edit, and delete interview tasks
* 📅 Organize tasks by date, with automatic rollover of unfinished items
* 🔒 Past tasks locked as read-only for accurate historical tracking
* 🎯 Task status tracking — Completed / Pending / Skipped
* 📊 Interactive analytics dashboard
  * Daily activity chart
  * Weekly progress overview
  * Tech stack distribution
  * Weekly insights and completion statistics
* 🔥 Firebase Authentication (secure sign-in)
* ☁️ Cloud Firestore for real-time data sync
* ⚡ Optimized performance with React memoization and derived state
* 🎨 Clean, responsive, and reusable component architecture

## 🛠️ Tech Stack

* Frontend:	React, Redux Toolkit, React Router
* Styling:	Tailwind CSS, Framer Motion
* Backend / Auth:	Firebase Authentication, Cloud Firestore
* Data Viz:	Recharts

## 🧠 Key Concepts Implemented

* Redux Toolkit state management
* Firebase Authentication & Firestore integration
* Memoization with `useMemo`
* Derived analytics from application state
* Reusable and composable React components
* Controlled forms and validation
* Responsive UI design
* Dynamic charts and data visualization

## 🚧 Notable Challenges Solved

* Rollover without data loss: unfinished tasks carry forward automatically while completed history stays untouched
* Accurate historical analytics: past days are locked read-only so stats can't drift after the fact
* Derived dashboards: analytics are computed from live task state rather than stored separately, so they're always in sync

## 🚀 Getting Started

```bash
git clone https://github.com/saraswathi22-mac/prep-flow
cd prep-flow
npm install
npm run dev
```

## 👤 Author

M A Saraswathi — Frontend Engineer (React/TypeScript) 
[LinkedIn](https://www.linkedin.com/in/m-a-saraswathi/) · [GitHub](https://github.com/saraswathi22-mac) · [Portfolio](https://saraswathi-portfolio.vercel.app/)