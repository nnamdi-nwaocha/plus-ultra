import { NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'

export async function POST(request: Request) {
    try {
        const { task_name, expected_time, user_id } = await request.json()

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
            .from('tasks')
            .insert([{ task_name, expected_time, user_id }])
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

export async function PUT(request: Request) {
    try {
        const { id, status } = await request.json()

        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', id)
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

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ message: 'Task deleted successfully' })
    } catch (error) {
        console.error('Request processing error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}