import { Col, Row } from "antd";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomepageProductsFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusHomepageProductService,
  ListHomepageProductsService,
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
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import GlobalModal from "../../../Modals/GlobalModal";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function HomepageProducts() {
  const navigate = useNavigate();
  const token = GetToken();
  const tableFilters = GetTableFilters();
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [showFilter, setshowFilter] = useState(false);
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
      GetListHomepageProduct(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListHomepageProduct = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListHomepageProductsService(page, size, finalObj)
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

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },
    {
      lable: "Title",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
      key: "title",
    },

    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
    },

    {
      lable: "Category",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
      key: "categoryName",
    },
    {
      lable: "Created By",
      render: (text) => text ?? "-",
      key: "createdByName",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={
            permissons?.product_masters?.home_page_products?.change_status
              ? false
              : true
          }
          onChange={() => {
            handleChangeStatus(data.homepageProductsId, text === 1 ? 0 : 1);
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
            permissionData={permissons?.product_masters?.home_page_products}
            onClickViewIcon={() => {
              navigate("/product_masters/view_homepage_product", {
                state: { UpdateData: data, filters: { page, size, filters } },
              });
            }}
            onClickEditIcon={() => {
              navigate("/product_masters/modify_homepage_product", {
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
                id: data.homepageProductsId,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeStatus = (id: number, status: number) => {
    isLoading(true);
    let finanlObj = {
      token: token,
      homepageProductsId: id,
      status: status,
    };
    ChangeStatusHomepageProductService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListHomepageProduct(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      const finalFilters = tableFilters?.filters || values;
      GetListHomepageProduct(
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
            name="Homepage Product"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Homepage Products"
        permissionData={permissons?.product_masters?.home_page_products}
        OnClickAdd={() => {
          navigate("/product_masters/modify_homepage_product", {
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
            handleListapi={GetListHomepageProduct}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
