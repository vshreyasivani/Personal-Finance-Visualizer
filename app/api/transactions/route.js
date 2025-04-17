
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
    await connectToDatabase();
    
    const newTransaction = new Transaction(body);
    await newTransaction.save();
    
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}