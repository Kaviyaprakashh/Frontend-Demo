import { number } from "yup";

export type CategoryProps = {
  parent_id: string | null;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  seo_url: string;
  img_path: string;
  img_alt: string;
  sort_order: string;
};

export type HomebannersProps = {
  title?: string;
  header_title?: string;
  description?: string;
  url?: string;
  webImgAlt?: string;
  mobileWebImgAlt?: string;
  mobileImgAlt?: string;
  sortOrder?: string;
  mobileImg?: string;
  mobileWebImg?: string;
  webImg?: string;
  banner_presence?: number;
};

export type ProductsProps = {
  name?: string;
  has_variants: number | null;
  product_code?: string;
  short_description?: string;
  min_order_qty?: string;
  max_order_qty?: string;
  short_description_mob?: string;
  description?: string;
  description_mob?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  seo_url?: string;
  product_tags?: string;
  model?: string;
  actual_price?: string;
  price?: string;
  weight?: string;
  discount?: string;
  tax_class_id?: string | null;
  weight_measure_id?: string | null;
  hsn_id?: string;
  hsn_code?: string;
  img_path?: string;
  img_alt?: string;
  thumb_path?: string;
  sort_order?: string;
  product_category_id?: any;
  related_products_id?: string;
  product_attribute?: attributeTypes[] | [];
  product_pricing?: any | [];
  product_vehicle?: any | [];
  product_variants: product_variantsTypes[] | [];
};
export type product_variantsTypes = {
  price: string;
  actual_price: string;
  weight: string;
  size: string;
};
export type attributeTypes = {
  attribute_id?: number | null;
  content?: string;
};
export type PricingNameProps = {
  title?: string;
  sort_order?: string;
};
export type PointSystemProps = {
  points?: string;
  description?: string;
};
export type ChangeDesignationProps = {
  type?: string | null;
};

export type GalleryImageProps = {
  imgAlt?: string;
  sortOrder?: string;
  uploadImg?: string;
};
export type CouriersProps = {
  name?: string;
  description?: string;
};

export interface AttributeGroupsProps {
  title: string;
  sort_order: string;
  attribute_list: Attributelist[];
}
interface Attributelist {
  title: string;
  sort_order: string;
}

export interface TaxProps {
  title: string;
  description: string;
  tax_rate: Taxrate[];
}
interface Taxrate {
  state_id: number | null;
  name: string;
  rate: string;
  tax_type: number | null;
  description?: string;
}
export type BrandTypes = {
  name: string;
  description: string;
  distributor: string;
  img_path: string;
  img_alt: string;
  sort_order: string;
};
export type SupplierTypes = {
  name: string;
  material_type: string;
  latitude: string;
  longitude: string;
  address: string;
  postal_code: string;
  country_id: any | null;
  state_id: string | null;
  district_id?: string | null;
  phone_no: string;
};
export type VehicleTypes = {
  name: string;
  vehicle_type: string;
  min_weight: string;
  max_weight: string;
  per_km_charge: string;
  min_charge: string;
  img_path: string;
};

export interface HomepageProductsProps {
  title: string;
  imgAlt: string;
  pageSortOrder: string;
  categoryId: string | null;
  newProducts: NewProduct[];
  imgPath: string;
}
interface NewProduct {
  productId?: number | null;
  sortOrder?: string;
}

export interface CurrencyProps {
  title: string;
  symbol: string;
  value?: any;
}

export interface HomeSalesProductsProps {
  title: string;
  sortOrder: string;
  productId?: any;
  imgAlt: string;
  imgPath: string;
}

export type ImgagePriviewProps = {
  CurrentRef: any;
  imgPath: string;
  handleClick?: () => void;
};

export type UserProps = {
  type: boolean;
  username?: string;
  firstName?: string;
  lastName?: string;
  executive_ref_id?: number | null;
  engineer_ref_id?: string;
  phone?: string;
  email?: string;
  password?: string;
  address_type?: string | null;
  address_1?: string;
  address_2?: string;
  city?: string;
  taluk?: string;
  district?: string | null;
  postal_code?: string;
  state_id?: string | null;
  country_id?: string | number | null;
  full_address?: string;
  is_default?: string | number;
  email2?: string;
  phone2?: string;
  landline?: string;
  gst?: any;
  fax?: string;
  pan?: string;
  img_path?: string;
  show_reward?: number | null;
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  bank_branch?: string;
  price_name_id?: number | null;
};

export type GalleryProps = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  seoUrl?: string;
  sortOrder?: string;
  listItems: ListItem[];
};
export interface GalleyVideoProps {
  listItems: ListItem[];
}

export interface ListItem {
  filePath: string;
  imgAlt: string;
  sortOrder: any;
  galleryItemId?: number;
}

export type FooterAddressProps = {
  title?: string;
  content?: string;
  city?: string;
  phone?: string;
  emailId?: string;
  sortOrder?: string;
  uploadImg: string;
};
export interface FaqProps {
  title: string;
  sortOrder: any;
  listFaqs: ListFaq[] | [];
}

export interface ListFaq {
  question?: string;
  answer?: string;
  sortOrder?: any;
}

export type DataListTypes = {
  page: number;
  size: number;
  items: any[];
  total: number;
};
export interface UserAddressProps {
  listAddress: ListAddress[] | [];
}

export interface ListAddress {
  is_default: any;
  address_type: number | null;
  address_1: string;
  // full_address: string;
  address_2: string;
  city: string;
  // taluk?: string;
  district_id: string | null;
  postal_code: string;
  state_id: number | null;
  country_id: number | null;
}

export type AddressProps = {
  userData: any;
  handleSuccess: () => void;
};

export type PopoverProps = {
  children: React.ReactNode;
  content?: string;
  title?: string;
};

export type BankAccountProps = {
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  ifscCode: string;
  swiftCode: string;
};

export type FilterReducetypes = {
  page?: number;
  size?: number;
  filters?: any;
};

export type BarChartProps = {
  series: any[];
  xtitle?: string;
  ytitle?: string;
  color?: any[];
};

export interface HomepageProductsView {
  homepageProductsId: number;
  title: string;
  categoryName: string;
  productList: ProductList[];
  img_path?: string;
  img_alt?: string;
  createdByName?: string;
  status: any;
}

export interface ProductList {
  homepageProductMapId: number;
  productId: number;
  sortOrder: number;
  productName: string;
}

export type tableActionProps = {
  onClickEditIcon?: (() => void) | false;
  onClickDeleteIcon?: (() => void) | false;
  onClickPasswordIcon?: (() => void) | false;
  onClickImageIcon?: (() => void) | false;
  onClickViewIcon?: (() => void) | false;
  onClickHistroyIcon?: (() => void) | false;
  onClickDesignationIcon?: (() => void) | false;
  onClickRewardIcon?: (() => void) | false;
  onClickPoinHistoryIcon?: (() => void) | false;
  onClickPermissionIcon?: (() => void) | false;
  onClickSiteVisitIcon?: (() => void) | false;
  onPressFollowUps?: (() => void) | false;
  permissionData: any;
};

export type ReviewProps = {
  title: string;
  ratings: string;
  content: string;
  file_path?: any;
};
