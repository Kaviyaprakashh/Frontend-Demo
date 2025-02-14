import { ObjectType } from "../Shared/Methods";
import axios from "./Axios";

export const UserLoginService = (data: FormData) => {
  return axios.post("/login", data);
};
export const UserLogOutService = (data: FormData) => {
  return axios.post("/logout", data);
};
// Dashboard
export const dashboardService = (data: FormData) => {
  return axios.post("/allDataCount", data);
};
export const MonthwiseOrderService = (data: FormData) => {
  return axios.post("/monthWiseOrdersData", data);
};
export const MonthwiseOrderValueService = (data: FormData) => {
  return axios.post("/monthWiseOrdersValueData", data);
};

export const CheckCaptchaService = (data: FormData) => {
  return axios.post("/captcha_check", data);
};

// CATEGORY

export const CreateCategoryService = (data: FormData) => {
  return axios.post("/master/addCategory", data);
};

export const UpdateCategoryService = (data: FormData) => {
  return axios.post("/master/editCategory", data);
};

export const ChangeStatusCategoryService = (data: FormData) => {
  return axios.post("/master/changeCategoryStatus", data);
};

export const ListCategoryService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listCategory?page=${page}&size=${size}`, data);
};

// Pricing Name

export const CreateProductPricingNameService = (data: FormData) => {
  return axios.post("/master/addPricingClassName", data);
};

export const UpdateProductPricingNameService = (data: FormData) => {
  return axios.post("/master/editPricingClassName", data);
};

export const UpdateProductPricingStatusService = (data: FormData) => {
  return axios.post("/master/changePricingStatus", data);
};

export const ListProductPricingNameService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/master/listPricingClassName?page=${page}&size=${size}`,
    data
  );
};

// Attributes & GRoups

export const CreateAttrubuteGroupsService = (data: any) => {
  return axios.post("/master/addAttribute", data);
};

export const UpdateAttrubuteGroupsService = (data: any) => {
  return axios.post("/master/editAttribute", data);
};

export const UpdateAttrubuteGroupStatusService = (data: any) => {
  return axios.post("/master/changeAttributeStatus", data);
};

export const RemoveAttrubuteService = (data: any) => {
  return axios.post("/master/removeAttribute", data);
};

export const ListAttrubuteGroupsService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/master/listAttributeGroup?page=${page}&size=${size}`,
    data
  );
};

// TAX
export const CreateTaxService = (data: any) => {
  return axios.post("/master/addTaxClass", data);
};

export const UpdateTaxService = (data: any) => {
  return axios.post("/master/editTaxClass", data);
};
export const UpdateTaxStatusService = (data: any) => {
  return axios.post("/master/deleteTaxClass", data);
};

export const ListTaxService = (page: number, size: number, data: FormData) => {
  return axios.post(`/master/listTaxClass?page=${page}&size=${size}`, data);
};

// Brands

export const CreateBrandService = (data: FormData) => {
  return axios.post("/master/addBrand", data);
};

export const UpdateBrandService = (data: FormData) => {
  return axios.post("/master/editBrand", data);
};

export const ChangeStatusBrandService = (data: FormData) => {
  return axios.post("/master/changeBrandStatus", data);
};

export const ListBrandService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listBrand?page=${page}&size=${size}`, data);
};

// VEHICLE

export const CreateVehicleService = (data: FormData) => {
  return axios.post("/master/addVehicle", data);
};

export const UpdateVehicleService = (data: FormData) => {
  return axios.post("/master/editVehicle", data);
};

export const ChangeStatusVehicleService = (data: FormData) => {
  return axios.post("/master/changeVehicleStatus", data);
};

