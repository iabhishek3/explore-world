import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltevqkkcrzprnpmzcjrq.supabase.co';
const supabaseKey = 'sb_publishable_XrmnefWcM4RgrDwzWH6qxg_taUA2v8g';

export const supabase = createClient(supabaseUrl, supabaseKey);
