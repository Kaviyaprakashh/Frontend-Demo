import React, { useEffect, useState } from "react";
import { GetToken } from "../../../../Shared/StoreData";
import { useLocation, useNavigate } from "react-router";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { ViewHomepageProductsService } from "../../../../Service/ApiMethods";
import { getCatchMsg } from "../../../../Shared/Methods";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import classes from "../../main.module.css";
import { HomepageProductsView } from "../../../../@Types/ComponentProps";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import Nodata from "../../../../Components/ErrorElements/Nodata";
import {
  GetstatusWithColor,
  ShowViewData,
} from "../../../../Shared/Components";
export default function ViewHomepageProducts() {
  const { state } = useLocation();
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  let dispatch = useAppDispatch();
  let navigate = useNavigate();
  const [productData, setProductData] = useState<HomepageProductsView>();
  const getViewHomepageProduct = (id: number) => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("homepageProductsId", id);
    ViewHomepageProductsService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          setProductData(response.data?.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const ProductTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Product Name",
      key: "productName",
      className: "contant1_width",
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Sort Order",
      key: "sortOrder",
      className: "contant2_width",
      render: (text: any) => text ?? "-",
    },
  ];
  useEffect(() => {
    if (state?.UpdateData && token) {
      getViewHomepageProduct(state?.UpdateData?.homepageProductsId);
      if (state.filters) {
        dispatch(UpdateTableFilters(state.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`View Homepage Product`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      <div className={classes.prodileContainer}>
        <div className={classes.viewHeader}>
          {productData?.img_path && (
            <div className={classes.ProfileImages}>
              <img alt="Product" src={productData?.img_path} />
            </div>
          )}

          <div className={classes.UserviewBlock}>
            <h3 className={classes.subHeader}>Product Details</h3>
            {ShowViewData("Title", productData?.title)}
            {ShowViewData("Category", productData?.categoryName)}
            {ShowViewData("Alternate Image Name", productData?.img_alt)}
            {ShowViewData("Created By", productData?.createdByName)}
            <p>
              <span>Status</span>:{GetstatusWithColor(productData?.status)}
            </p>
          </div>
        </div>
        <div className={classes.bgContainer}>
          <h3 className={classes.subHeader}>Product List</h3>
          {productData?.productList.length ? (
            <GlobalTable
              Options={ProductTableOptions}
              items={productData?.productList}
              total={productData?.productList?.length}
              ismodify={true}
            />
          ) : (
            <Nodata msg="No Product Found" />
          )}
        </div>
      </div>
    </div>
  );
}
