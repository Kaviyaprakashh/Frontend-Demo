import classes from "../main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { CategoryType, INPUT_LENGTHS } from "../../../Shared/Constants";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusCategoryService,
  ListCategoryService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertJSONtoFormData,
  GetApipage,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import ViewCategoryModal from "../../../Modals/ViewModals/ViewCategoryModal";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";

import { FilterReducetypes } from "../../../@Types/ComponentProps";
import { CategoryFiltersType } from "../../../@Types/FiltersTypes";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Categories() {
  const navigate = useNavigate();
  const token = GetToken();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const tableFilters: FilterReducetypes = GetTableFilters();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({
    show: false,
    id: 0,
    msg: "",
  });
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const {
    values,
    setValues,
    initialValues,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      parent_id: null,
      meta_title: "",
      meta_keywords: "",
      seo_url: "",
      type: null,
    },
    onSubmit(values) {
      setFilters(values);
      GetListCategory(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // List Category Service

  const GetListCategory = (
    page = 1,
    size = 10,
    values?: CategoryFiltersType
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListCategoryService(page, size, finalObj)
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
      lable: "Altername Image Name",
      render: (text) => text ?? "-",
      key: "img_alt",
      className: classes.NameBox,
      showTooltip: true,
    },
    {
      lable: "Name",
      render: (text) => ShowBigContent(text),

      key: "name",
      showTooltip: true,
    },
    {
      lable: "Parent Category",
      render: (text) => ShowBigContent(text),
      key: "parent_category_name",
      showTooltip: true,
    },
    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sort_order",
      className: classes.NameBox,
    },

    {
      lable: "SEO Url",
      render: (text) => text ?? "-",
      key: "seo_url",
      className: classes.NameBox,
      showTooltip: true,
    },

    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={
            permissons?.product_masters?.categories?.change_status
              ? false
              : true
          }
          onChange={() => {
            handleChangeCategoryStatus(data.id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.product_masters?.categories}
            onClickViewIcon={() => {
              setViewModal({
                show: true,
                data: data,
              });
            }}
            onClickEditIcon={() => {
              navigate("/product_masters/modify_category", {
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
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.id,
                msg: data.parent_id
                  ? "Deleting this sub category will inactive all linked products. Are you sure you want to proceed?"
                  : "Deleting this category will inactive all linked subcategories and products. Are you sure you want to proceed?",
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  // Change Category Status Api

  // status => 0-inactive 1-active -1-delete

  const handleChangeCategoryStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      category_id: id,
      status: status,
    };

    ChangeStatusCategoryService(ConvertJSONtoFormData(finalObj, false))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListCategory(GetApipage(status, items, page), size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      let finalFilters = tableFilters?.filters || values;
      GetListCategory(
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
      {/* View Category Modal */}
      {viewModal.show && (
        <GlobalModal
          OnClose={() => {
            setViewModal({ show: false, data: null });
          }}
          Visible={viewModal.show}
          title={"View"}
          size={1000}
        >
          <ViewCategoryModal UpdateData={viewModal.data} />
        </GlobalModal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <GlobalModal size={500} Visible={deleteModal.show}>
          <ConfirmationModal
            type="categorydelete"
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Category"
            msg={deleteModal.msg}
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
                msg: "",
              });
            }}
            onClickOkButton={() => {
              handleChangeCategoryStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
                msg: "",
              });
            }}
          />
        </GlobalModal>
      )}

      {/* Screen Header */}
      <ScreenHeader
        name="Categories"
        permissionData={permissons?.product_masters?.categories}
        OnClickAdd={() => {
          navigate("/product_masters/modify_category", {
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
        {/* Filters */}
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Name"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Name"
                value={values.name}
                onChange={(data) => {
                  setFieldValue("name", data);
                }}
                handleSubmit={handleSubmit}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                options={CategoryType}
                placeholder="Select Category Type"
                allowClear
                value={values.type}
                lable="Category Type"
                onChange={(data) => {
                  setFieldValue("type", data);
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="SEO Url"
                maxLength={INPUT_LENGTHS.SEO_URL}
                placeholder="Enter SEO Url"
                value={values.seo_url}
                onChange={(data) => {
                  setFieldValue("seo_url", data);
                }}
                validationType="SEO_URL"
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

        {/* Table Container */}
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListCategory}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
