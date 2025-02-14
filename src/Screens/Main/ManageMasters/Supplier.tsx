import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import classes from "../main.module.css";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { WeightFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusSupplierService,
  ListSupplierService,
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
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { useNavigate } from "react-router";
import { ShowBigContent } from "../../../Shared/Components";
import { FilterReducetypes } from "../../../@Types/ComponentProps";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Supplier() {
  const token = GetToken();
  let navigate = useNavigate();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const { isLoading } = useLoaderHook();
  const [showFilter, setshowFilter] = useState(false);
  const tableFilters: FilterReducetypes = GetTableFilters();

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
      name: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListSupplier(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListSupplier = (page = 1, size = 10, values?: WeightFilterProps) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListSupplierService(page, size, finalObj)
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
      key: "",
    },

    {
      lable: "Name",
      render: (text) => text ?? "-",
      key: "name",
    },
    {
      lable: "Latitude",
      render: (text) => text ?? "-",
      key: "latitude",
    },
    {
      lable: "Longitude",
      render: (text) => text ?? "-",
      key: "longitude",
    },
    {
      lable: "Pin Code",
      render: (text) => text ?? "-",
      key: "postal_code",
    },
    {
      lable: "state",
      render: (text) => text ?? "-",
      key: "state",
    },
    {
      lable: "District",
      render: (text) => text ?? "-",
      key: "district",
    },
    {
      lable: "Address",
      render: (text) => ShowBigContent(text),
      key: "address",
      showTooltip: true,
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text}
          disabled={
            !permissons?.masters?.supplier?.change_status ? true : false
          }
          onChange={() => {
            handleChangeStatus(data?.supplier_id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.masters?.supplier}
            onClickEditIcon={() => {
              navigate("/manage_masters/modify_supplier", {
                state: {
                  UpdateData: data,
                  filters: { page, size, filters },
                  type: "Update",
                },
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.supplier_id,
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
      supplier_id: id,
      status: status,
    };
    ChangeStatusSupplierService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListSupplier(page, size, filters);
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
      GetListSupplier(
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
            name="Supplier"
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
        name="Supplier"
        permissionData={permissons?.masters?.supplier}
        OnClickAdd={() => {
          navigate("/manage_masters/modify_supplier", {
            state: {
              filters: { page, size, filters },
              type: "Create",
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
                lable="Name"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Name"
                value={values.name}
                onChange={(data) => {
                  setFieldValue("name", data);
                }}
                validationType={"PREVENT_EMOJI"}
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
            handleListapi={GetListSupplier}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
