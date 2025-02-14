import AttributesandGroups from "../Screens/Main/ProductMasters/AttributesandGroups";
import HomepageProducts from "../Screens/Main/ProductMasters/HomepageProducts";
import ModifyAttributeGroups from "../Screens/Main/ProductMasters/Modify/ModifyAttributeGroups";
import ModifyHomepageProducts from "../Screens/Main/ProductMasters/Modify/ModifyHomepageProducts";
import ModifyProducts from "../Screens/Main/ProductMasters/Modify/ModifyProducts";
import ViewHomepageProducts from "../Screens/Main/ProductMasters/Modify/ViewHomepageProducts";
import ViewProducts from "../Screens/Main/ProductMasters/Modify/ViewProducts";
import ModifyCategory from "../Screens/Main/ProductMasters/ModifyCategory";
import PricingName from "../Screens/Main/ProductMasters/PricingName";
import ProductImage from "../Screens/Main/ProductMasters/ProductImage";
import Products from "../Screens/Main/ProductMasters/Products";
import Weight from "../Screens/Main/ProductMasters/Weight";
import Category from "../Screens/Main/ProductMasters/Category";
import {
  AttributesPrivateRouter,
  CategoryPrivateRouter,
  HomepageProductPrivateRouter,
  ProductPricingPrivateRouter,
  ProductsPrivateRouter,
  WrightPrivateRouter,
} from "./ScreensPrivateRoute";
export const ProductMastersRoute = [
  // product_masters
  {
    element: <CategoryPrivateRouter />,
    children: [
      {
        path: "product_masters/category",
        element: <Category />,
      },
      {
        path: "product_masters/modify_category",
        element: <ModifyCategory />,
      },
    ],
  },
  {
    element: <ProductPricingPrivateRouter />,
    children: [
      {
        path: "product_masters/product_pricing_name",
        element: <PricingName />,
      },
    ],
  },
  {
    element: <ProductsPrivateRouter />,
    children: [
      {
        path: "product_masters/products",
        element: <Products />,
      },
      {
        path: "product_masters/modify_products",
        element: <ModifyProducts />,
      },
      {
        path: "product_masters/view_products",
        element: <ViewProducts />,
      },
      {
        path: "product_masters/products_images",
        element: <ProductImage />,
      },
    ],
  },
  {
    element: <AttributesPrivateRouter />,
    children: [
      {
        path: "product_masters/attributegroups",
        element: <AttributesandGroups />,
      },
      {
        path: "product_masters/modify_attributegroups",
        element: <ModifyAttributeGroups />,
      },
    ],
  },
  {
    element: <HomepageProductPrivateRouter />,
    children: [
      {
        path: "product_masters/homepage_product",
        element: <HomepageProducts />,
      },
      {
        path: "product_masters/modify_homepage_product",
        element: <ModifyHomepageProducts />,
      },
      {
        path: "product_masters/view_homepage_product",
        element: <ViewHomepageProducts />,
      },
    ],
  },
  {
    element: <WrightPrivateRouter />,
    children: [
      {
        path: "product_masters/weight",
        element: <Weight />,
      },
    ],
  },
];
