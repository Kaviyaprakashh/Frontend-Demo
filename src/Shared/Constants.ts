export const ENCRYPE_DECRYPT_KEY = "Dyn1@91FmQMV821~0F%qw";

export const INPUT_LENGTHS = {
  Name: 150,
  email: 100,
  title: 100,
  header_title: 200,
  productCode: 20,
  Model: 100,
  Price: 10,
  Weight: 10,
  HSN_Code: 8,
  Quantity: 8,
  Tags: 200,
  SEO_URL: 100,
  ImageAlt: 40,
  showDiscription: 250,
  description: 1000,
  metaTitle: 100,
  metaKeywords: 100,
  symbol: 10,
  sortOrder: 3,
  content: 250,
  URL: 100,
  percentage: 5,
  orderBy: 100,
  order: 100,
  phone: 10,
  Fax: 15,
  Landline: 15,
  gstIn: 15,
  PinCode: 6,
  ifsccode: 11,
  pan: 10,
  accountNo: 16,
};

export const REGEX = {
  AlphaNumeric: /^[A-Za-z0-9]+$/,
  FLOAT: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
  SWIFT_CODE: /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/,
  GST_IN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  URL_Regex: /^[A-Za-z0-9:./\ ]+$/,
  IFSC_regex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  NAME_REGEX: /^[A-Za-z ]+$/,
  NUMBER_REGEX: /^[0-9]*$/,
  FAX: /^[0-9 _]+$/,
  SPECIAL_CHARACTER_REGEX: /^[A-Za-z0-9 ,.]+$/,
  MobileNo: /^[6-9]{1}[0-9]{9}$/,
  PASSWORD_REGEX: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  AMOUNT: /^[0-9][0-9]*[.]?[0-9]{0,2}$/,
  PASSWORD: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  PIN_CODE: /^[1-9][0-9]{5}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  SeoUrl: /^[a-z0-9]+$/g,
  Video_url:
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
};
export const PaginationSize = [
  { lable: "10/page", value: 10 },
  { lable: "25/page", value: 25 },
  { lable: "50/page", value: 50 },
  { lable: "100/page", value: 100 },
];

export const ProductType = [
  {
    label: "Single Size",
    value: 1,
  },
  {
    label: "Multiple Size",
    value: 2,
  },
];
export const PricingType = [
  {
    label: "per KG",
    value: 1,
  },
  {
    label: "per Quantity",
    value: 2,
  },
];

export const AddressType = [
  {
    label: "Home",
    value: 1,
  },
  {
    label: "Office",
    value: 2,
  },
];
export const ReturnRequestStatus = [
  {
    value: 1,
    label: "Pending",
  },
  {
    value: 2,
    label: "Refunded",
  },
  {
    value: 3,
    label: "Credit Issued",
  },
  {
    value: 4,
    label: "Replacement Sent",
  },
];

export const ApprovalStatus = [
  {
    value: 1,
    label: "Pending",
    color: "blue",
  },
  {
    value: 2,
    label: "Approved",
    color: "green",
  },
  {
    value: 3,
    label: "Rejected",
    color: "red",
  },
];
export const OrderTypeList = [
  {
    label: "Web",
    value: 1,
  },
  {
    label: "App",
    value: 2,
  },
  {
    label: "Web and App",
    value: 3,
  },
  {
    label: "Executive",
    value: 4,
  },
  {
    label: "Customer",
    value: 5,
  },
];
export const VisitorTypeOptions = [
  { label: "Owner", value: 1 },
  {
    label: "Contracter",
    value: 2,
  },
  {
    label: "Engineer",
    value: 3,
  },
  {
    label: "Mestri",
    value: 4,
  },
  {
    label: "Others",
    value: 5,
  },
];
export const CategoryType = [
  {
    label: "Parent Category",
    value: 1,
  },
  {
    label: "Sub Category",
    value: 2,
  },
];

