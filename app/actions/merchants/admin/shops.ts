"use server";

/**
 * Host-owned merchants seam. Named in products_sdk's manifest `requires`
 * (commerce/merchants owns it) and imported by the SDK-installed admin
 * shop-categories and shop-units pages, which list what a tenant's shops
 * are grouped and measured by.
 *
 * merchants_sdk is not in the deliveryplatform registry template yet, so
 * there are no shops to read them from: an empty list is the honest answer
 * and each page renders its empty state. Composing merchants_sdk overwrites
 * this file with the real actions - the same contract as
 * app/actions/merchants/shop.ts, the seam base_sdk names.
 */
export interface ShopCategory {
  id?: string | number;
  [extra: string]: unknown;
}

export interface ShopUnit {
  id?: string | number;
  [extra: string]: unknown;
}

export async function getShopCategories(): Promise<ShopCategory[]> {
  return [];
}

export async function getShopUnits(): Promise<ShopUnit[]> {
  return [];
}
