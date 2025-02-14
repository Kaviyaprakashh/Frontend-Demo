import BankAccount from "../Screens/Main/CMS/BankAccount";
import CustomerSupport from "../Screens/Main/CMS/CustomerSupport";
import Faq from "../Screens/Main/CMS/Faq";
import FooterAddress from "../Screens/Main/CMS/FooterAddress";
import Gallery from "../Screens/Main/CMS/Gallery";
import HomeBanners from "../Screens/Main/CMS/HomeBanners";
import HomeSalesProducts from "../Screens/Main/CMS/HomeSalesProducts";
import ModifyFaq from "../Screens/Main/CMS/Modify/ModifyFaq";
import ModifyFooterAddress from "../Screens/Main/CMS/Modify/ModifyFooterAddress";
import ModifyGalary from "../Screens/Main/CMS/Modify/ModifyGalary";
import ModifyGalleryImage from "../Screens/Main/CMS/Modify/ModifyGalleryImage";
import ModifyhomeBanners from "../Screens/Main/CMS/Modify/ModifyhomeBanners";
import ModifyHomeSalesProducts from "../Screens/Main/CMS/Modify/ModifyHomeSalesProducts";
import ViewGallery from "../Screens/Main/CMS/ViewGallery";
import {
  BankAccountPrivateRouter,
  BannersPrivateRouter,
  CustomerSupportPrivateRouter,
  FaqPrivateRouter,
  FooterAddressPrivateRouter,
  GalleryPrivateRouter,
  HomeSalesProductPrivateRouter,
} from "./ScreensPrivateRoute";

export const CMSRoutes = [
  // CMS
  {
    element: <BannersPrivateRouter />,
    children: [
      {
        path: "cms/home_banners",
        element: <HomeBanners />,
      },
      {
        path: "cms/modify_home_banners",
        element: <ModifyhomeBanners />,
      },
    ],
  },
  {
    element: <HomeSalesProductPrivateRouter />,
    children: [
      {
        path: "cms/modify_homesales_product",
        element: <ModifyHomeSalesProducts />,
      },
      {
        path: "cms/homesales_product",
        element: <HomeSalesProducts />,
      },
    ],
  },
  {
    element: <GalleryPrivateRouter />,
    children: [
      {
        path: "cms/gallery",
        element: <Gallery />,
      },
      {
        path: "cms/modify_gallery",
        element: <ModifyGalary />,
      },
      {
        path: "cms/modify_gallery_images",
        element: <ModifyGalleryImage />,
      },
      {
        path: "cms/view_gallery",
        element: <ViewGallery />,
      },
    ],
  },
  {
    element: <FooterAddressPrivateRouter />,
    children: [
      {
        path: "cms/footer_address",
        element: <FooterAddress />,
      },
      {
        path: "cms/modify_footer_address",
        element: <ModifyFooterAddress />,
      },
    ],
  },
  {
    element: <FaqPrivateRouter />,
    children: [
      {
        path: "cms/faq",
        element: <Faq />,
      },
      {
        path: "cms/modify_faq",
        element: <ModifyFaq />,
      },
    ],
  },
  {
    element: <CustomerSupportPrivateRouter />,
    children: [
      {
        path: "cms/customer_support",
        element: <CustomerSupport />,
      },
    ],
  },
  {
    element: <BankAccountPrivateRouter />,
    children: [
      {
        path: "cms/bank_account",
        element: <BankAccount />,
      },
    ],
  },
];