export const HeaderTabs: any = [
  {
    key: 1,
    pathname: "/dashboard",
  },
  {
    key: 7,
    pathname: "reward_redemption",
  },
  {
    key: 6,
    pathname: "orders",
  },
  {
    key: 61,
    pathname: "/orders/all",
  },
  {
    key: 2,
    pathname: "/product_masters",
  },
  {
    key: 21,
    pathname: "/product_masters/category",
  },
  {
    key: 8,
    pathname: "return_requests",
  },
  {
    key: 9,
    pathname: "contactus_requests",
  },
  {
    key: 22,
    pathname: "/product_masters/product_pricing_name",
  },
  {
    key: 23,
    pathname: "/product_masters/products",
  },
  {
    key: 24,
    pathname: "/product_masters/attributegroups",
  },
  {
    key: 25,
    pathname: "/product_masters/homepage_product",
  },
  {
    key: 26,
    pathname: "/weight",
  },

  {
    key: 3,
    pathname: "manage_masters",
  },
  {
    key: 31,
    pathname: "manage_masters/brand",
  },
  {
    key: 32,
    pathname: "manage_masters/vehicle",
  },
  {
    key: 33,
    pathname: "manage_masters/supplier",
  },
  {
    key: 34,
    pathname: "manage_masters/tax",
  },
  {
    key: 35,
    pathname: "manage_masters/order_status",
  },
  {
    key: 36,
    pathname: "manage_masters/pincode",
  },
  {
    key: 37,
    pathname: "manage_masters/PointSystem",
  },
  {
    pathname: "manage_masters/review",
    key: 38,
  },
  {
    key: 4,
    pathname: "manage_users",
  },
  {
    key: 41,
    pathname: "manage_users/admin",
  },
  {
    key: 42,
    pathname: "manage_users/sales_engineer",
  },
  {
    key: 43,
    pathname: "manage_users/engineers",
  },
  {
    key: 44,
    pathname: "manage_users/customers",
  },
  {
    key: 5,
    pathname: "cms",
  },

  {
    pathname: "cms/home_banners",
    key: 52,
  },
  {
    pathname: "cms/homesales_product",
    key: 53,
  },
  {
    pathname: "cms/gallery",
    key: 54,
  },

  {
    pathname: "cms/footer_address",
    key: 55,
  },
  {
    pathname: "cms/faq",
    key: 56,
  },
  {
    pathname: "cms/customer_support",
    key: 511,
  },
  {
    pathname: "cms/bank_account",
    key: 515,
  },
  {
    pathname: "settings",
    key: 10,
  },
];

export const DateOptions = [
  {
    label: "Today",
    value: 1,
    dateType: "TODAY",
  },
  {
    label: "This Week",
    value: 2,
    dateType: "WEEK",
  },
  {
    label: "This Month",
    value: 3,
    dateType: "MONTH",
  },
  {
    label: "This Year",
    value: 4,
    dateType: "YEAR",
  },
  {
    label: "Custom Date",
    value: 5,
    dateType: "Dates",
  },
];

export const RedemptionRequestStatus = [
  {
    label: "Requested",
    value: 1,
  },
  {
    label: "Approved",
    value: 2,
  },
  {
    label: "Rejected",
    value: 3,
  },
];

export const PaymentStatusOptions = [
  {
    label: "Failed",
    value: 0,
  },
  {
    label: "Success",
    value: 1,
  },
  {
    label: "Processing",
    value: 2,
  },
];

