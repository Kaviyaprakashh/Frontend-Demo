import classes from "../main.module.css";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { CategoryFiltersType } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusOrderStatusService,
  ListOrderStatusService,
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
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import GlobalModal from "../../../Modals/GlobalModal";
import ModifyOrderStatus from "../../../Modals/ModifyModals/ModifyOrderStatus";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function OrderStatus() {
  const token = GetToken();
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
        GetListOrderStatus(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListOrderStatus = (
    page = 1,
    size = 10,
    values?: CategoryFiltersType
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListOrderStatusService(page, size, finalObj)
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

  const handleChangeStatus = (id: number, status: any) => {
    isLoading(true);
    let finanlObj = {
      token: token,
      order_status_id: id,
      status: status,
    };
    ChangeStatusOrderStatusService(ConvertJSONtoFormData(finanlObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListOrderStatus(page, size, filters);
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
      lable: "Name",
      render: (text) => ShowBigContent(text),
      key: "name",
      showTooltip: true,
    },
    {
      lable: "Color",
      render: (text) =>
        text ? (
          <p className={classes.colorBox} style={{ background: text }} />
        ) : (
          "-"
        ),
      key: "colour_code",
    },
    {
      lable: "Color Code",
      render: (text) => (text ? <p>{text}</p> : "-"),
      key: "colour_code",
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
            !permissons?.masters?.order_status?.change_status ? true : false
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
            permissionData={permissons?.masters?.order_status}
            onClickEditIcon={() => {
              setModifyModal({
                show: true,
                UpdateData: data,
                type: "Update",
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
      GetListOrderStatus(1, 10, values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      {modifyModal.show && (
        <GlobalModal
          size={800}
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
          <ModifyOrderStatus
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
              GetListOrderStatus(1, 10, filters);
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Order Status"
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
            handleListapi={GetListOrderStatus}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
