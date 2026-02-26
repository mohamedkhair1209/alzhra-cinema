import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function diagnostic() {
    console.log('--- Supabase Diagnostic: Insert Test ---')

    const testMovie = {
        title_ar: 'فيلم تجريبي',
        title_en: 'Test Movie',
        genre_ar: 'دراما',
        genre_en: 'Drama',
        duration: 120, // Check if it's duration or duration_minutes
        is_active: true
    }

    console.log('Attempting to insert test movie...')
    const { data, error } = await supabase.from('movies').insert([testMovie]).select()

    if (error) {
        console.error('Insert error:', error.message)
        console.error('Code:', error.code)
        console.error('Detail:', error.detail)
        console.error('Hint:', error.hint)
    } else {
        console.log('Insert SUCCESS!', data)
    }
}

diagnostic()