export const DashboardTabAccess = {
  id: 1,
  name: "Dashboard",
  main_menu: "dashboard",
  header_menu: "dashboard_menu",
  permission: [
    {
      id: 1,
      name: "Total Orders",
      key: "total_orders",
    },
    {
      id: 2,
      name: "Executive Orders",
      key: "executive_orders",
    },
    {
      id: 3,
      name: "Customer Orders",
      key: "customer_orders",
    },
    {
      id: 4,
      name: "App Orders",
      key: "app_orders",
    },
    {
      id: 5,
      name: "Web Orders",
      key: "web_orders",
    },
    {
      id: 6,
      name: "Total Customer",
      key: "total_customer",
    },

    {
      id: 7,
      name: "Monthwise Order",
      key: "monthwise_order",
    },
    {
      id: 8,
      name: "Monthwise Order Value",
      key: "monthwise_order_value",
    },
  ],
};
export const OrdersTabAccess = {
  id: 1,
  name: "Orders",
  main_menu: "orders",
  header_menu: "orders_menu",
  permission: [
    [
      {
        id: 1,
        name: "Change Status",
        key: "change_status",
      },
      {
        id: 2,
        name: "Change Return Action",
        key: "return_action_edit",
      },
      {},
      {},
    ],
    [
      {
        id: 2,
        name: "View",
        key: "view",
        is_menu: true,
      },
      {
        id: 3,
        name: "Edit Weight",
        key: "edit_weight",
      },
      {
        id: 4,
        name: "Edit Shipping Price",
        key: "edit_shipping_price",
      },
      {
        id: 5,
        name: "Invoice Download",
        key: "invoice_download",
      },
    ],
  ],
};
export const RewardTabAccess = {
  id: 1,
  name: "Reward Redemption",
  main_menu: "reward_redemption",
  header_menu: "reward_redemption_menu",
  permission: [
    {
      id: 1,
      name: "Change Status",
      key: "change_status",
    },
  ],
};
export const ReturnRequestTabTabAccess = {
  id: 1,
  name: "Return Request",
  main_menu: "return_request",
  header_menu: "return_request_menu",
  permission: [
    {
      id: 1,
      name: "Change Approval Status",
      key: "return_request_edit",
    },
    {
      id: 2,
      name: "Change Return Action",
      key: "return_action_edit",
    },
  ],
};
export const ContactUsTabTabAccess = {
  id: 1,
  name: "Contact Us Request",
  main_menu: "contact_us",
  header_menu: "contact_us_menu",
};

