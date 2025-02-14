import Brands from "../Screens/Main/ManageMasters/Brands";
import ModifyBrand from "../Screens/Main/ManageMasters/Modify/ModifyBrand";
import ModifyReview from "../Screens/Main/ManageMasters/Modify/ModifyReview";
import ModifySupplier from "../Screens/Main/ManageMasters/Modify/ModifySupplier";
import ModifyTax from "../Screens/Main/ManageMasters/Modify/ModifyTax";
import ModifyVehicle from "../Screens/Main/ManageMasters/Modify/ModifyVehicle";
import OrderStatus from "../Screens/Main/ManageMasters/OrderStatus";
import Pincode from "../Screens/Main/ManageMasters/Pincode";
import Reviews from "../Screens/Main/ManageMasters/Reviews";
import Supplier from "../Screens/Main/ManageMasters/Supplier";
import Tax from "../Screens/Main/ManageMasters/Tax";
import Vehicle from "../Screens/Main/ManageMasters/Vehicle";
import PointSystem from "../Screens/Main/ProductMasters/PointSystem";
import {
  BrandPrivateRouter,
  OrderStatusPrivateRouter,
  PinCodePrivateRouter,
  PointSystemPrivateRouter,
  ReviewPrivateRouter,
  SupplierPrivateRouter,
  TaxPrivateRouter,
  VehiclePrivateRouter,
} from "./ScreensPrivateRoute";

export const MastersRoutes = [
  {
    element: <BrandPrivateRouter />,
    children: [
      {
        path: "manage_masters/brand",
        element: <Brands />,
      },
      {
        path: "manage_masters/modify_brand",
        element: <ModifyBrand />,
      },
    ],
  },
  {
    element: <VehiclePrivateRouter />,
    children: [
      {
        path: "manage_masters/vehicle",
        element: <Vehicle />,
      },
      {
        path: "manage_masters/modify_vehicle",
        element: <ModifyVehicle />,
      },
    ],
  },
  {
    element: <SupplierPrivateRouter />,
    children: [
      {
        path: "manage_masters/supplier",
        element: <Supplier />,
      },
      {
        path: "manage_masters/modify_supplier",
        element: <ModifySupplier />,
      },
    ],
  },
  {
    element: <TaxPrivateRouter />,
    children: [
      {
        path: "manage_masters/tax",
        element: <Tax />,
      },
      {
        path: "manage_masters/modify_tax",
        element: <ModifyTax />,
      },
    ],
  },
  {
    element: <OrderStatusPrivateRouter />,
    children: [
      {
        path: "manage_masters/order_status",
        element: <OrderStatus />,
      },
    ],
  },
  {
    element: <PinCodePrivateRouter />,
    children: [
      {
        path: "manage_masters/pincode",
        element: <Pincode />,
      },
    ],
  },
  {
    element: <PointSystemPrivateRouter />,
    children: [
      {
        path: "manage_masters/PointSystem",
        element: <PointSystem />,
      },
    ],
  },
  {
    element: <ReviewPrivateRouter />,
    children: [
      {
        path: "manage_masters/review",
        element: <Reviews />,
      },
      {
        path: "manage_masters/modify_review",
        element: <ModifyReview />,
      },
    ],
  },
];
