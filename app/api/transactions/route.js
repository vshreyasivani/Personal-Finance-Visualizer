
// app/api/transactions/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// GET /api/transactions - Get all transactions
export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request) {
    try {
      const body = await request.json();
      
      // VALIDATION - REJECT IF NO CATEGORY
      if (!body.category || !['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'].includes(body.category)) {
        return NextResponse.json(
          { error: 'Valid category is required' }, 
          { status: 400 }
        );
      }
  
      await connectToDatabase();
      
      const newTransaction = new Transaction({
        description: body.description,
        amount: body.amount,
        date: new Date(body.date),
        type: body.type,
        category: body.category // ENFORCE THIS FIELD
      });
  
      const saved = await newTransaction.save();
      console.log('SAVED WITH CATEGORY:', saved.category); // Verify
      
      return NextResponse.json(saved, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }