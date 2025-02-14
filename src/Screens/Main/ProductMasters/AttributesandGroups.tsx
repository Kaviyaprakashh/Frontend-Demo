import classes from "../main.module.css";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";

import { AttrubuteGroupsFilterProps } from "../../../@Types/FiltersTypes";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";

import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ListAttrubuteGroupsService,
  UpdateAttrubuteGroupStatusService,
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
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import GlobalModal from "../../../Modals/GlobalModal";
import ViewAttributeGroups from "../../../Modals/ViewModals/ViewAttributeGroups";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function AttributesandGroups() {
  const navigate = useNavigate();
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const tableFilters = GetTableFilters();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
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
    setValues,
    initialValues,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListAttributeGroups(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListAttributeGroups = (
    page = 1,
    size = 10,
    values?: AttrubuteGroupsFilterProps
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListAttrubuteGroupsService(page, size, finalObj)
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
      lable: "Title",
      render: (text) => text ?? "-",
      key: "title",
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
            permissons?.product_masters?.attributes_groups?.change_status
              ? false
              : true
          }
          onChange={() => {
            handleChangeStatus(data?.attribute_group_id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.product_masters?.attributes_groups}
            onClickViewIcon={() => {
              setViewModal({
                show: true,
                data: data,
              });
            }}
            onClickEditIcon={() => {
              navigate("/product_masters/modify_attributegroups", {
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
                id: data.attribute_group_id,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeStatus = (id: number, status: any) => {
    isLoading(true);
    let finanlObj = {
      token: token,
      attribute_group_id: id,
      status: status,
    };
    UpdateAttrubuteGroupStatusService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListAttributeGroups(page, size, filters);
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
      GetListAttributeGroups(
        tableFilters?.page || 1,
        tableFilters?.size || 10,
        finalFilters
      );
      setFilters(finalFilters);
      setValues(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      {viewModal.show && (
        <GlobalModal
          title="Attribute Group"
          OnClose={() => {
            setViewModal({ show: false, data: null });
          }}
          Visible={viewModal.show}
          size={600}
        >
          <ViewAttributeGroups UpdateData={viewModal.data} />
        </GlobalModal>
      )}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Attribute Group"
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
        name="Attribute Groups"
        permissionData={permissons?.product_masters?.attributes_groups}
        OnClickAdd={() => {
          navigate("/product_masters/modify_attributegroups", {
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
            handleListapi={GetListAttributeGroups}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
