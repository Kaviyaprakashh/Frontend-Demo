import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { WeightFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusWeightService,
  ListWeightService,
} from "../../../Service/ApiMethods";
import {
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
import ModifyWeight from "../../../Modals/ModifyModals/ModifyWeight";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Weight() {
  const token = GetToken();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [showFilter, setshowFilter] = useState(false);
  const [modifyModal, setModifyModal] = useState({
    show: false,
    UpdateData: null,
    type: "",
  });
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const { values, initialValues, setFieldValue, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        name: "",
      },
      onSubmit(values) {
        setFilters(values);
        GetListWeight(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListWeight = (page = 1, size = 10, values?: WeightFilterProps) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListWeightService(page, size, finalObj)
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
            permissons?.product_masters?.weight?.change_status ? false : true
          }
          onChange={() => {
            handleChangeStatus(data?.id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.product_masters?.weight}
            onClickEditIcon={() => {
              setModifyModal({
                show: true,
                UpdateData: data,
                type: "Update",
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

  const handleChangeStatus = (id: number, status: any) => {
    isLoading(true);
    let finanlObj = {
      token: token,
      weight_measure_id: id,
      status: status,
    };
    ChangeStatusWeightService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListWeight(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      GetListWeight(1, 10, values);
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
            name="Weight"
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
      {modifyModal.show && (
        <GlobalModal
          size={500}
          Visible={modifyModal.show}
          title={modifyModal.type}
          OnClose={() => {
            setModifyModal({
              show: false,
              UpdateData: null,
              type: "",
            });
          }}
        >
          <ModifyWeight
            type={modifyModal?.type}
            UpdateData={modifyModal?.UpdateData}
            OnClose={() => {
              setModifyModal({
                show: false,
                UpdateData: null,
                type: "",
              });
            }}
            handleSuccess={() => {
              GetListWeight(1, 10, filters);
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Weight"
        permissionData={permissons?.product_masters?.weight}
        OnClickAdd={() => {
          setModifyModal({
            show: true,
            UpdateData: null,
            type: "Create",
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
                placeholder="Enter  Name"
                value={values.name}
                onChange={(data) => {
                  setFieldValue("name", data);
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
            handleListapi={GetListWeight}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
