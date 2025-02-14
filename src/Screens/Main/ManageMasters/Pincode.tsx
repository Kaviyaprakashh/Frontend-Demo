import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import classes from "../main.module.css";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { PinCodeFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusPinCodeService,
  ListPinCodeService,
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
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import ModifyPinCodeModal from "../../../Modals/ModifyModals/ModifyPinCodeModal";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Pincode() {
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
        pincodeNo: "",
      },
      onSubmit(values) {
        setFilters(values);
        GetListPinCode(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListPinCode = (page = 1, size = 10, values?: PinCodeFilterProps) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListPinCodeService(page, size, finalObj)
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
      lable: "Pin Code",
      render: (text) => text ?? "-",
      key: "pincodeNo",
    },

    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text}
          disabled={
            !permissons?.masters?.pin_code?.change_status ? true : false
          }
          onChange={() => {
            handleChangeStatus(data?.pincodeId, text === 1 ? 0 : 1);
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
            permissionData={permissons?.masters?.pin_code}
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
                id: data.pincodeId,
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
      pincodeId: id,
      status: status,
    };
    ChangeStatusPinCodeService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListPinCode(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      GetListPinCode(1, 10, values);
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
            name="Pin Code"
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
          <ModifyPinCodeModal
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
              GetListPinCode(1, 10, filters);
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Pin Code"
        OnClickAdd={() => {
          setModifyModal({
            show: true,
            UpdateData: null,
            type: "Create",
          });
        }}
        permissionData={permissons?.masters?.pin_code}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />
      <div className={classes.bgContainer}>
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Pin Code"
                maxLength={INPUT_LENGTHS.PinCode}
                placeholder="Enter  Pin Code"
                value={values.pincodeNo}
                onChange={(data) => {
                  setFieldValue("pincodeNo", data);
                }}
                validationType={"NUMBER"}
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
            handleListapi={GetListPinCode}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