export const ListVehicleService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listVehicle?page=${page}&size=${size}`, data);
};

// POINT

// export const CreatePointService = (data: FormData) => {
//   return axios.post("/master/addPointMaster", data);
// };

// export const UpdatePointService = (data: FormData) => {
//   return axios.post("/master/editPointMaster", data);
// };

// export const ChangeStatusPointService = (data: FormData) => {
//   return axios.post("/master/changePointMasterStatus", data);
// };

// export const ListPointService = (
//   page: number,
//   size: number,
//   data: FormData
// ) => {
//   return axios.post(`/master/listPointMaster?page=${page}&size=${size}`, data);
// };

// SUPPLIER

export const CreateSupplierService = (data: FormData) => {
  return axios.post("/master/addSupplier", data);
};

export const UpdateSupplierService = (data: FormData) => {
  return axios.post("/master/editSupplier", data);
};

export const ChangeStatusSupplierService = (data: FormData) => {
  return axios.post("/master/changeSupplierStatus", data);
};

export const ListSupplierService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listSupplier?page=${page}&size=${size}`, data);
};

// Products

export const CreateProductsService = (data: FormData) => {
  return axios.post("/products/addProduct", data);
};

export const UpdateProductsService = (data: FormData) => {
  return axios.post("/products/editProduct", data);
};

export const DeleteProductsService = (data: FormData) => {
  return axios.post("/products/deleteProduct", data);
};
export const ChangeProductStatusService = (data: FormData) => {
  return axios.post("/products/changeProductStatus", data);
};

export const ListProductsService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/products/listProducts?page=${page}&size=${size}`, data);
};

export const ViewProductsService = (data: FormData) => {
  return axios.post("/products/ViewProducts", data);
};
// Product Vehicle
export const DeleteProductVehicleService = (data: FormData) => {
  return axios.post("/products/deleteProductAttribute", data);
};

// Product Attribute

export const DeleteProductAttributeService = (data: FormData) => {
  return axios.post("/products/deleteProductAttribute", data);
};

export const DeleteProductPriceClassService = (data: FormData) => {
  return axios.post("/master/deleteProductPricing", data);
};

// Product Images

export const CreateProductImagesService = (data: FormData) => {
  return axios.post("/products/addProductImage", data);
};

export const UpdateProductImagesService = (data: FormData) => {
  return axios.post("/products/editProductImage", data);
};

export const DeleteProductImagesService = (data: FormData) => {
  return axios.post("/products/deleteProductImage", data);
};

// HOMEPAGE PRoducts

export const ViewHomepageProductsService = (data: any) => {
  return axios.post("/master/viewHomepageProducts", data);
};

export const CreateHomepageProductsService = (data: any) => {
  return axios.post("/master/addHomePageProducts", data);
};

export const UpdateHomepageProductsService = (data: any) => {
  return axios.post("/master/updateHomePageProducts", data);
};

export const ChangeStatusHomepageProductService = (data: any) => {
  return axios.post("/master/changeHomepageProductsStatus", data);
};

export const RemoveHomepageMappedProductService = (data: any) => {
  return axios.post("/master/deleteHomepageMapProducts", data);
};
export const ListHomepageProductsService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/master/listHomePageProducts?page=${page}&size=${size}`,
    data
  );
};

// Currency

export const CreateCurrencyService = (data: FormData) => {
  return axios.post("/master/addCurrency", data);
};

export const UpdateCurrencyService = (data: FormData) => {
  return axios.post("/master/editCurrency", data);
};

export const ChangeStatusCurrencyService = (data: FormData) => {
  return axios.post("/master/changeCurrencyStatus", data);
};

export const ListCurrencyService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listCurrency?page=${page}&size=${size}`, data);
};

// Weight

export const CreateWeightService = (data: FormData) => {
  return axios.post("/master/addWeightMeasure", data);
};

export const UpdateWeightService = (data: FormData) => {
  return axios.post("/master/editWeightMeasure", data);
};

export const ChangeStatusWeightService = (data: FormData) => {
  return axios.post("/master/changeWeightMeasureStatus", data);
};

export const ListWeightService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/master/listWeightMeasure?page=${page}&size=${size}`,
    data
  );
};

// PIN CODE
export const CreatePinCodeService = (data: FormData) => {
  return axios.post("/master/addPincode", data);
};

