import { useFormik } from "formik";
import { Col, Row } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  BrandDropdownService,
  CategoryDropdownService,
  ChangeProductStatusService,
  ListProductsService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import GlobalModal from "../../../Modals/GlobalModal";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";

import { ProductFilterTypes } from "../../../@Types/FiltersTypes";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Products() {
  const navigate = useNavigate();
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [showFilter, setshowFilter] = useState(false);
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [CategoryList, setCategoryList] = useState([]);
  const tableFilters = GetTableFilters();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [brandList, setBrandList] = useState([]);
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const {
    values,
    initialValues,
    setValues,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      product_name: "",
      product_code: "",
      seo_url: "",
      category_id: null,
      order_by: "",
      order: "",
      min_price: "",
      max_price: "",
      brand_id: null,
    },
    onSubmit(values) {
      setFilters(values);
      GetListProducts(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // Product List Service
  const GetListProducts = (
    page = 1,
    size = 10,
    values?: ProductFilterTypes
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListProductsService(page, size, finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data);
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

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => <span>{getTableSNO(page, size, index)}</span>,
      key: "sno",
    },
    {
      lable: "Image",
      render: (text) =>
        text ? (
          <CommonImageBox alt="Product Image" source={text} type="table" />
        ) : (
          "-"
        ),
      key: "img_path",
    },
    {
      lable: "Alternate Image Name",
      render: (text) => ShowBigContent(text),
      key: "img_alt",
      showTooltip: true,
    },
    {
      lable: "Name",
      render: (text) => ShowBigContent(text),
      key: "name",
      showTooltip: true,
    },
    {
      lable: "Model",
      render: (text) => text ?? "-",

      key: "model",
      showTooltip: true,
      className: classes.NameBox,
    },
    {
      lable: "Brand",
      render: (text) => text ?? "-",
      key: "brand",
      className: classes.NameBox,
    },
    {
      lable: "Supplier",
      render: (text) =>
        text ? text.map((ele: any) => ele?.supplier_name)?.toString() : "-",
      key: "suppliers",
      className: classes.NameBox,
    },
    {
      lable: "HSN Code",
      render: (text) => text ?? "-",
      key: "hsn_code",
      className: classes.NameBox,
    },
    {
      lable: "Points",
      render: (text) => text ?? "-",
      key: "points",
    },
    {
      lable: "MRP Price",
      render: (text) => text ?? "-",
      key: "actual_price",
      className: classes.NameBox,
    },
    {
      lable: "Offer Price",
      render: (text) => text ?? "-",
      key: "price",
      className: classes.NameBox,
    },
    {
      lable: "Min Quantity",
      render: (text) => text ?? "-",
      key: "min_order_qty",
    },
    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sort_order",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text}
          disabled={
            permissons?.product_masters?.products?.change_status ? false : true
          }
          onChange={() => {
            handleChangeProductStatus(data.id, text === 1 ? 0 : 1);
          }}
        />
      ),
      key: "status",
    },

    {
      lable: "Action",
      render: (text, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.product_masters?.products}
            onClickViewIcon={() => {
              navigate("/product_masters/view_products", {
                state: {
                  type: "Update",
                  UpdateData: data,
                  filters: {
                    page,
                    size,
                    filters,
                  },
                },
              });
            }}
            onClickEditIcon={() => {
              navigate("/product_masters/modify_products", {
                state: {
                  type: "Update",
                  UpdateData: data,
                  filters: {
                    page,
                    size,
                    filters,
                  },
                },
              });
            }}
            onClickImageIcon={() => {
              navigate("/product_masters/products_images", {
                state: {
                  UpdateData: data,
                  filters: {
                    page,
                    size,
                    filters,
                  },
                },
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.id,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  // Change Status Service
  const handleChangeProductStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      product_id: id,
      status: status,
    };

    ChangeProductStatusService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListProducts(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  // Category Dropdown

  const getCategoryDropdown = () => {
    let finalObj = { token: token };

    CategoryDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.name, value: ele?.id };
          });
          setCategoryList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const getBrandDropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    BrandDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => ({
            label: ele.name,
            value: ele?.brand_id,
          }));

          setBrandList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
  };

  useEffect(() => {
    if (token) {
      getCategoryDropdown();
      getBrandDropdown();
      let finalFilters = tableFilters?.filters || values;
      GetListProducts(
        tableFilters?.page || 1,
        tableFilters?.size || 10,
        finalFilters
      );
      setValues(finalFilters);
      setFilters(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Product"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeProductStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Products"
        permissionData={permissons?.product_masters?.products}
        OnClickAdd={() => {
          navigate("/product_masters/modify_products", {
            state: {
              type: "Create",
              filters: {
                page,
                size,
                filters,
              },
            },
          });
        }}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />
      <div className={classes.bgContainer}>
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Product Name"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Product Name"
                value={values.product_name}
                onChange={(data) => {
                  setFieldValue("product_name", data);
                }}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Product Code"
                maxLength={INPUT_LENGTHS.productCode}
                placeholder="Enter Product Code"
                value={values.product_code}
                onChange={(data) => {
                  setFieldValue("product_code", data);
                }}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="SEO Url"
                maxLength={INPUT_LENGTHS.SEO_URL}
                placeholder="Enter SEO Url"
                value={values.seo_url}
                validationType="SEO_URL"
                onChange={(data) => {
                  setFieldValue("seo_url", data);
                }}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Category"
                options={CategoryList}
                placeholder="Select Category"
                value={values.category_id}
                onChange={(data) => {
                  setFieldValue("category_id", data);
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Brand"
                options={brandList}
                placeholder="Select Brand"
                value={values.brand_id}
                onChange={(data) => {
                  setFieldValue("brand_id", data);
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Min Price"
                maxLength={INPUT_LENGTHS.Price}
                placeholder="Enter Min Price"
                value={values.min_price}
                onChange={(data) => {
                  setFieldValue("min_price", data);
                }}
                validationType={"AMOUNT"}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Max Price"
                maxLength={INPUT_LENGTHS.Price}
                placeholder="Enter Max Price"
                value={values.max_price}
                onChange={(data) => {
                  setFieldValue("max_price", data);
                }}
                validationType={"AMOUNT"}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col>
              <SubmitResetBlock
                handleClickReset={() => {
                  resetForm();
                  handleSubmit();
                }}
                handleClickSubmit={() => handleSubmit()}
              />
            </Col>
          </Row>
        </FiltersAccordion>
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          {total ? (
            <CommonPaginaion
              DataList={DataList}
              handleListapi={GetListProducts}
              filters={filters}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
