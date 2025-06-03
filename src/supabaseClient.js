import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olhxckdrkstolqpdzhyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saHhja2Rya3N0b2xxcGR6aHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTcyMzgsImV4cCI6MjA2NDMzMzIzOH0.df4xizh1eqn9ySHXwQyCUDvxWp6AAtj6IpXxq9AH5q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);