export const UpdatePinCodeService = (data: FormData) => {
  return axios.post("/master/editPincode", data);
};

export const ChangeStatusPinCodeService = (data: FormData) => {
  return axios.post("/master/changePinCodeStatus", data);
};

export const ListPinCodeService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listPincode?page=${page}&size=${size}`, data);
};

// Couriers

export const CreateCouriersService = (data: FormData) => {
  return axios.post("/master/addCouriers", data);
};

export const UpdateCouriersService = (data: FormData) => {
  return axios.post("/master/editCourier", data);
};

export const ChangeStatusCouriersService = (data: FormData) => {
  return axios.post("/master/changeCourierStatus", data);
};

export const ListCouriersService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listCourier?page=${page}&size=${size}`, data);
};

// Order Status

export const CreateOrderstatusService = (data: FormData) => {
  return axios.post("/master/addOrderStatus", data);
};

export const UpdateOrderStatusService = (data: FormData) => {
  return axios.post("/master/editOrderStatus", data);
};
export const ChangeStatusOrderStatusService = (data: FormData) => {
  return axios.post("/master/deleteOrderStatus", data);
};

export const DeleteOrderStatusService = (data: FormData) => {
  return axios.post("/master/deleteOrderStatus", data);
};

export const ListOrderStatusService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listOrderStatus?page=${page}&size=${size}`, data);
};

// Dropdowns

export const VehicleDropdownService = (data: FormData) => {
  return axios.post("/dropdown/vehicleDropdown", data);
};

export const ProductDropdownService = (data: FormData) => {
  return axios.post("/dropdown/productDropdown", data);
};

export const TaxClassDropdownService = (data: FormData) => {
  return axios.post("/dropdown/taxClassDropdown", data);
};
export const CountryDropdownService = (data?: FormData) => {
  return axios.post("/dropdown/countryDropdown", data);
};

export const StateDropdownService = (data?: FormData) => {
  return axios.post("/dropdown/stateDropdown", data);
};
export const DistrictDropdownService = (data?: FormData) => {
  return axios.post("/dropdown/districtDropdown", data);
};

export const CategoryDropdownService = (data: FormData) => {
  return axios.post("/dropdown/categoryDropdown", data);
};

export const TaxRateDropdownService = (data: FormData) => {
  return axios.post("/dropdown/taxRateDropdown", data);
};

export const AttributeDropdownService = (data: FormData) => {
  return axios.post("/dropdown/attributeDropdown", data);
};

export const PriceNameDropdownService = (data: FormData) => {
  return axios.post("/dropdown/priceNameDropdown", data);
};

export const WeightMeasureIdDropdownService = (data: FormData) => {
  return axios.post("/dropdown/weightMeasureDropdown", data);
};

export const OrderStatusDropdownService = (data: FormData) => {
  return axios.post("/dropdown/orderStatusDropdown", data);
};

export const UserDropdownService = (data: FormData) => {
  return axios.post("/dropdown/userDropdown", data);
};
export const priceNameDropdownService = (data: FormData) => {
  return axios.post("/dropdown/priceNameDropdown", data);
};
export const BrandDropdownService = (data: FormData) => {
  return axios.post("/dropdown/brandDropdown", data);
};

export const SupplierDropdownService = (data: FormData) => {
  return axios.post("/dropdown/supplierDropdown", data);
};
// CMS

// Home Banners

export const ChangeStatusHomeBannersService = (data: FormData) => {
  return axios.post("/cms/changeStatusHomepageBanners", data);
};

export const CreateHomeBannersService = (data: FormData) => {
  return axios.post("/cms/addHomepageBanners", data);
};

export const UpdateHomeBannersService = (data: FormData) => {
  return axios.post("/cms/editHomepageBanners", data);
};

export const ListHomeBannersService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/cms/listHomepageBanners?page=${page}&size=${size}`, data);
};

// Home Sales products

export const CreateHomesalesProductService = (data: FormData) => {
  return axios.post("/cms/addHomePageSalesProducts", data);
};

