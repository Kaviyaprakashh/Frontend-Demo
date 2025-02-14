import React, { useEffect, useState } from "react";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import { useLocation, useNavigate } from "react-router";
import { GetToken } from "../../../../Shared/StoreData";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  ObjectType,
} from "../../../../Shared/Methods";
import { ViewProductsService } from "../../../../Service/ApiMethods";
import toast from "react-hot-toast";
import classes from "../../main.module.css";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonImageBox from "../../../../Components/FormFields/CommonImageBox";
import { Col, Row } from "antd";
import CommonPopover from "../../../../Components/UIComponents/CommonPopover";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import Nodata from "../../../../Components/ErrorElements/Nodata";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { ShowBigContent } from "../../../../Shared/Components";
export default function ViewProducts() {
  let navigate = useNavigate();
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { state } = useLocation();
  const [productData, setProductData] = useState<any>(null);
  let dispatch = useAppDispatch();
  const ViewProductsList = () => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      token,
      product_id: state.UpdateData.id,
    });
    ViewProductsService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setProductData(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        isLoading(false);
      });
  };
  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Attribute",
      key: "attr_title",
      className: "contant1_width",
      render: (text: any) => ShowBigContent(text),
      showTooltip: true,
    },
    {
      lable: "Content",
      key: "content",
      className: classes.tableInputBox,
      render: (text: any) => text ?? "-",
      showTooltip: true,
    },
  ];
  const ProductVariantsOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Size",
      key: "size",
      className: "contant1_width",
      render: (text: any) => text,
      showTooltip: true,
    },
    {
      lable: "Weight",
      key: "weight",
      className: classes.tableInputBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "MRP Price",
      key: productData?.pricing_type === 1 ? "actual_price_kg" : "actual_price",
      className: classes.tableInputBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Offer Price",
      key: productData?.pricing_type === 1 ? "price_kg" : "price",
      className: classes.tableInputBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Price Tags",
      key: "price_class",
      className: classes.tableInputBox,
      render: (text: any) => {
        return text.length > 0
          ? text?.map((ele: any) => {
              return (
                <div>
                  <p>
                    <span style={{ color: "var(--COLOR_PRIMARY)" }}>
                      {ele?.price_name}
                    </span>{" "}
                    - {ele?.price}/{ele?.actual_price}
                  </p>
                </div>
              );
            })
          : "-";
      },
    },
  ];
  const PricingTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Price Name",
      key: "price_name",
      className: "contant1_width",
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Price",
      key: "price",
      className: "contant2_width",
      render: (text: any) => text ?? "-",
    },
  ];
  const VehicleTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Vehicle Name",
      key: "vehicle_name",
      className: "contant1_width",
      render: (text: any) => ShowBigContent(text),
      showTooltip: true,
    },
    {
      lable: "Amount (Per Km)",
      key: "value",
      className: "contant2_width",
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Minimum Volume",
      key: "max_volume",
      className: "contant2_width",
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Maximum Volume",
      key: "min_volume",
      className: "contant2_width",
      render: (text: any) => text ?? "-",
    },
  ];

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        ViewProductsList();
        if (state?.filters) {
          dispatch(UpdateTableFilters(state.filters));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`View Product`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      <div className={classes.prodileContainer}>
        <div className={classes.viewHeader}>
          <div>
            <div className={classes.ProfileImages}>
              <img alt="Product" src={productData?.img_path} />
            </div>
            {productData?.product_assured ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--COLOR_PRIMARY)",
                  padding: 10,
                  background: "var(--COLOR_BG)",
                  borderRadius: 10,
                  fontFamily: "var(--FONT_POPPINS_REGULAR)",
                }}
              >
                Em Assured
              </p>
            ) : (
              ""
            )}
          </div>

          <div className={classes.UserviewBlock}>
            <h3 className={classes.subHeader}>Product Details</h3>
            <p>
              <span>Name</span>:<span>{productData?.name || "-"}</span>
            </p>
            <p>
              <span>Product Code</span>:
              <span>{productData?.product_code || "-"}</span>
            </p>
            <p>
              <span>Model</span>:<span>{productData?.model || "-"}</span>
            </p>
            <p>
              <span>Brand</span>:<span>{productData?.brand || "-"}</span>
            </p>
            <p>
              <span>Category</span>:
              <span>
                {productData?.category
                  ?.map((ele: any) => ele.name)
                  .toString() || "-"}
              </span>
            </p>
            <p>
              <span>Points</span>:<span>{productData?.points || "-"}</span>
            </p>
            <p>
              <span>HSN Code</span>:<span>{productData?.hsn_code || "-"}</span>
            </p>
          </div>
        </div>
        <div className={classes.ViewuserDetails}>
          <div className={classes.UserviewBlock}>
            <h3 className={classes.subHeader}>Price Details</h3>
            <p>
              <span>Pricing Type</span>:
              <span>{productData?.pricing_type === 1 ? "Kg" : "Quantity"}</span>
            </p>
            {productData?.has_variants === 1 && (
              <>
                <p>
                  <span>Offer Price</span>:
                  <span>
                    {`₹ ${
                      productData?.pricing_type === 1
                        ? productData?.price_kg
                        : productData?.price
                    }`}
                  </span>
                </p>
                <p>
                  <span>MRP Price</span>:
                  <span>
                    {`₹ ${
                      productData?.pricing_type === 1
                        ? productData?.actual_price_kg
                        : productData?.actual_price
                    }`}
                  </span>
                </p>
                {productData?.pricing_type === 1 && (
                  <>
                    <p>
                      <span>Price/Kg</span>:
                      <span>{`₹ ${productData?.price}`}</span>
                    </p>
                    <p>
                      <span>MRP Price/Kg</span>:
                      <span>{`₹ ${productData?.actual_price}`}</span>
                    </p>
                  </>
                )}
              </>
            )}

            {/* <p>
              <span>Discount</span>:<span>{productData?.discount || "-"}</span>
            </p> */}

            <p>
              <span>Tax Name</span>:
              <span>{productData?.tax_class_name || "-"}</span>
            </p>
            {/* <p>
              <span>Tax Amount</span>:
              <span>{productData?.taxAmount || "-"}</span>
            </p> */}
            <p>
              <span>Min Order Quantity</span>:
              <span>{productData?.min_order_qty || "-"}</span>
            </p>
            <p>
              <span>Max Order Quantity</span>:
              <span>{productData?.max_order_qty || "-"}</span>
            </p>
          </div>
          <div className={classes.UserviewBlock}>
            <h3 className={classes.subHeader}>Other Details</h3>
            <p>
              <span>Supplier</span>:
              <span>
                {productData?.suppliers
                  ?.map((ele: ObjectType) => ele?.supplier_name)
                  ?.toString() || "-"}
              </span>
            </p>
            <p>
              <span>Sort Order</span>:
              <span>
                {productData?.sort_order >= 0 ? productData.sort_order : "-"}
              </span>
            </p>
            {productData?.has_variants === 1 && (
              <p>
                <span>Weight</span>:<span>{productData?.weight || "-"}</span>
              </p>
            )}
            <p>
              <span>Weight Measure Name</span>:
              <span>{productData?.weight_measure_name || "-"}</span>
            </p>
            <p>
              <span>Product Tags</span>:
              <span>{productData?.product_tags || "-"}</span>
            </p>
          </div>
        </div>

        <div className={classes.bgContainer}>
          <div className={classes.UserviewBlock}>
            <h3 className={classes.subHeader}>Other Details</h3>
            <p>
              <span>Alternate Image Name</span>:
              <span>{productData?.img_alt || "-"}</span>
            </p>
            <p>
              <span>SEO Url</span>:<span>{productData?.seo_url || "-"}</span>
            </p>
            <p>
              <span>Meta Title</span>:
              <span>{productData?.meta_title || "-"}</span>
            </p>
            <p>
              <span>Meta Keywords</span>:
              <span>{productData?.meta_keywords || "-"}</span>
            </p>
            <p>
              <span>Meta Description</span>:
              <span>{productData?.meta_description || "-"}</span>
            </p>
            <p>
              <span>Short Description</span>:
              <span>{productData?.short_description || "-"}</span>
            </p>
            <p>
              <span>Short Description Mobile</span>:
              <span>{productData?.short_description_mob || "-"}</span>
            </p>
            <p>
              <span>Description</span>:
              <span>{productData?.description || "-"}</span>
            </p>
            <p>
              <span>Mobile Description </span>:
              <span>{productData?.description_mob || "-"}</span>
            </p>
          </div>
        </div>
        <Row gutter={[10, 10]}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={productData?.has_variants === 2 ? 24 : 12}
          >
            <div className={classes.bgContainer} style={{ height: "100%" }}>
              <h3 className={classes.subHeader}>Product Vehicle</h3>
              {productData?.vehicles?.length > 0 ? (
                <GlobalTable
                  Options={VehicleTableOptions}
                  items={productData?.vehicles}
                  total={productData?.vehicles?.length}
                  ismodify={true}
                  maxHeight={450}
                />
              ) : (
                <Nodata msg="No Vehicle Found for this Product" />
              )}
            </div>
          </Col>
          {productData?.has_variants === 1 && (
            <Col xs={24} sm={24} md={24} lg={12}>
              <div className={classes.bgContainer} style={{ height: "100%" }}>
                <h3 className={classes.subHeader}>Product Tags</h3>
                {productData?.price_class?.length > 0 ? (
                  <GlobalTable
                    Options={PricingTableOptions}
                    items={productData?.price_class}
                    total={productData?.price_class?.length}
                    ismodify={true}
                    maxHeight={450}
                  />
                ) : (
                  <Nodata msg="No Price Classes Found for this Product" />
                )}
              </div>
            </Col>
          )}
        </Row>
        {productData?.has_variants === 2 && (
          <div className={classes.bgContainer}>
            <h3 className={classes.subHeader}>Product Varients</h3>
            <GlobalTable
              Options={ProductVariantsOptions}
              items={productData?.product_variants_list}
              total={productData?.product_variants_list?.length}
              ismodify={true}
            />
          </div>
        )}
        <div className={classes.bgContainer}>
          <h3 className={classes.subHeader}>Product Attributes</h3>
          {productData?.attributes?.length > 0 ? (
            <GlobalTable
              Options={TableOptions}
              items={productData?.attributes}
              total={productData?.attributes?.length}
              ismodify={true}
            />
          ) : (
            <Nodata msg="No Attributes Found for this Product" />
          )}
        </div>

        <div className={classes.bgContainer}>
          <h3 className={classes.subHeader}>Related Products</h3>
          <Row gutter={[16, 16]}>
            {productData?.related_product?.length > 0 ? (
              productData?.related_product?.map((ele: any, index: number) => {
                return (
                  <Col xs={12} sm={12} md={6} lg={4} key={index}>
                    <div className={classes.RelatedproductCards}>
                      <CommonPopover content={ele?.name}>
                        <p>{ele.name}</p>
                      </CommonPopover>
                      <CommonImageBox
                        alt="Related Product Image"
                        source={ele.img_path}
                        type="view"
                        fullwidth={true}
                        showPreview={true}
                      />
                    </div>
                  </Col>
                );
              })
            ) : (
              <Nodata msg="No Related Product Found" />
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}
