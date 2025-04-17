# Personal Finance Visualizer

## Overview
A responsive web application for tracking personal finances built with Next.js, React, and shadcn/ui. This visualizer allows users to manage their financial transactions with add/edit/delete functionality and view their monthly expenses through interactive charts.

## ✨ Features
### Stage 1: Basic Transaction Tracking
- **Transaction Management**:
  - ✅ Add new transactions (amount, date, description)
  - ✏️ Edit existing transactions
  - 🗑️ Delete transactions
- **Transaction List View**:
  - 📋 View all transactions in a clean, sortable list
- **Data Visualization**:
  - 📊 Monthly expenses bar chart using Recharts
- **Form Validation**:
  - ✔️ Client-side validation for all input fields
- **Responsive Design**:
  - 📱 Works on mobile, tablet, and desktop devices
- **Error Handling**:
  - ❗ Proper error states for API failures and form validation

## 🛠️ Technologies Used
| Category       | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | Next.js (App Router), React           |
| **UI Library** | shadcn/ui (Radix UI + Tailwind CSS)   |
| **Charts**     | Recharts                              |
| **Backend**    | Next.js API Routes                    |
| **Database**   | MongoDB (via Mongoose)                |
| **Deployment** | Vercel                                |

## 🌐 Live Demo
The application is deployed on Vercel:  
🔗 [Live Demo](https://personal-finance-visualizer.vercel.app)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (for database)
- Git (for version control)

### Installation
```bash
# Clone the repository
git clone git@github.com:vshreyasivani/Personal-Finance-Visualizer.git
cd personal-finance-visualizer

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
echo "MONGODB_URI=your_mongodb_connection_string" > .env.local
echo "NEXT_PUBLIC_APP_ENV=development" >> .env.local

# Run the development server
npm run dev
# or
yarn dev