export const ProductMastersTabAccess = {
  id: 1,
  name: "Product Master",
  main_menu: "product_masters",
  header_menu: "product_master_menu",
  SubTabs: [
    {
      id: 1,
      name: "Categories",
      main_menu: "categories",
      header_menu: "categories_menu",
      permission: [
        {
          id: 1,
          name: "Categories",
          key: "categories_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 2,
      name: "Product",
      main_menu: "products",
      header_menu: "product_menu",

      permission: [
        {
          id: 1,
          name: "Product",
          key: "product_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
      submenu: [
        {
          id: 1,
          name: "Gallery",
          main_menu: "gallery_crud_action",
          header_menu: "gallery_image_menu",
          permission: [
            {
              id: 1,
              name: "Gallery",
              key: "gallery_image_menu",
              is_menu: true,
            },

            {
              id: 2,

              name: "Add",
              key: "add",
            },
            {
              id: 3,

              name: "Edit",
              key: "edit",
            },
            {
              id: 4,
              name: "Delete",
              key: "delete",
            },
            {},
            {},
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Product Pricing",
      main_menu: "product_pricing_name",
      header_menu: "product_pricing_menu",
      permission: [
        {
          id: 1,
          name: "Product Pricing",
          key: "product_pricing_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },

    {
      id: 4,
      name: "Attributes And Groups",
      main_menu: "attributes_groups",
      header_menu: "attributes_group_menu",

      permission: [
        {
          id: 1,
          name: "Attributes And Groups",
          key: "attributes_group_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 5,
      name: "Homepage Product",
      main_menu: "home_page_products",
      header_menu: "homepage_product_menu",
      permission: [
        {
          id: 1,
          name: "Homepage Product",
          key: "homepage_product_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 6,
      name: "Weight",
      main_menu: "weight",
      header_menu: "weight_menu",
      permission: [
        {
          id: 1,
          name: "Weight",
          key: "weight_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
  ],
};

export const MastersTabAccess = {
  id: 1,
  name: "Manage Masters",
  main_menu: "masters",
  header_menu: "masters_menu",
  SubTabs: [
    {
      id: 1,
      name: "Brands",
      main_menu: "brands",
      header_menu: "brands_menu",
      permission: [
        {
          id: 1,
          name: "Brands",
          key: "brands_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
    {
      id: 2,
      name: "Vehicle",
      main_menu: "vehicle",
      header_menu: "vehicle_menu",
      permission: [
        {
          id: 1,
          name: "Vehicle",
          key: "vehicle_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
    {
      id: 3,
      name: "Supplier",
      main_menu: "supplier",
      header_menu: "supplier_menu",
      permission: [
        {
          id: 1,
          name: "Supplier",
          key: "supplier_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
    {
      id: 4,
      name: "Tax",
      main_menu: "tax",
      header_menu: "tax_menu",
      permission: [
        {
          id: 1,
          name: "Tax",
          key: "tax_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 5,
      name: "Order Status",
      main_menu: "order_status",
      header_menu: "order_status_menu",
      permission: [
        {
          id: 1,
          name: "Order Status",
          key: "order_status_menu",
          is_menu: true,
        },

        // {
        //   id: 2,
        //   name: "Add",
        //   key: "add",
        // },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        // {
        //   id: 4,
        //   name: "Delete",
        //   key: "delete",
        // },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
        {},
        {},
      ],
    },
    {
      id: 6,
      name: "Pin Code",
      main_menu: "pin_code",
      header_menu: "pincode_menu",
      permission: [
        {
          id: 1,
          name: "Pin Code",
          key: "pincode_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
    {
      id: 7,
      name: "Points",
      main_menu: "points",
      header_menu: "points_menu",
      permission: [
        {
          id: 1,
          name: "Points",
          key: "points_menu",
          is_menu: true,
        },

        // {
        //   id: 2,
        //   name: "Add",
        //   key: "add",
        // },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        // {
        //   id: 4,
        //   name: "Delete",
        //   key: "delete",
        // },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        // {
        //   id: 6,
        //   name: "Change Status",
        //   key: "change_status",
        // },
        {},
        {},
        {},
        {},
      ],
    },
    {
      id: 8,
      name: "Testimonials",
      main_menu: "review",
      header_menu: "review_menu",
      permission: [
        {
          id: 1,
          name: "Testimonials",
          key: "review_menu",
          is_menu: true,
        },

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
  ],
};
export const UserTabAccess = {
  id: 1,
  name: "User",
  main_menu: "manage_user",
  header_menu: "user_menu",
  SubTabs: [
    {
      id: 1,
      name: "Admin",
      main_menu: "admin",
      header_menu: "admin_menu",
      permission: [
        {
          id: 1,
          name: "Admin",
          key: "admin_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },

        {
          id: 8,
          name: "Change Password",
          key: "change_Password",
        },
        {},
        {},
      ],
    },
    {
      id: 2,
      name: "Sales Executive",
      main_menu: "sales_executive",
      header_menu: "sales_executive_menu",
      permission: [
        {
          id: 1,
          name: "Sales Executive",
          key: "sales_executive_menu",
          is_menu: true,
        },
        {},

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },

        {
          id: 8,
          name: "Change Password",
          key: "change_Password",
        },
        { id: 9, name: "Site Visit", key: "site_visit_view" },
        { id: 10, name: "Follow Ups", key: "follow_up_view" },
      ],
      submenu: [
        {
          id: 1,
          name: "Order History",
          main_menu: "order_history",
          header_menu: "order_history_menu",
          permission: [
            {
              id: 1,
              name: "Order History",
              key: "order_history_menu",
              is_menu: true,
            },

            {
              id: 2,
              name: "View",
              key: "view",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Engineer",
      main_menu: "engineer",
      header_menu: "engineer_menu",
      permission: [
        {
          id: 1,
          name: "Engineer",
          key: "engineer_menu",
          is_menu: true,
        },
        {},

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },

        {
          id: 8,
          name: "Change Password",
          key: "change_Password",
        },
        {
          id: 9,
          name: "Point History",
          key: "point_history",
        },
        {},
      ],
      submenu: [
        {
          id: 1,
          name: "Order History",
          main_menu: "order_history",
          header_menu: "order_history_menu",
          permission: [
            {
              id: 1,
              name: "Order History",
              key: "order_history_menu",
              is_menu: true,
            },

            {
              id: 2,
              name: "View",
              key: "view",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Customer",
      main_menu: "customer",
      header_menu: "customer_menu",
      permission: [
        {
          id: 1,
          name: "Customer",
          key: "customer_menu",
          is_menu: true,
        },
        {},

        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {
          id: 7,
          name: "Change Designation",
          key: "change_designation",
        },
        {
          id: 8,
          name: "Change Password",
          key: "change_Password",
        },
        {
          id: 9,
          name: "Point History",
          key: "point_history",
        },
      ],
      submenu: [
        {
          id: 1,
          name: "Order History",
          main_menu: "order_history",
          header_menu: "order_history_menu",
          permission: [
            {
              id: 1,
              name: "Order History",
              key: "order_history_menu",
              is_menu: true,
            },

            {
              id: 2,
              name: "View",
              key: "view",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
      ],
    },
  ],
};
export const CMSTabAccess = {
  id: 1,
  name: "CMS",
  main_menu: "cms",
  header_menu: "cms_menu",
  SubTabs: [
    {
      id: 1,
      name: "Homepage Banners",
      main_menu: "homepage_banners",
      header_menu: "homepage_banners_menu",
      permission: [
        {
          id: 1,
          name: "Homepage Banners",
          key: "homepage_banners_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 2,
      name: "Homepage Sales Products",
      main_menu: "homepage_sales_products",
      header_menu: "homepage_sales_products_menu",
      permission: [
        {
          id: 1,
          name: "Homepage Sales Products",
          key: "homepage_sales_products_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
    },
    {
      id: 3,
      name: "Gallery",
      main_menu: "gallery",
      header_menu: "gallery_menu",

      permission: [
        {
          id: 1,
          name: "Gallery",
          key: "gallery_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        {
          id: 5,
          name: "View",
          key: "view",
        },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
      ],
      submenu: [
        {
          id: 1,
          name: "Gallery Images",
          main_menu: "gallery_image",
          header_menu: "gallery_image_menu",
          permission: [
            {
              id: 1,
              name: "Gallery Images",
              key: "gallery_image_menu",
              is_menu: true,
            },

            {
              id: 2,
              name: "Add",
              key: "add",
            },
            {
              id: 3,
              name: "Edit",
              key: "edit",
            },
            {
              id: 4,
              name: "Delete",
              key: "delete",
            },
            {
              id: 5,
              name: "View",
              key: "view",
            },
            {},
            // {
            //   id: 6,
            //   name: "Change Status",
            //   key: "change_status",
            // },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Footer Address",
      main_menu: "footer_address",
      header_menu: "footer_address_menu",
      permission: [
        {
          id: 1,
          name: "Footer Address",
          key: "footer_address_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },

    {
      id: 5,
      name: "FAQ",
      main_menu: "faq",
      header_menu: "faq_menu",
      permission: [
        {
          id: 1,
          name: "FAQ",
          key: "faq_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Add",
          key: "add",
        },
        {
          id: 3,
          name: "Edit",
          key: "edit",
        },
        {
          id: 4,
          name: "Delete",
          key: "delete",
        },
        // {
        //   id: 5,
        //   name: "View",
        //   key: "view",
        // },
        {
          id: 6,
          name: "Change Status",
          key: "change_status",
        },
        {},
      ],
    },
    {
      id: 5,
      name: "Customer Support",
      main_menu: "customer_support",
      header_menu: "customer_support_menu",
      permission: [
        {
          id: 1,
          name: "Customer Support",
          key: "customer_support_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Edit Support Number",
          key: "edit_support_number",
        },
        {},
        {},
        {},
        {},
      ],
    },
    {
      id: 6,
      name: "Bank Account",
      main_menu: "bank_account",
      header_menu: "bank_account_menu",
      permission: [
        {
          id: 1,
          name: "Bank Account",
          key: "bank_account_menu",
          is_menu: true,
        },
        {},
        {
          id: 2,
          name: "Edit Bank Account",
          key: "edit_bank_account",
        },
        {},
        {},
        {},
        {},
      ],
    },
  ],
};

export const PerMissionData = {
  dashboard: {
    dashboard_menu: 0,
    total_orders: 0,
    executive_orders: 0,
    customer_orders: 0,
    app_orders: 0,
    web_orders: 0,
    total_customer: 0,
    monthwise_order: 0,
    monthwise_order_value: 0,
  },
  return_request: {
    return_request_menu: 0,
    return_request_edit: 0,
    return_action_edit: 0,
  },
  contact_us: {
    contact_us_menu: 0,
  },
  reward_redemption: {
    reward_redemption_menu: 0,
    change_status: 0,
  },
  orders: {
    orders_menu: 0,
    change_status: 0,
    view: 0,
    edit_weight: 0,
    edit_shipping_price: 0,
    invoice_download: 0,
    return_action_edit: 0,
  },
  product_masters: {
    product_master_menu: 0,
    categories: {
      categories_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    products: {
      product_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      gallery_crud_action: {
        gallery_image_menu: 0,
        add: 0,
        edit: 0,
        delete: 0,
      },
    },
    product_pricing_name: {
      product_pricing_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    attributes_groups: {
      attributes_group_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    home_page_products: {
      homepage_product_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    weight: {
      weight_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
  },
  masters: {
    masters_menu: 0,
    brands: {
      brands_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    vehicle: {
      vehicle_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    supplier: {
      supplier_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    tax: {
      tax_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    order_status: {
      order_status_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    pin_code: {
      pincode_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    points: {
      points_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    review: {
      review_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
  },
  manage_user: {
    user_menu: 0,
    admin: {
      admin_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      change_designation: 0,
      change_Password: 0,
    },
    sales_executive: {
      sales_executive_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      change_designation: 0,
      change_Password: 0,
      site_visit_view: 0,
      follow_ups_view: 0,

      order_history: {
        order_history_menu: 0,
        view: 0,
      },
    },
    engineer: {
      engineer_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      change_designation: 0,
      change_Password: 0,
      point_history: 0,
      order_history: {
        order_history_menu: 0,
        view: 0,
      },
    },
    customer: {
      customer_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      change_designation: 0,
      change_Password: 0,
      point_history: 0,
      order_history: {
        order_history_menu: 0,
        view: 0,
      },
    },
  },
  cms: {
    cms_menu: 0,
    homepage_banners: {
      homepage_banners_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    homepage_sales_products: {
      homepage_sales_products_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    gallery: {
      gallery_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
      gallery_image: {
        gallery_image_menu: 0,
        add: 0,
        edit: 0,
        delete: 0,
        view: 0,
        change_status: 0,
      },
    },
    footer_address: {
      footer_address_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    faq: {
      faq_menu: 0,
      add: 0,
      edit: 0,
      delete: 0,
      view: 0,
      change_status: 0,
    },
    customer_support: {
      customer_support_menu: 0,
      edit_support_number: 0,
    },
    bank_account: {
      bank_account_menu: 0,
      edit_bank_account: 0,
    },
  },
};
