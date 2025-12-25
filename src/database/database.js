import 'dotenv/config';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.API_KEY;

console.log(supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;