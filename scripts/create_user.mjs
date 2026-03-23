import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('dummy')) {
  console.error('Missing or invalid Supabase Service Role Key. Cannot bypass email confirmation locally without the real Admin key.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'roosevelt.miranda@gmail.com',
    password: 'Miranda@3012',
    email_confirm: true,
    user_metadata: { full_name: 'Roosevelt Miranda' }
  })

  if (error) {
    if (error.message.includes('User already registered')) {
        console.log('User already registered.')
        process.exit(0)
    }
    console.error('Error creating user:', error.message)
    process.exit(1)
  }

  console.log('User created successfully:', data.user.email)
}

createUser()
