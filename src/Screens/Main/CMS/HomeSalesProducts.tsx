import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomepageProductsFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";

import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusHomesalesProductService,
  ListHomesalesProductService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import { ShowBigContent } from "../../../Shared/Components";
import ViewHomesalesProducts from "../../../Modals/ViewModals/ViewHomesalesProducts";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function HomeSalesProducts() {
  const navigate = useNavigate();
  const token = GetToken();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const tableFilters = GetTableFilters();
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
      title: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListHomeSalesProducts(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // List Homesales Product Service

  const GetListHomeSalesProducts = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    ListHomesalesProductService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data.data);
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

  // Status change api for home sales product
  const handleChangeHomesalesProductsStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      homepageSalesProductsId: id,
      status: status,
    };

    ChangeStatusHomesalesProductService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListHomeSalesProducts(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },
    {
      lable: "Image",
      render: (text) =>
        text ? (
          <CommonImageBox source={text} type={"table"} alt="Category Image" />
        ) : (
          "-"
        ),
      key: "img_path",
    },
    {
      lable: "Title",
      render: (text) => ShowBigContent(text),
      key: "title",
      showTooltip: true,
    },
    {
      lable: "Product Name",
      render: (text) => ShowBigContent(text),
      key: "productName",
      showTooltip: true,
    },
    {
      lable: "Alternate Image Name",
      render: (text) => ShowBigContent(text),
      key: "img_alt",
      showTooltip: true,
    },

    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={
            !permissons?.cms?.homepage_sales_products?.change_status
              ? true
              : false
          }
          onChange={() => {
            handleChangeHomesalesProductsStatus(
              data.homepageSalesProductsId,
              text === 1 ? 0 : 1
            );
          }}
        />
      ),
      key: "status",
    },
    {
      lable: "Action",
      render: (_, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.cms?.homepage_sales_products}
            onClickViewIcon={() => {
              setViewModal({
                show: true,
                data: data,
              });
            }}
            onClickEditIcon={() => {
              navigate("/cms/modify_homesales_product", {
                state: {
                  type: "Update",
                  UpdateData: data,
                  filters: { page, size, filters },
                },
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.homepageSalesProductsId,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  useEffect(() => {
    if (token) {
      let finalFilters = tableFilters?.filters || values;
      GetListHomeSalesProducts(
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
      {/* View Modal */}

      {viewModal.show && (
        <GlobalModal
          OnClose={() => {
            setViewModal({ show: false, data: null });
          }}
          title="View"
          Visible={viewModal.show}
          size={1000}
        >
          <ViewHomesalesProducts UpdateData={viewModal.data} />
        </GlobalModal>
      )}

      {/* delete modal */}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Homepage Sales Product"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeHomesalesProductsStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        permissionData={permissons?.cms?.homepage_sales_products}
        name="Homepage Sales Products"
        OnClickAdd={() => {
          navigate("/cms/modify_homesales_product", {
            state: { type: "Create", filters: { page, size, filters } },
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
                lable="Title"
                maxLength={INPUT_LENGTHS.title}
                placeholder="Enter Title"
                value={values.title}
                onChange={(data) => {
                  setFieldValue("title", data);
                }}
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
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListHomeSalesProducts}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
