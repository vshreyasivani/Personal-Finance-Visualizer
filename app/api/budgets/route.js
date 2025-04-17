import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
    try {
      await connectToDatabase();
      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const budgets = await Budget.find({ 
        month: {
          $gte: currentMonth,
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      });
      return NextResponse.json(budgets);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

export async function POST(request) {
    try {
      const body = await request.json();
      await connectToDatabase();
      
      // Add this validation for the month
      const budgetData = {
        ...body,
        month: body.month ? new Date(body.month) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      };
  
      const newBudget = new Budget(budgetData);
      await newBudget.save();
      
      return NextResponse.json(newBudget, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }