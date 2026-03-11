type PublicSupabaseEnv = {
  url: string
  key: string
}

function getRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_KEY') {
  const value = import.meta.env[name]?.trim()

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`)
  }

  return value
}

export const supabaseEnv: PublicSupabaseEnv = {
  url: getRequiredEnv('VITE_SUPABASE_URL'),
  key: getRequiredEnv('VITE_SUPABASE_KEY'),
}
