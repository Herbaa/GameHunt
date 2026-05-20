import { supabase } from '../supabase.js'

export const fetchGames = async () => {
  const { data, error } = await supabase.from('games').select('*')
  if (error) throw error
  return data
}