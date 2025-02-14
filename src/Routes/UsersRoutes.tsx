import AccessPermission from "../Screens/Main/ManageUsers/AccessPermission";
import FollowUps from "../Screens/Main/ManageUsers/FollowUps";
import ModifyUser from "../Screens/Main/ManageUsers/ModifyUser";
import PointHistory from "../Screens/Main/ManageUsers/PointHistory";
import SiteVisitList from "../Screens/Main/ManageUsers/SiteVisitList";
import User from "../Screens/Main/ManageUsers/User";
import ViewOrderHistory from "../Screens/Main/ManageUsers/ViewOrderHistory";
import ViewUser from "../Screens/Main/ManageUsers/ViewUser";
import ViewOrders from "../Screens/Main/Orders/ViewOrders";
import {
  AdminPrivateRouter,
  CustomerPrivateRouter,
  EngineerPrivateRouter,
  SalesExecutivePrivateRouter,
} from "./ScreensPrivateRoute";

export const UsersRoutes = [
  {
    element: <AdminPrivateRouter />,
    children: [
      {
        path: "manage_users/admin",
        element: <User />,
      },
      {
        path: "manage_users/modify_admin",
        element: <ModifyUser />,
      },
      {
        path: "manage_users/view_admin",
        element: <ViewUser />,
      },
      {
        path: "manage_users/orderhistory_admin",
        element: <ViewOrderHistory />,
      },
      {
        path: "manage_users/point_history_admin",
        element: <PointHistory />,
      },
      {
        path: "manage_users/accesspermission_admin",
        element: <AccessPermission />,
      },
    ],
  },
  {
    element: <SalesExecutivePrivateRouter />,
    children: [
      {
        path: "manage_users/sales_engineer",
        element: <User />,
      },
      {
        path: "manage_users/modify_sales_engineer",
        element: <ModifyUser />,
      },
      {
        path: "manage_users/view_sales_engineer",
        element: <ViewUser />,
      },
      {
        path: "manage_users/orderhistory_sales_engineer",
        element: <ViewOrderHistory />,
      },
      {
        path: "manage_users/point_history_sales_engineer",
        element: <PointHistory />,
      },
      {
        path: "manage_users/accesspermission_sales_engineer",
        element: <AccessPermission />,
      },
      {
        path: "manage_users/site_visit",
        element: <SiteVisitList />,
      },
      {
        path: "manage_users/followups",
        element: <FollowUps />,
      },
    ],
  },
  {
    element: <EngineerPrivateRouter />,
    children: [
      {
        path: "manage_users/engineers",
        element: <User />,
      },
      {
        path: "manage_users/modify_engineers",
        element: <ModifyUser />,
      },
      {
        path: "manage_users/view_engineers",
        element: <ViewUser />,
      },
      {
        path: "manage_users/orderhistory_engineers",
        element: <ViewOrderHistory />,
      },
      {
        path: "manage_users/point_history_engineers",
        element: <PointHistory />,
      },
      {
        path: "manage_users/accesspermission_engineers",
        element: <AccessPermission />,
      },
    ],
  },
  {
    element: <CustomerPrivateRouter />,
    children: [
      {
        path: "manage_users/customers",
        element: <User />,
      },
      {
        path: "manage_users/modify_customers",
        element: <ModifyUser />,
      },
      {
        path: "manage_users/view_customers",
        element: <ViewUser />,
      },
      {
        path: "manage_users/orderhistory_customers",
        element: <ViewOrderHistory />,
      },
      {
        path: "manage_users/point_history_customers",
        element: <PointHistory />,
      },
      {
        path: "manage_users/accesspermission_customers",
        element: <AccessPermission />,
      },
      { path: "/view_order/:from_path?", element: <ViewOrders /> },
    ],
  },
];
