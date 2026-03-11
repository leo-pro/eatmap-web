import { createClient } from '@supabase/supabase-js'
import { supabaseEnv } from '@/integrations/supabase/env'

export const supabase = createClient(supabaseEnv.url, supabaseEnv.key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
