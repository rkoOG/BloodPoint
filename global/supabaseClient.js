// src/supabase/supabaseClient.js
import "react-native-url-polyfill/auto"; // ⚠️ obrigatório RN
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Copia da dashboard Supabase
const supabaseUrl = "https://nfghdrfurglfsjpalcgf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZ2hkcmZ1cmdsZnNqcGFsY2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzQ3MzksImV4cCI6MjA1NzgxMDczOX0.SH9LQfhYsxfhnEJFrVRKOVQOCNCcgLq_fcN_ruB-mWs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // (opcional) desliga Web Sockets para evitar o pacote `ws`
  realtime: { enabled: false },
});
