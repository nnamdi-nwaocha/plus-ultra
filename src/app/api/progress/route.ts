import { NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'

export async function POST(request: Request) {
    try {
        const { user_id, completed_tasks, pending_tasks } = await request.json()

        // Check if user_id exists in the users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user_id)
            .single()

        if (userError || !userData) {
            console.error('User not found or Supabase error:', userError)
            return NextResponse.json({ error: 'User not found' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('progress_logs')
            .upsert({
                user_id,
                date: new Date().toISOString().split('T')[0],
                completed_tasks,
                pending_tasks
            })
            .select()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data[0])
    } catch (error) {
        console.error('Request processing error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const date = searchParams.get('date')

        const { data, error } = await supabase
            .from('progress_logs')
            .select('users(username), completed_tasks, pending_tasks')
            .eq('date', date || new Date().toISOString().split('T')[0])

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Request processing error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}