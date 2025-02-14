import { useLocation, useNavigate } from "react-router";
import { GetToken } from "../../../Shared/StoreData";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { useEffect, useState } from "react";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../Shared/Methods";
import {
  EditOrderedProductService,
  ViewOrderService,
} from "../../../Service/ApiMethods";
import toast from "react-hot-toast";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import {
  UpdateSecondaryFilters,
  UpdateTableFilters,
} from "../../../Store/Rudux/Reducer/MainReducer";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { Col, Row } from "antd";
import Nodata from "../../../Components/ErrorElements/Nodata";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";
import { Images } from "../../../Shared/ImageExport";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { AccessPermissionObject } from "../../../@Types/accesspermission";
export default function ViewOrders() {
  let navigate = useNavigate();
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { state } = useLocation();
  const [orderData, setOrderData] = useState<any>(null);
  let dispatch = useAppDispatch();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [weightConfirmation, setWeightConfirmation] = useState({
    show: false,
  });
  const [editOrderedProduct, setEditOrderedProduct] = useState({
    id: 0,
    inputValue: "",
    edit_type: 0,
  });

  const ViewOrderList = () => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      token,
      order_id: state.id,
    });
    ViewOrderService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setOrderData(response.data.data);
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
  const OrderTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",

      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Product Name",
      key: "product_name",
      className: classes.NameBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Product Code",
      key: "product_code",
      className: classes.NameBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "HSN Code",
      key: "hsn_code",
      className: classes.NameBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Unit",
      key: "unit",
      className: classes.NameBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Vehicle",
      key: "vehicle_name",
      className: classes.NameBox,
      showTooltip: true,
      render: (text: any) => text ?? "-",
    },

    {
      lable: "Quantity",
      key: "quantity",
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Weight per Quantity",
      key: "weight_per_qty",
      className: classes.NameBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Total Weight",
      key: "total_weight",
      className: classes.amountBox,
      render: (text: any, data: any) =>
        state?.history ? (
          text
        ) : (
          <div className={classes.weightContainer}>
            {editOrderedProduct?.id === data.id &&
            editOrderedProduct?.edit_type === 1 ? (
              <CommonInput
                maxLength={INPUT_LENGTHS.Weight}
                validationType="AMOUNT"
                value={editOrderedProduct.inputValue}
                handleSubmit={() =>
                  handleSubmitOrderedProduct(data.id, text, 1)
                }
                placeholder="Weight"
                styles={{
                  height: "30px",
                  border: editOrderedProduct?.inputValue ? "" : "1px solid red",
                }}
                onChange={(event) => {
                  setEditOrderedProduct((pre) => ({
                    ...pre,
                    inputValue: event,
                  }));
                }}
              />
            ) : (
              text
            )}
            {(permissons?.orders?.edit_weight && !editOrderedProduct.id) ||
            (editOrderedProduct.id === data?.id &&
              editOrderedProduct?.edit_type === 1) ? (
              <CommonImageBox
                source={
                  editOrderedProduct.id
                    ? Images.SAVE_ICON
                    : Images.EDIT_COLOR_ICON
                }
                type="setting"
                alt="edit icon"
                tooltipData="Change Total Weight"
                onClick={() => {
                  handleSubmitOrderedProduct(data.id, text, 1);
                }}
              />
            ) : (
              ""
            )}
          </div>
        ),
    },

    {
      lable: "Tax Percent",
      key: "gst_percent",
      className: classes.amountBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Tax Amount ( ₹ )",
      key: "gst_amount",
      className: classes.amountBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Shipping Price ( ₹ )",
      key: "shipping_price",
      className: classes.amountBox,

      render: (text: any, data: any) =>
        state?.history ? (
          text
        ) : (
          <div className={classes.weightContainer}>
            {editOrderedProduct?.id === data.id &&
            editOrderedProduct?.edit_type === 2 ? (
              <CommonInput
                maxLength={INPUT_LENGTHS.Price}
                validationType="AMOUNT"
                value={editOrderedProduct.inputValue}
                handleSubmit={() =>
                  handleSubmitOrderedProduct(data.id, text, 2)
                }
                placeholder="Shipping Price"
                styles={{
                  height: "30px",
                  border: editOrderedProduct?.inputValue ? "" : "1px solid red",
                }}
                onChange={(event) => {
                  setEditOrderedProduct((pre) => ({
                    ...pre,
                    inputValue: event,
                  }));
                }}
              />
            ) : (
              text
            )}
            {(permissons?.orders?.edit_shipping_price &&
              !editOrderedProduct.id) ||
            (editOrderedProduct.id === data?.id &&
              editOrderedProduct?.edit_type === 2) ? (
              <CommonImageBox
                source={
                  editOrderedProduct.id
                    ? Images.SAVE_ICON
                    : Images.EDIT_COLOR_ICON
                }
                type="setting"
                alt="edit icon"
                tooltipData="Change Total Weight"
                onClick={() => {
                  handleSubmitOrderedProduct(data.id, text, 2);
                }}
              />
            ) : (
              ""
            )}
          </div>
        ),
    },

    {
      lable: "Price ( ₹ )",
      key: "price_per_qty",
      className: classes.amountBox,
      render: (text: any) => text ?? "-",
    },
    {
      lable: "Total Price ( ₹ )",
      key: "total_price",
      className: classes.amountBox,
      render: (text: any) => text ?? "-",
    },
  ];

  const handleSubmitOrderedProduct = (
    id: number,
    inputValue: string,
    edit_type: number
  ) => {
    if (editOrderedProduct.id) {
      if (editOrderedProduct.inputValue) {
        setWeightConfirmation({ show: true });
      } else {
        toast.error(
          `${edit_type === 1 ? "Weight" : "Shipping"} Can't be empty`
        );
      }
    } else {
      setEditOrderedProduct({
        id,
        inputValue,
        edit_type,
      });
    }
  };
  useEffect(() => {
    if (token) {
      if (state?.id) {
        ViewOrderList();
        if (state?.Secondaryfilters) {
          dispatch(UpdateSecondaryFilters(state?.Secondaryfilters));
        }
        if (state?.filters) {
          dispatch(UpdateTableFilters(state.filters));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEditTotalWeight = () => {
    isLoading(true);
    let finalObj = {
      token,
      order_id: state?.id,
      ordered_product_id: editOrderedProduct.id,
      edit_type: editOrderedProduct.edit_type,
      weight:
        editOrderedProduct.edit_type === 1 ? editOrderedProduct.inputValue : "",
      shipping_price:
        editOrderedProduct.edit_type === 2 ? editOrderedProduct.inputValue : "",
    };
    EditOrderedProductService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          setEditOrderedProduct({
            id: 0,
            edit_type: 0,
            inputValue: "",
          });
          setWeightConfirmation({ show: false });
          ViewOrderList();
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        getCatchMsg(error);
        isLoading(false);
      })
      .finally(() => {
        // isLoading(false);
      });
  };

  return (
    <div>
      {weightConfirmation.show && (
        <GlobalModal Visible={weightConfirmation.show} size={400}>
          <ConfirmationModal
            OkButton="Submit"
            cancelButton="Cancel"
            msg={`Are you sure want to change ${
              editOrderedProduct.edit_type === 1
                ? "total weight"
                : "Shipping Price"
            } for this Product?`}
            onClickOkButton={() => {
              handleEditTotalWeight();
            }}
            type="confirmation"
            onClickcancelButton={() => {
              setWeightConfirmation({ show: false });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name={`View Orders`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        permissionData={permissons?.orders}
        onClickDownLoadBtn={
          permissons?.orders?.invoice_download
            ? () => {
                if (orderData?.pdf_path) {
                  window.open(orderData?.pdf_path);
                }
              }
            : false
        }
      />
      <div className={classes.prodileContainer}>
        <div className={classes.viewHeader}>
          <div className={classes.UserviewBlock}>
            <div className={classes.profileHeader}>
              <img
                src={Images.ProductIcon}
                alt="Profile Icon"
                style={{ width: "27px" }}
              />
              <h3>Order Details</h3>
            </div>
            <p>
              <span>Order No</span>:<span>{orderData?.order_no || "-"}</span>
            </p>
            <p>
              <span>Order Status</span>:
              <span>{orderData?.order_status || "-"}</span>
            </p>

            <p>
              <span>AWB No</span>:<span>{orderData?.awbno || "-"}</span>
            </p>

            <p>
              <span>Order Description</span>:
              <span>{orderData?.order_description || "-"}</span>
            </p>
          </div>
        </div>
        <div className={classes.ViewuserDetails}>
          <div className={classes.UserviewBlock}>
            <div className={classes.profileHeader}>
              <img src={Images.USER_ICON} alt="Profile Icon" />

              <h3>User Details</h3>
            </div>
            <p>
              <span>First Name</span>:
              <span>{orderData?.first_name || "-"}</span>
            </p>
            <p>
              <span>Last Name</span>:<span>{orderData?.last_name || "-"}</span>
            </p>
            <p>
              <span>Email</span>:<span>{orderData?.email_id || "-"}</span>
            </p>
            <p>
              <span>Phone No</span>:
              <span>{orderData?.phone_number || "-"}</span>
            </p>
            <p>
              <span>Fax</span>:<span>{orderData?.fax || "-"}</span>
            </p>
          </div>
          <div className={classes.UserviewBlock}>
            <div className={classes.profileHeader}>
              <img src={Images.PaymentIcon} alt="Profile Icon" />

              <h3>Payment Details</h3>
            </div>
            <p>
              <span>Invoice No</span>:
              <span>{orderData?.invoice_no || "-"}</span>
            </p>
            <p>
              <span>Payment Status</span>:
              <span>{orderData?.payment_status_name || "-"}</span>
            </p>
            <p>
              <span>Payment Response</span>:
              <span>{orderData?.payment_response || "-"}</span>
            </p>
            <p>
              <span>GST Type</span>:<span>{orderData?.gst_type || "-"}</span>
            </p>
            <p>
              <span>Total</span>:<span>₹ {orderData?.total}</span>
            </p>
          </div>
        </div>

        {/* End */}
        <div className={classes.ViewuserDetails}>
          <div className={classes.UserviewBlock}>
            <div className={classes.profileHeader}>
              <img src={Images.ADDRESS_ICON} alt="Profile Icon" />
              <h3>Payment Address</h3>
            </div>
            <p>
              <span>Address Type</span>:
              <span>
                {orderData?.billing_address[0]?.address_type_name || "-"}
              </span>
            </p>
            <p>
              <span>Country</span>:
              <span>{orderData?.billing_address[0]?.country || "-"}</span>
            </p>
            <p>
              <span>District</span>:
              <span>{orderData?.billing_address[0]?.district || "-"}</span>
            </p>
            <p>
              <span>State</span>:
              <span>{orderData?.billing_address[0]?.state || "-"}</span>
            </p>
            <p>
              <span>City</span>:
              <span>{orderData?.billing_address[0]?.city || "-"}</span>
            </p>
            {/* <p>
              <span>Taluk</span>:
              <span>{orderData?.billing_address[0]?.taluk || "-"}</span>
            </p> */}
            <p>
              <span>Post Code</span>:
              <span>{orderData?.billing_address[0]?.postcode || "-"}</span>
            </p>

            <p>
              <span>Address 1</span>:
              <span>{orderData?.billing_address[0]?.address1 || "-"}</span>
            </p>
            <p>
              <span>Address 2</span>:
              <span>{orderData?.billing_address[0]?.address2 || "-"}</span>
            </p>
          </div>
          <div className={classes.UserviewBlock}>
            <div className={classes.profileHeader}>
              <img src={Images.ADDRESS_ICON} alt="Profile Icon" />

              <h3>Shipping Address</h3>
            </div>
            <p>
              <span>Address Type</span>:
              <span>
                {orderData?.shipping_address[0]?.address_type_name || "-"}
              </span>
            </p>
            <p>
              <span>Country</span>:
              <span>{orderData?.shipping_address[0]?.country || "-"}</span>
            </p>
            <p>
              <span>District</span>:
              <span>{orderData?.shipping_address[0]?.district || "-"}</span>
            </p>
            <p>
              <span>State</span>:
              <span>{orderData?.shipping_address[0]?.state || "-"}</span>
            </p>
            <p>
              <span>City</span>:
              <span>{orderData?.shipping_address[0]?.city || "-"}</span>
            </p>
            {/* <p>
              <span>Taluk</span>:
              <span>{orderData?.shipping_address[0]?.taluk || "-"}</span>
            </p> */}
            <p>
              <span>Post Code</span>:
              <span>{orderData?.shipping_address[0]?.postcode || "-"}</span>
            </p>

            <p>
              <span>Address 1</span>:
              <span>{orderData?.shipping_address[0]?.address1 || "-"}</span>
            </p>
            <p>
              <span>Address 2</span>:
              <span>{orderData?.shipping_address[0]?.address2 || "-"}</span>
            </p>
          </div>
        </div>

        <Row gutter={[10, 10]}>
          <Col xs={24} sm={24}>
            <div className={classes.bgContainer}>
              <h3 className={classes.subHeader}>Product List</h3>
              {orderData?.product_list?.length > 0 ? (
                <GlobalTable
                  Options={OrderTableOptions}
                  items={orderData?.product_list}
                  total={orderData?.product_list?.length}
                  ismodify={true}
                  extraColumns={orderData?.order_total}
                />
              ) : (
                <Nodata msg="No Products Found" />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
