import { Navigate, Outlet } from "react-router";
import { AccessPermissionObject } from "../@Types/accesspermission";
import { GetInitialMainRouteName } from "../Shared/PrivateRouteMethods";
import { getPermissionData } from "../Shared/Methods";

export const NavigateInitialRoute = (
  ConditionalData: number,
  permission: AccessPermissionObject
) => {
  return ConditionalData ? (
    <Outlet />
  ) : (
    <Navigate to={GetInitialMainRouteName(permission)} />
  );
};

export const DashboardPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.dashboard?.dashboard_menu,
    permission
  );
};

export const OrdersPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(permission?.orders?.orders_menu, permission);
};
export const RewardRedemptionPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.reward_redemption?.reward_redemption_menu,
    permission
  );
};
export const ReturnRequestPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.return_request?.return_request_menu,
    permission
  );
};

export const NotificationMenuPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.return_request?.return_request_menu,
    permission
  );
};
export const ConatactUsRequestPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.contact_us?.contact_us_menu,
    permission
  );
};
export const CategoryPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.categories?.categories_menu,
    permission
  );
};

export const ProductPricingPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.product_pricing_name?.product_pricing_menu,
    permission
  );
};

export const ProductsPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.products?.product_menu,
    permission
  );
};

export const AttributesPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.attributes_groups?.attributes_group_menu,
    permission
  );
};

export const HomepageProductPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.home_page_products?.homepage_product_menu,
    permission
  );
};
export const WrightPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.product_masters?.weight?.weight_menu,
    permission
  );
};

export const BrandPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.brands?.brands_menu,
    permission
  );
};

export const VehiclePrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.vehicle?.vehicle_menu,
    permission
  );
};
export const SupplierPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.supplier?.supplier_menu,
    permission
  );
};

export const TaxPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(permission?.masters?.tax?.tax_menu, permission);
};

export const OrderStatusPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.order_status?.order_status_menu,
    permission
  );
};
export const PinCodePrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.pin_code?.pincode_menu,
    permission
  );
};
export const PointSystemPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.points?.points_menu,
    permission
  );
};

export const ReviewPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.masters?.review?.review_menu,
    permission
  );
};

export const AdminPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.manage_user?.admin?.admin_menu,
    permission
  );
};
export const SalesExecutivePrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.manage_user?.sales_executive?.sales_executive_menu,
    permission
  );
};

export const EngineerPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.manage_user?.engineer?.engineer_menu,
    permission
  );
};

export const CustomerPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.manage_user?.customer?.customer_menu,
    permission
  );
};

export const BannersPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.homepage_banners?.homepage_banners_menu,
    permission
  );
};

export const HomeSalesProductPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.homepage_sales_products?.homepage_sales_products_menu,
    permission
  );
};

export const GalleryPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.gallery?.gallery_menu,
    permission
  );
};

export const FooterAddressPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.footer_address?.footer_address_menu,
    permission
  );
};

export const FaqPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(permission?.cms?.faq?.faq_menu, permission);
};

export const CustomerSupportPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.customer_support?.customer_support_menu,
    permission
  );
};

export const BankAccountPrivateRouter = () => {
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return NavigateInitialRoute(
    permission?.cms?.bank_account?.bank_account_menu,
    permission
  );
};
