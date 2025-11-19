
import { createClient } from '@supabase/supabase-js'

// 보안 위한 환경 변수
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase 

// 환경 변수 : root에 추가하는 것이 관용적
// .env 파일 만들고 import.meta.env 로 추가