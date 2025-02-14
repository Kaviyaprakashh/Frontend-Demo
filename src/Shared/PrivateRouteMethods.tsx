import { AccessPermissionObject } from "../@Types/accesspermission";
type ScreenType = {
  id: number;
  pathname?: string;
  isVisible: number;
};

export const mainScreens = [
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "dashboard",
  },
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "/orders",
  },
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "product_masters/category",
  },
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "",
  },
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "",
  },
  {
    id: 1,
    key_name: "dashboard_menu",
    pathname: "",
  },
];

export const getInitialProductRouteName = (
  permission: AccessPermissionObject
) => {
  const ProductScreens = [
    {
      id: 1,
      pathname: "product_masters/category",
      isVisible: permission?.product_masters?.categories?.categories_menu,
    },
    {
      id: 2,
      pathname: "product_masters/product_pricing_name",
      isVisible:
        permission?.product_masters?.product_pricing_name?.product_pricing_menu,
    },
    {
      id: 3,
      pathname: "product_masters/products",
      isVisible: permission?.product_masters?.products?.product_menu,
    },
    {
      id: 4,
      pathname: "product_masters/attributegroups",
      isVisible:
        permission?.product_masters?.attributes_groups?.attributes_group_menu,
    },
    {
      id: 5,
      pathname: "product_masters/homepage_product",
      isVisible:
        permission?.product_masters?.home_page_products?.homepage_product_menu,
    },
    {
      id: 6,
      pathname: "product_masters/weight",
      isVisible: permission?.product_masters?.weight?.weight_menu,
    },
  ];
  return (
    ProductScreens?.find((screen: ScreenType) => screen?.isVisible === 1)
      ?.pathname ?? "/"
  );
};
export const getInitialMastersRouteName = (
  permission: AccessPermissionObject
) => {
  const MastersScreens = [
    {
      id: 1,
      pathname: "manage_masters/brand",
      isVisible: permission?.masters?.brands?.brands_menu,
    },
    {
      id: 2,
      pathname: "manage_masters/vehicle",
      isVisible: permission?.masters?.vehicle?.vehicle_menu,
    },
    {
      id: 3,
      pathname: "manage_masters/supplier",
      isVisible: permission?.masters?.supplier?.supplier_menu,
    },
    {
      id: 4,
      pathname: "manage_masters/tax",
      isVisible: permission?.masters?.tax?.tax_menu,
    },
    {
      id: 5,
      pathname: "manage_masters/order_status",
      isVisible: permission?.masters?.order_status?.order_status_menu,
    },
    {
      id: 6,
      pathname: "manage_masters/pincode",
      isVisible: permission?.masters?.pin_code?.pincode_menu,
    },
    {
      id: 7,
      pathname: "manage_masters/PointSystem",
      isVisible: permission?.masters?.points?.points_menu,
    },
    //   {
    //     id: 6,
    //     pathname: "manage_masters/review",
    //     isVisible: permission?.masters?.rev,
    //   },
  ];
  return (
    MastersScreens?.find((screen: ScreenType) => screen?.isVisible === 1)
      ?.pathname ?? "/"
  );
};
export const getInitialUsersRouteName = (
  permission: AccessPermissionObject
) => {
  const UsersScreen = [
    {
      id: 1,
      pathname: "manage_users/admin",
      isVisible: permission?.manage_user?.admin?.admin_menu,
    },
    {
      id: 2,
      pathname: "manage_users/sales_engineer",
      isVisible: permission?.manage_user?.sales_executive?.sales_executive_menu,
    },
    {
      id: 3,
      pathname: "manage_users/engineers",
      isVisible: permission?.manage_user?.engineer?.engineer_menu,
    },
    {
      id: 4,
      pathname: "manage_users/customers",
      isVisible: permission?.manage_user?.customer?.customer_menu,
    },
  ];
  return (
    UsersScreen?.find((screen: ScreenType) => screen?.isVisible === 1)
      ?.pathname ?? "/"
  );
};
export const getInitialCmsRouteName = (permission: AccessPermissionObject) => {
  const CMSScreen = [
    {
      id: 1,
      pathname: "cms/home_banners",
      isVisible: permission?.cms?.homepage_banners?.homepage_banners_menu,
    },
    {
      id: 2,
      pathname: "cms/homesales_product",
      isVisible:
        permission?.cms?.homepage_sales_products?.homepage_sales_products_menu,
    },
    {
      id: 3,
      pathname: "cms/gallery",
      isVisible: permission?.cms?.gallery?.gallery_menu,
    },
    {
      id: 4,
      pathname: "cms/footer_address",
      isVisible: permission?.cms?.footer_address?.footer_address_menu,
    },
    {
      id: 5,
      pathname: "cms/faq",
      isVisible: permission?.cms?.faq?.faq_menu,
    },
    {
      id: 6,
      pathname: "cms/customer_support",
      isVisible: permission?.cms?.customer_support?.customer_support_menu,
    },
    {
      id: 7,
      pathname: "cms/bank_account",
      isVisible: permission?.cms?.bank_account?.bank_account_menu,
    },
  ];
  return (
    CMSScreen?.find((screen: ScreenType) => screen?.isVisible === 1)
      ?.pathname ?? "/"
  );
};

export const GetInitialMainRouteName = (permission: AccessPermissionObject) => {
  const mainScreens = [
    {
      id: 1,
      pathname: "dashboard",
      isVisible: permission?.dashboard?.dashboard_menu,
    },
    {
      id: 2,
      pathname: "orders",
      isVisible: permission?.orders?.orders_menu,
    },
    {
      id: 3,
      pathname: "reward_redemption",
      isVisible: permission?.reward_redemption?.reward_redemption_menu,
    },
    {
      id: 4,
      pathname: getInitialProductRouteName(permission),
      isVisible: permission?.product_masters?.product_master_menu,
    },
    {
      id: 5,
      pathname: getInitialMastersRouteName(permission),
      isVisible: permission?.masters?.masters_menu,
    },
    {
      id: 6,
      pathname: getInitialUsersRouteName(permission),
      isVisible: permission?.manage_user?.user_menu,
    },
    {
      id: 7,
      pathname: getInitialCmsRouteName(permission),
      isVisible: permission?.cms?.cms_menu,
    },
  ];

  return (
    mainScreens?.find((screen: ScreenType) => screen?.isVisible === 1)
      ?.pathname ?? "/no_access"
  );
};

export const getVisibleMenuItems = (items: any) => {
  return items
    .filter((item: any) => item.isVisible) // Filter items where isVisible is true
    .map((item: any) => ({
      ...item,
      children: item.children ? getVisibleMenuItems(item.children) : undefined, // Recursively filter children
    }))
    .filter(
      (item: any) =>
        item.isVisible || (item.children && item.children.length > 0)
    ); // Keep items with visible children
};