export const UpdateHomesalesProductService = (data: FormData) => {
  return axios.post("/cms/updateHomePageSalesProducts", data);
};

export const ChangeStatusHomesalesProductService = (data: FormData) => {
  return axios.post("/cms/changeStatusHomepageSalesProducts", data);
};

export const ListHomesalesProductService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(
    `/cms/listHomePageSalesProducts?page=${page}&size=${size}`,
    data
  );
};

// Manage Users

export const CreateUserService = (data: FormData) => {
  return axios.post("/addUser", data);
};

export const UpdateUserService = (data: FormData) => {
  return axios.post("/editUser", data);
};

export const DeleteUserService = (data: FormData) => {
  return axios.post("deleteUser", data);
};

export const ViewUserService = (data: FormData) => {
  return axios.post("viewUser", data);
};

export const ChangeUserStatusService = (data: FormData) => {
  return axios.post("changeStatusUser", data);
};

export const ListUserService = (page: number, size: number, data: FormData) => {
  return axios.post(`/listUser?page=${page}&size=${size}`, data);
};

export const ViewProfileService = (data: FormData) => {
  return axios.post("profile", data);
};
export const ChangeDesignationService = (data: FormData) => {
  return axios.post("changeDesignation", data);
};

export const ChangePasswordService = (data: FormData, api: string) => {
  return axios.post(api, data);
};
export const GetAddressService = (data: FormData) => {
  return axios.post("/getAddress", data);
};
//  User address

export const UpdateUserAddress = (data: any) => {
  return axios.post("/editAddress", data);
};

export const DeleteUserAddressService = (data: any) => {
  return axios.post("/deleteUserAddress", data);
};

// User Points

// export const UpdateUserPointsService = (data: any) => {
//   return axios.post("/editUserPoint", data);
// };

// Gallery

export const CreateGalleryService = (data: ObjectType) => {
  return axios.post("/cms/createGallery", data);
};

export const UpdateGalleryService = (data: ObjectType) => {
  return axios.post("/cms/updateGallery", data);
};

export const ChangeStatusGalleryService = (data: FormData) => {
  return axios.post("/cms/changeStatusGallery", data);
};

export const ListGalleryService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/cms/listGallery?page=${page}&size=${size}`, data);
};

// Gallery Items

export const DeletGalleryItems = (data: FormData) => {
  return axios.post("/cms/deleteGalleryItems", data);
};

export const ListGalleryItemsService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/cms/listGalleryItems?page=${page}&size=${size}`, data);
};

// Gallery Videos

export const CreateGalleryImagesService = (data: any) => {
  return axios.post("/cms/addGalleryImages", data);
};

export const UpdateGalleryImagesService = (data: any) => {
  return axios.post("/cms/editGalleryImages", data);
};

// Footer Address

export const CreateFooterAddressService = (data: FormData) => {
  return axios.post("/cms/addFooterAddresses", data);
};

export const UpdateFooterAddressService = (data: FormData) => {
  return axios.post("/cms/editFooterAddresses", data);
};

export const ChangeStatusFooterAddressService = (data: FormData) => {
  return axios.post("/cms/changeStatusFooterAddresses", data);
};

export const ListFooterAddressService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/cms/listFooterAddresses?page=${page}&size=${size}`, data);
};

// Faq

export const CreateFaqService = (data: any) => {
  return axios.post("/cms/addFaq", data);
};

export const UpdateFaqService = (data: any) => {
  return axios.post("/cms/EditFaq", data);
};

export const DeleteFaqService = (data: any) => {
  return axios.post("/cms/deleteFaq", data);
};

export const ListFaqService = (page: number, size: number, data: FormData) => {
  return axios.post(`/cms/listFaq?page=${page}&size=${size}`, data);
};
// Faq Category

export const ListFaqCategoryService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/cms/listFaqCategory?page=${page}&size=${size}`, data);
};

export const ChangeStatusFaqService = (data: FormData) => {
  return axios.post("/cms/changeStatusFaqCategory", data);
};

// Settings

