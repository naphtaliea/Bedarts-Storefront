export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface CustomerProfile {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  unit: string;
  selling_price: number;
  image_url: string | null;
  stock_quantity: number;
}

export interface OnlineOrder {
  id: string;
  customer_id: string;
  customer?: CustomerProfile;
  status: OrderStatus;
  fulfillment_type: "delivery" | "pickup";
  paystack_ref: string | null;
  total_amount: number;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string | null;
  delivery_notes: string | null;
  sale_id: string | null;
  created_at: string;
  updated_at: string;
  items?: OnlineOrderItem[];
}

export interface OnlineOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
}

export interface DeliveryDetails {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}
