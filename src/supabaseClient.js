import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qfwcoozggpcxyxvgqtbk.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd2Nvb3pnZ3BjeHl4dmdxdGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTUzOTAsImV4cCI6MjA5MjI3MTM5MH0.9ZCaSotmGGV4P4toBD4T2QtPd2GPIVgT9C9alDljuU8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