export const UpdateSettingsService = (data: FormData) => {
  return axios.post("/cms/editSetting", data);
};

export const ViewSettingsService = (data: FormData) => {
  return axios.post("/cms/viewSettings", data);
};

// Bank Account

export const UpdateBankAccountService = (data: FormData) => {
  return axios.post("/cms/editBankAccount", data);
};

export const ViewBankAccountService = (data: FormData) => {
  return axios.post("/cms/viewBankAccount", data);
};

export const CreateBankAccountService = (data: FormData) => {
  return axios.post("/cms/addBankAccount", data);
};

// Orders
export const ListOrderService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/order/orderList?page=${page}&size=${size}`, data);
};

export const ViewOrderService = (data: FormData) => {
  return axios.post("/order/viewOrder", data);
};

export const ChangeStatusOrderService = (data: FormData) => {
  return axios.post("/order/changeOrderStatus", data);
};

export const EditOrderedProductService = (data: FormData) => {
  return axios.post("/order/editOrderedProduct", data);
};
export const ChangePaymentStatusService = (data: FormData) => {
  return axios.post("/order/changePaymentStatus", data);
};

// Reviews

export const CreateReviewService = (data: FormData) => {
  return axios.post("/master/addReview", data);
};

export const UpdateReviewService = (data: FormData) => {
  return axios.post("/master/editReview", data);
};

export const ChangeStatusReviewService = (data: FormData) => {
  return axios.post("/master/changeReviewStatus", data);
};

export const ListReviewService = (
  page: number,
  size: number,
  data: FormData
) => {
  return axios.post(`/master/listReview?page=${page}&size=${size}`, data);
};

export const ViewReviewService = (data: FormData) => {
  return axios.post("/master/viewReview", data);
};

export const DeleteReviewFileImage = (data: FormData) => {
  return axios.post("/master/deleteReviewFile", data);
};

// POint Stystem

export const ViewPointStystemService = () => {
  return axios.post("/master/viewPointMaster");
};

export const EditPointStystem = (data: FormData) => {
  return axios.post("/master/editPointMaster", data);
};

export const ListUserPointHistoryService = (
  page: number,
  size: number,
  data: any
) => {
  return axios.post(`/listPointHistory?page=${page}&size=${size}`, data);
};

// Reward Redemption
export const ListRedemptionRequestService = (
  page: number,
  size: number,
  data: any
) => {
  return axios.post(`/listRedeemRequest?page=${page}&size=${size}`, data);
};

export const ChangeStatusRewardRedemption = (data: FormData) => {
  return axios.post("/changeRedeemStatus", data);
};

export const ViewAccessPermissionService = (data: FormData) => {
  return axios.post("/viewAccessPermission", data);
};

export const EditAccessPermissionService = (data: ObjectType) => {
  return axios.post("/access_permission", data);
};

// Return Requests
export const ListReturnRequestService = (
  page: number,
  size: number,
  data: any
) => {
  return axios.post(`/order/listOrderReturn?page=${page}&size=${size}`, data);
};
export const ChangeStatusReturnRequestService = (data: FormData) => {
  return axios.post("/order/changeReturnRequestStatus", data);
};

// Contact Us List

export const ListContactUsRequestService = (
  page: number,
  size: number,
  data: any
) => {
  return axios.post(
    `/master/listContactDetails?page=${page}&size=${size}`,
    data
  );
};

export const ListSiteVisitRequestService = (
  page: number,
  size: number,
  data: any
) => {
  return axios.post(`/listVisitRecord?page=${page}&size=${size}`, data);
};

export const ListFollowUpsService = (page: number, size: number, data: any) => {
  return axios.post(`/listFollowup?page=${page}&size=${size}`, data);
};
export const ViewSiteVisitService = (data: any) => {
  return axios.post(`/viewVisitRecord`, data);
};
// Notification List
export const NotificationListService = (
  page: number,
  size: number,
  data: ObjectType
) => {
  return axios.post(`notfication-list?page=${page}&size=${size}`, data);
};
