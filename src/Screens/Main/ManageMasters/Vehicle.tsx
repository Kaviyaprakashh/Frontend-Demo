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
  ChangeStatusVehicleService,
  ListVehicleService,
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
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import { ShowBigContent } from "../../../Shared/Components";
import { FilterReducetypes } from "../../../@Types/ComponentProps";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Vehicle() {
  const token = GetToken();
  let navigate = useNavigate();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
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
      GetListVehicle(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListVehicle = (page = 1, size = 10, values?: WeightFilterProps) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListVehicleService(page, size, finalObj)
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
      lable: "Name",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
      key: "name",
    },

    {
      lable: "Maximum Weight",
      render: (text) => text,
      key: "max_weight",
    },

    {
      lable: "Minimum Weight",
      render: (text) => text,
      key: "min_weight",
    },
    {
      lable: "Minimum Charge ( ₹ )",
      render: (text) => text,
      key: "min_charge",
    },
    {
      lable: "Charge per Kilometer ( ₹ )",
      render: (text) => text,
      key: "per_km_charge",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text}
          disabled={!permissons?.masters?.vehicle?.change_status ? true : false}
          onChange={() => {
            handleChangeStatus(data?.vehicle_id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.masters?.vehicle}
            onClickEditIcon={() => {
              navigate("/manage_masters/modify_vehicle", {
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
                id: data.vehicle_id,
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
      vehicle_id: id,
      status: status,
    };
    ChangeStatusVehicleService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListVehicle(page, size, filters);
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
      GetListVehicle(
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
            name="Vehicle"
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
        name="Vehicle"
        permissionData={permissons?.masters?.vehicle}
        OnClickAdd={() => {
          navigate("/manage_masters/modify_vehicle", {
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
            handleListapi={GetListVehicle}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
