import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uhdoooitknhicxcqimdz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9vb2l0a25oaWN4Y3FpbWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg5OTc1NTAsImV4cCI6MjAwNDU3MzU1MH0.hBJyyuWDQ0eMWEvbsOXBayhLS7w0xVeyaH0tH_QcThA"
);
