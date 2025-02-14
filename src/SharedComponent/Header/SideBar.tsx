import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import classes from "./Header.module.css";
import { Images } from "../../Shared/ImageExport";
import { HeaderTabs } from "../../Shared/Constants";
import {
  UpdateSecondaryFilters,
  UpdateTableFilters,
} from "../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../Store/Rudux/Config/Hooks";
import { useEffect, useState } from "react";
import { OrderStatusDropdownService } from "../../Service/ApiMethods";
import toast from "react-hot-toast";
import { getCatchMsg, getPermissionData } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import { AccessPermissionObject } from "../../@Types/accesspermission";
import { getVisibleMenuItems } from "../../Shared/PrivateRouteMethods";

export default function SideBar({ collapsed, setCollapsed }: any) {
  let navigate = useNavigate();
  let { pathname } = useLocation();
  const { Sider } = Layout;
  const token = GetToken();
  const [orderStatusList, setOrderstatusList] = useState([]);
  let dispatch = useAppDispatch();
  const handleClearTableFiletrs = () => {
    dispatch(UpdateTableFilters(null));
    dispatch(UpdateSecondaryFilters(null));
  };
  const permissions: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  const Menuitems = [
    {
      label: "Dashboard",
      key: 1,
      isVisible: permissions?.dashboard?.dashboard_menu,
      extra: <p>aakjs</p>,
      icon: (
        <img
          src={Images.DASHBOARD_ICON}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),
      pathname: "dashboard",
      onClick: () => {
        navigate("/dashboard");
        handleClearTableFiletrs();
      },
    },
    {
      label: "Orders",
      key: 6,
      isVisible: permissions?.orders?.orders_menu,
      icon: (
        <img
          src={Images.ORDER_ICON}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),

      children: [
        {
          label: "All",
          key: 61,
          isVisible: permissions?.orders?.orders_menu,
          pathname: "orders/all",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("orders/all");
          },
        },
        ...orderStatusList,
      ],
    },
    {
      label: "Redemption Requests",
      key: 7,
      isVisible: permissions?.reward_redemption?.reward_redemption_menu,
      icon: (
        <img
          src={Images.POINTS_WHITE_ICON}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),
      pathname: "reward_redemption",
      onClick: () => {
        navigate("/reward_redemption");
        handleClearTableFiletrs();
      },
    },
    {
      label: "Return Requests",
      key: 8,
      isVisible: permissions?.reward_redemption?.reward_redemption_menu,
      icon: (
        <img
          src={Images.ReturnRequestIcon}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),
      pathname: "return_requests",
      onClick: () => {
        navigate("/return_requests");
        handleClearTableFiletrs();
      },
    },
    {
      label: "ContactUs Requests",
      key: 9,
      isVisible: permissions?.reward_redemption?.reward_redemption_menu,
      icon: (
        <img
          src={Images.ContactUsIcon}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),
      pathname: "contactus_requests",
      onClick: () => {
        navigate("/contactus_requests");
        handleClearTableFiletrs();
      },
    },
    {
      label: "Product Masters",
      isVisible: permissions?.product_masters?.product_master_menu,
      key: 2,
      icon: (
        <img
          src={Images.PRODUCT_ICON}
          alt="master"
          className={classes.productIcon}
        />
      ),

      pathname: "product_masters",
      children: [
        {
          label: "Categories",
          key: 21,
          isVisible: permissions?.product_masters?.categories?.categories_menu,
          pathname: "category",
          onClick: () => {
            navigate("product_masters/category");
            handleClearTableFiletrs();
          },
        },
        {
          label: "Product Pricing Name",
          key: 22,
          isVisible:
            permissions?.product_masters?.product_pricing_name
              ?.product_pricing_menu,
          pathname: "product_pricing_name",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("product_masters/product_pricing_name");
          },
        },
        {
          label: "Products",
          key: 23,
          pathname: "products",
          isVisible: permissions?.product_masters?.products?.product_menu,
          onClick: () => {
            handleClearTableFiletrs();
            navigate("product_masters/products");
          },
        },
        {
          label: "Attributes & Groups",
          key: 24,
          isVisible:
            permissions?.product_masters?.attributes_groups
              ?.attributes_group_menu,
          pathname: "attributegroups",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("product_masters/attributegroups");
          },
        },
        {
          label: "Homepage Products",
          key: 25,
          isVisible:
            permissions?.product_masters?.home_page_products
              ?.homepage_product_menu,
          pathname: "homepage_product",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("product_masters/homepage_product");
          },
        },
        {
          label: "Weight",
          key: 26,
          isVisible: permissions?.product_masters?.weight?.weight_menu,
          pathname: "weight",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("product_masters/weight");
          },
        },
      ],
    },
    {
      label: "Manage Masters",
      key: 3,
      isVisible: permissions?.masters?.masters_menu,
      icon: (
        <img
          src={Images.MASTERS_ICON}
          alt="master"
          className={classes.mastersIcon}
        />
      ),
      pathname: "manage_masters",
      children: [
        {
          label: "Brands",
          key: 31,
          isVisible: permissions?.masters?.brands?.brands_menu,
          pathname: "brand",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/brand");
          },
        },
        {
          label: "Vehicle",
          key: 32,
          isVisible: permissions?.masters?.vehicle?.vehicle_menu,
          pathname: "vehicle",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/vehicle");
          },
        },
        {
          label: "Supplier",
          key: 33,
          isVisible: permissions?.masters?.supplier?.supplier_menu,
          pathname: "supplier",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/supplier");
          },
        },
        {
          label: "Tax",
          key: 34,
          isVisible: permissions?.masters?.tax?.tax_menu,
          pathname: "tax",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/tax");
          },
        },
        {
          label: "Order Status",
          key: 35,
          isVisible: permissions?.masters?.order_status?.order_status_menu,
          pathname: "order_status",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/order_status");
          },
        },
        {
          label: "Pin Code",
          key: 36,
          isVisible: permissions?.masters?.pin_code?.pincode_menu,
          pathname: "pincode",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/pincode");
          },
        },

        {
          label: "Points",
          key: 37,
          isVisible: permissions?.masters?.points?.points_menu,
          pathname: "PointSystem",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/PointSystem");
          },
        },
        {
          label: "Testimonials",
          key: 38,
          isVisible: permissions?.masters?.review?.review_menu,
          pathname: "review",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_masters/review");
          },
        },
      ],
    },
    {
      label: "Manage Users",
      key: 4,
      isVisible: permissions?.manage_user?.user_menu,
      icon: (
        <img
          src={Images.USERS_ICON}
          alt="master"
          className={classes.productIcon}
        />
      ),
      pathname: "manage_users",
      children: [
        {
          label: "Admin",
          key: 41,
          isVisible: permissions?.manage_user?.admin?.admin_menu,
          pathname: "admin",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_users/admin");
          },
        },
        {
          label: "Sales Executive",
          key: 42,
          isVisible:
            permissions?.manage_user?.sales_executive?.sales_executive_menu,
          pathname: "sales_engineer",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_users/sales_engineer");
          },
        },
        {
          label: "Engineer",
          key: 43,
          isVisible: permissions?.manage_user?.engineer?.engineer_menu,
          pathname: "engineers",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_users/engineers");
          },
        },
        {
          label: "Customer",
          key: 44,
          isVisible: permissions?.manage_user?.customer?.customer_menu,
          pathname: "customers",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("manage_users/customers");
          },
        },
      ],
    },
    {
      label: "CMS",
      key: 5,
      isVisible: permissions?.cms?.cms_menu,
      icon: (
        <img
          src={Images.CMS_ICON}
          alt="master"
          className={classes.productIcon}
        />
      ),
      pathname: "cms",
      children: [
        {
          label: "Homepage Banners",
          key: 52,
          pathname: "home_banners",
          isVisible: permissions?.cms?.homepage_banners?.homepage_banners_menu,
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/home_banners");
          },
        },
        {
          label: "Homepage Sales Products",
          key: 53,
          isVisible:
            permissions?.cms?.homepage_sales_products
              ?.homepage_sales_products_menu,
          pathname: "homesales_product",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/homesales_product");
          },
        },
        {
          label: "Gallery",
          key: 54,
          isVisible: permissions?.cms?.gallery?.gallery_menu,
          pathname: "gallery",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/gallery");
          },
        },
        {
          label: "Footer Address",
          key: 55,
          isVisible: permissions?.cms?.footer_address?.footer_address_menu,
          pathname: "footer_address",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/footer_address");
          },
        },
        {
          label: "FAQ",
          key: 56,
          isVisible: permissions?.cms?.faq?.faq_menu,
          pathname: "faq",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/faq");
          },
        },

        {
          label: "Customer Support",
          key: 511,
          isVisible: permissions?.cms?.customer_support?.customer_support_menu,
          pathname: "customer_support",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/customer_support");
          },
        },

        {
          label: "Bank Account",
          key: 515,
          isVisible: permissions?.cms?.bank_account?.bank_account_menu,
          pathname: "bank_account",
          onClick: () => {
            handleClearTableFiletrs();
            navigate("cms/bank_account");
          },
        },
      ],
    },
    {
      label: "Settings",
      key: 10,
      isVisible: permissions?.reward_redemption?.reward_redemption_menu,
      icon: (
        <img
          src={Images.ContactUsIcon}
          alt="master"
          className={classes.dashboardIcons}
        />
      ),
      pathname: "settings",
      onClick: () => {
        navigate("/settings");
        handleClearTableFiletrs();
      },
    },
  ];
  const getOrderStatusDropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    OrderStatusDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response?.data?.data?.map(
            (ele: any, index: number) => ({
              label: (
                <div className={classes.OrderStatusTabName}>
                  <p style={{ background: ele?.colour_code }} />
                  {ele.name}
                </div>
              ),
              key: 62 + index,
              isVisible: permissions?.orders?.orders_menu,
              pathname: `/orders/${ele?.id}`,
              onClick: () => {
                handleClearTableFiletrs();
                navigate(`/orders/${ele?.id}`);
              },
            })
          );

          setOrderstatusList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
  };

  useEffect(() => {
    if (token) {
      getOrderStatusDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          background: "var(--COLOR_PRIMARY)",
          minWidth: "250px",
          maxWidth: "250px",
          padding: "5px",
          boxShadow: "0px 2px 5px 2px #a2a2a2bf",
        }}
        className={!collapsed ? "sliderExpand" : "sliderShrink"}
      >
        <div className={classes.stickyLogo}>
          <img
            onClick={() => {
              navigate("/dashboard");
              handleClearTableFiletrs();
            }}
            src={collapsed ? Images.TAB_LOGO : Images.APP_LOGO_WHITE}
            alt="applogo"
            className={collapsed ? classes.collapselogo : classes.applogo}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={getVisibleMenuItems(Menuitems)}
          defaultOpenKeys={[
            ...HeaderTabs,
            ...orderStatusList?.map((ele: any) => ({
              key: ele.key,
              pathname: ele.pathname,
            })),
          ]
            ?.filter((ele: any) => pathname.includes(ele?.pathname))
            ?.map((ele: any) => `${ele?.key}`)}
          selectedKeys={[
            ...HeaderTabs,
            ...orderStatusList?.map((ele: any) => ({
              key: ele.key,
              pathname: ele.pathname,
            })),
          ]
            ?.filter(
              (ele: any) =>
                pathname.includes(ele?.pathname) ||
                pathname.includes(ele?.pathname?.split("/")?.pop())
            )
            ?.map((ele: any) => `${ele?.key}`)}
        />
      </Sider>
    </>
  );
}
