import { Product } from './product';

export interface PaymentMethod {
  code: string;
  title: string;
}

export interface ShippingMethod {
  carrier_code: string;
  method_code: string | null;
  carrier_title: string;
  method_title?: string; // Optional since it's not present in the first item of the payload
  amount: number;
  base_amount: number;
  available: boolean;
  error_message: string;
  price_excl_tax: number;
  price_incl_tax: number;
}

export interface CartAddress {
  id?: number;
  region?: string;
  region_id?: number;
  region_code?: string;
  country_id?: string;
  street: string[];
  company?: string;
  telephone: string;
  fax?: string;
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  prefix?: string;
  suffix?: string;
  vat_id?: string;
  customer_id?: number;
  email: string;
  same_as_billing?: number;
  customer_address_id?: number;
  save_in_address_book?: number;
  extension_attributes?: any;
  custom_attributes?: {
    attribute_code: string;
    value: string;
  }[];
}

export interface CartTotal {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  subtotal_with_discount: number;
  base_subtotal_with_discount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  shipping_discount_amount: number;
  base_shipping_discount_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  weee_tax_applied_amount: number | null;
  shipping_tax_amount: number;
  base_shipping_tax_amount: number;
  subtotal_incl_tax: number;
  base_subtotal_incl_tax: number;
  shipping_incl_tax: number;
  base_shipping_incl_tax: number;
  base_currency_code: string;
  quote_currency_code: string;
  items_qty: number;
  items: TotalItem[];
  total_segments: TotalSegment[];
}

interface TotalItem {
  item_id: number;
  price: number;
  base_price: number;
  qty: number;
  row_total: number;
  base_row_total: number;
  row_total_with_discount: number;
  tax_amount: number;
  base_tax_amount: number;
  tax_percent: number;
  discount_amount: number;
  base_discount_amount: number;
  discount_percent: number;
  price_incl_tax: number;
  base_price_incl_tax: number;
  row_total_incl_tax: number;
  base_row_total_incl_tax: number;
  options: string; // This is a string but seems to be a JSON representation, consider using any[] or a specific type if the structure is known
  weee_tax_applied_amount: number | null;
  weee_tax_applied: any | null; // This type is not specified in the provided data
  name: string;
}

interface TotalSegment {
  code: string;
  title: string;
  value: number;
  area?: string; // optional as it's not present in every segment
  extension_attributes?: {
    tax_grandtotal_details: any[]; // You might want to provide a more specific type if the structure is known
  };
}

export interface AddToCartPayload {
  sku: Product['sku'];
  qty: number;
}

export interface CartItem extends AddToCartPayload {
  item_id: number;
  name: Product['name'];
  price: Product['price'];
  product_type: string;
  quote_id: Cart['id'];
}

export interface Cart {
  id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_virtual: boolean;
  items: CartItem[];
  items_count: number;
  items_qty: number;
  customer: Customer;
  billing_address: BillingAddress;
  orig_order_id: number;
  currency: Currency;
  customer_is_guest: boolean;
  customer_note_notify: boolean;
  customer_tax_class_id: number;
  store_id: number;
  extension_attributes: ExtensionAttributes;
}

interface Customer {
  email: string | null;
  firstname: string | null;
  lastname: string | null;
}

interface BillingAddress {
  id: number;
  region: string | null;
  region_id: number | null;
  region_code: string | null;
  country_id: string | null;
  street: string[];
  telephone: string | null;
  postcode: string | null;
  city: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  same_as_billing: number;
  save_in_address_book: number;
}

interface Currency {
  global_currency_code: string;
  base_currency_code: string;
  store_currency_code: string;
  quote_currency_code: string;
  store_to_base_rate: number;
  store_to_quote_rate: number;
  base_to_global_rate: number;
  base_to_quote_rate: number;
}

interface ExtensionAttributes {
  shipping_assignments: ShippingAssignment[];
}

interface ShippingAssignment {
  shipping: {
    address: CartAddress;
    method: string;
  };
  items: CartItem[];
}
