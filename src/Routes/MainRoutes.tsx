import MainLayout from "../Layouts/MainLayout";
import Dashboard from "../Screens/Main/Dashboard";
import Orders from "../Screens/Main/Orders/Orders";
import ViewOrders from "../Screens/Main/Orders/ViewOrders";
import { ProductMastersRoute } from "./ProductMastersRoute";
import {
  CMSPrivateRouter,
  MastersPrivateRouter,
  ProductMasterPrivateRouter,
  UsersPrivateRouter,
} from "./PrivateRouter";
import { MastersRoutes } from "./MastersRoutes";
import { UsersRoutes } from "./UsersRoutes";
import { CMSRoutes } from "./CMSRoutes";
import RewardRedemptionRequest from "../Screens/Main/RewardRedemptionRequest";
import {
  ConatactUsRequestPrivateRouter,
  DashboardPrivateRouter,
  NotificationMenuPrivateRouter,
  OrdersPrivateRouter,
  ReturnRequestPrivateRouter,
  RewardRedemptionPrivateRouter,
} from "./ScreensPrivateRoute";
import DeniedAccessPermissionScreen from "../Components/ErrorElements/DeniedAccessScreen";
import ReturnRequests from "../Screens/Main/ReturnRequests";
import ContactUsRequests from "../Screens/Main/ContactUsRequests";
import PaymentAmount from "../Screens/Main/CMS/PaymentAmount";
import NotificationList from "../Screens/Main/NotificationList";

export const MainRoutes = [
  {
    element: <MainLayout />,
    children: [
      {
        element: <DashboardPrivateRouter />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
      {
        element: <OrdersPrivateRouter />,
        children: [
          { path: "/orders/:status_id?", element: <Orders /> },
          // For Highligh Tab In Side Bar
          { path: "/view_orders/:from_path?", element: <ViewOrders /> },
        ],
      },

      {
        element: <ProductMasterPrivateRouter />,
        children: ProductMastersRoute,
      },

      {
        element: <MastersPrivateRouter />,
        children: MastersRoutes,
      },
      {
        element: <UsersPrivateRouter />,
        children: UsersRoutes,
      },

      {
        element: <CMSPrivateRouter />,
        children: CMSRoutes,
      },
      {
        element: <RewardRedemptionPrivateRouter />,
        children: [
          { path: "reward_redemption", element: <RewardRedemptionRequest /> },
        ],
      },
      {
        element: <RewardRedemptionPrivateRouter />,
        children: [{ path: "return_requests", element: <ReturnRequests /> }],
      },
      {
        path: "/no_access",
        element: <DeniedAccessPermissionScreen />,
      },
      {
        element: <ReturnRequestPrivateRouter />,
        children: [{ path: "return_requests", element: <ReturnRequests /> }],
      },
      {
        element: <ConatactUsRequestPrivateRouter />,
        children: [
          { path: "contactus_requests", element: <ContactUsRequests /> },
        ],
      },
      {
        element: <ReturnRequestPrivateRouter />,
        children: [{ path: "settings", element: <PaymentAmount /> }],
      },
      {
        element: <NotificationMenuPrivateRouter />,
        children: [{ path: "notification", element: <NotificationList /> }],
      },
    ],
  },
];
