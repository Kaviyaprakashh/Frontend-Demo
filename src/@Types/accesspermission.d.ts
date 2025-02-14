import { number } from "yup";

export interface AccessPermissionObject {
  dashboard: Dashboard;
  reward_redemption: RewardRedemption;
  return_request: ReturnRequest;
  contact_us: ContactUsMenu;
  orders: Orders;
  product_masters: ProductMasters;
  masters: Masters;
  manage_user: ManageUser;
  cms: Cms;
}
export interface ContactUsMenu {
  contact_us_menu: number;
}
export interface ReturnRequest {
  return_request_menu: number;
  return_request_edit: number;
  return_action_edit: number;
}
export interface Dashboard {
  dashboard_menu: number;
  total_orders: number;
  executive_orders: number;
  customer_orders: number;
  app_orders: number;
  web_orders: number;
  total_customer: number;
  monthwise_order: number;
  monthwise_order_value: number;
}

export interface RewardRedemption {
  reward_redemption_menu: number;
  change_status: number;
}

export interface Orders {
  orders_menu: number;
  change_status: number;
  view: number;
  edit_weight: number;
  edit_shipping_price: number;
  invoice_download: number;
  return_action_edit: number;
}

export interface ProductMasters {
  product_master_menu: number;
  categories: Categories;
  products: Products;
  product_pricing_name: ProductPricingName;
  attributes_groups: AttributesGroups;
  home_page_products: HomePageProducts;
  weight: Weight;
}

export interface Categories {
  categories_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Products {
  product_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  gallery_crud_action: GalleryCrudAction;
}

export interface GalleryCrudAction {
  gallery_image_menu: number;
  add: number;
  edit: number;
  delete: number;
}

export interface ProductPricingName {
  product_pricing_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface AttributesGroups {
  attributes_group_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface HomePageProducts {
  homepage_product_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Weight {
  weight_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Masters {
  masters_menu: number;
  brands: Brands;
  vehicle: Vehicle;
  supplier: Supplier;
  tax: Tax;
  order_status: OrderStatus;
  pin_code: PinCode;
  points: Points;
  review: Review;
}

export interface Brands {
  brands_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Vehicle {
  vehicle_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Supplier {
  supplier_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Tax {
  tax_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface OrderStatus {
  order_status_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface PinCode {
  pincode_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Points {
  points_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Review {
  review_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface ManageUser {
  user_menu: number;
  admin: Admin;
  sales_executive: SalesExecutive;
  engineer: Engineer;
  customer: Customer;
}

export interface Admin {
  admin_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  change_designation: number;
  change_Password: number;
}

export interface SalesExecutive {
  sales_executive_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  change_designation: number;
  change_Password: number;
  order_history: OrderHistory;
}

export interface OrderHistory {
  order_history_menu: number;
  view: number;
}

export interface Engineer {
  engineer_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  change_designation: number;
  change_Password: number;
  point_history: number;
  order_history: OrderHistory2;
}

export interface OrderHistory2 {
  order_history_menu: number;
  view: number;
}

export interface Customer {
  customer_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  change_designation: number;
  change_Password: number;
  point_history: number;
  order_history: OrderHistory3;
}

export interface OrderHistory3 {
  order_history_menu: number;
  view: number;
}

export interface Cms {
  cms_menu: number;
  homepage_banners: HomepageBanners;
  homepage_sales_products: HomepageSalesProducts;
  gallery: Gallery;
  footer_address: FooterAddress;
  faq: Faq;
  customer_support: CustomerSupport;
  bank_account: BankAccount;
}

export interface HomepageBanners {
  homepage_banners_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface HomepageSalesProducts {
  homepage_sales_products_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Gallery {
  gallery_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
  gallery_image: GalleryImage;
}

export interface GalleryImage {
  gallery_image_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface FooterAddress {
  footer_address_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface Faq {
  faq_menu: number;
  add: number;
  edit: number;
  delete: number;
  view: number;
  change_status: number;
}

export interface CustomerSupport {
  customer_support_menu: number;
  edit_support_number: number;
}

export interface BankAccount {
  bank_account_menu: number;
  edit_bank_account: number;
}
