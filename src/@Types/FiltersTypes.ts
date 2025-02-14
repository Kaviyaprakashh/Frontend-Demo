export type CategoryFiltersType = {
  name?: string;
};

export type HomeBannerFiltersType = {
  title?: string;
};

export type ProductFilterTypes = {
  product_name?: string;
  product_code?: string;
  seo_url?: string;
  category_id?: any;
  order_by?: string;
  order?: string;
  min_price?: string;
  max_price?: string;
};

export type ProductPricingNameFilterProps = {
  title?: string;
};

export type AttrubuteGroupsFilterProps = {
  title?: string;
};

export type HomepageProductsFilterProps = {
  title?: string;
};

export type WeightFilterProps = {
  name?: string;
};
export type PinCodeFilterProps = {
  pincodeNo?: string;
};
export type PointProps = {
  to_amount: string;
  from_amount: string;
  points?: string;
};
export type OrderFiltersType = {
  order_no?: string;
  from_date?: string;
  to_date?: string;
  user_id?: string | null;
  order_status_id?: any | null;
  order_type?: string | null;
  is_pending?: string;
  executive_id?: string;
};
export type PointHistoryFilters = {
  order_no?: string;
};
