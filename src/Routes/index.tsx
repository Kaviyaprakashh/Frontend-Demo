import { AuthPrivateRouter, MainPrivateRouter } from "./PrivateRouter";
import { AuthRoutes } from "./AuthRoutes";
import { MainRoutes } from "./MainRoutes";
import NotFoundScreen from "../Components/ErrorElements/NotFoundScreen";

export const Routes = [
  {
    element: <AuthPrivateRouter />,
    children: AuthRoutes,
    errorElement: <NotFoundScreen />,
  },
  {
    element: <MainPrivateRouter />,
    children: MainRoutes,
    errorElement: <NotFoundScreen />,
  },
];
