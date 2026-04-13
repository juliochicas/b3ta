"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

export const supabase = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
