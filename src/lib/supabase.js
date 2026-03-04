import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qtazwauimmxbcumptzkq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXp3YXVpbW14YmN1bXB0emtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTIwMTQsImV4cCI6MjA4NzUyODAxNH0.iLT_pTwJQDYr66E_gKi5SRmtSwK24L0i79N05hKsOK8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
