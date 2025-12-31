import { db } from '@/lib/db'
import { facilities } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await db.select().from(facilities).limit(1)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
