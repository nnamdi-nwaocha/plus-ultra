import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'productivity_data.json')

export async function GET() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return NextResponse.json(JSON.parse(data))
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // File doesn't exist, return empty data
            return NextResponse.json({})
        }
        console.error('Error reading data file:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // Ensure the directory exists
        await fs.mkdir(DATA_DIR, { recursive: true })

        const data = await request.json()
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error writing data file:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

