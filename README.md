# Personal Finance Visualizer

## Overview
A comprehensive personal finance management application built with Next.js, React, and shadcn/ui. This visualizer helps users track transactions, categorize spending, set budgets, and gain insights through interactive data visualizations.

## ✨ Features

### 📌 Core Features
- **Transaction Management**:
  - ✅ Add, edit, and delete transactions
  - 📋 Clean, sortable transaction list
- **Responsive Design**:
  - 📱 Fully responsive across all devices
- **Form Validation**:
  - ✔️ Client-side validation for all inputs
- **Error Handling**:
  - ❗ Clear error states for API failures

### 🗂️ Stage 2: Category Management
- **Transaction Categorization**:
  - 🏷️ Predefined spending categories
  - 🔄 Easy category assignment
- **Visual Analytics**:
  - 📊 Category-wise pie chart
- **Enhanced Dashboard**:
  - 💳 Summary cards (total expenses, recent transactions)
  - 📈 Category breakdown visualization

### 💰 Stage 3: Budgeting System
- **Budget Management**:
  - 🗓️ Monthly category budgets
  - ✏️ Add budget limits
- **Budget Tracking**:
  - 📉 Budget vs. actual comparison chart
  - 

## 🛠️ Technology Stack
| Category       | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | Next.js (App Router), React, TypeScript|
| **UI Library** | shadcn/ui (Radix UI + Tailwind CSS)   |
| **Data Viz**   | Recharts                              |
| **State**      | React hooks (useState, useEffect)     |
| **Backend**    | Next.js API Routes                    |
| **Database**   | MongoDB (via Mongoose)                |
| **Deployment** | Vercel                                |

## 🌐 Live Demo
Experience the application live:  
🔗 [Live Demo](https://personal-finance-visualizer.vercel.app)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Installation
```bash
# Clone repository
git clone git@github.com:vshreyasivani/Personal-Finance-Visualizer.git
cd personal-finance-visualizer

# Install dependencies
npm install

# Configure environment
cp .env.local

# Start development server
npm run dev
