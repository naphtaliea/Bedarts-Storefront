"use server";

import { createClient } from "@/src/lib/supabase/server";
import type { StorefrontProduct } from "@/src/lib/types";

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_storefront_products");
  if (error) throw new Error(error.message);
  return (data ?? []) as StorefrontProduct[];
}
