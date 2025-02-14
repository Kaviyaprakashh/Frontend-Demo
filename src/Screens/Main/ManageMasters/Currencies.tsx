import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomepageProductsFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusCurrencyService,
  ListCurrencyService,
} from "../../../Service/ApiMethods";
import {
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import ModifyCurrency from "../../../Modals/ModifyModals/ModifyCurrency";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import { ShowBigContent } from "../../../Shared/Components";

export default function Currencies() {
  const [showFilter, setshowFilter] = useState(false);
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
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
        title: "",
      },
      onSubmit(values) {
        setFilters(values);
        GetListCurrency(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListCurrency = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListCurrencyService(page, size, finalObj)
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
      render: (text) => ShowBigContent(text),
      key: "title",
      showTooltip: true,
    },
    {
      lable: "Symbol",
      render: (text) => text ?? "-",
      key: "symbol",
    },
    {
      lable: "Currency Value",
      render: (text) => text ?? "-",
      key: "value",
    },
    {
      lable: "Created Date",
      render: (text) => (text ? ConvertDatetime(text, "DATE_TIME") : "-"),
      key: "created_at",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          onChange={() => {
            handleChangeStatusCurrency(data.id, text === 1 ? 0 : 1);
          }}
        />
      ),
      key: "status",
    },
    // {
    //   lable: "Action",
    //   render: (text, data) => {
    //     return (
    //       <TableActionBlock
    //         onClickEditIcon={() => {
    //           setModifyModal({
    //             show: true,
    //             UpdateData: data,
    //             type: "Update",
    //           });
    //         }}
    //         onClickDeleteIcon={() => {
    //           setShowDeleteModal({
    //             show: true,
    //             id: data.id,
    //           });
    //         }}
    //       />
    //     );
    //   },
    //   key: "",
    // },
  ];
  const handleChangeStatusCurrency = (id: number, status: number) => {
    isLoading(false);
    let finalObj = {
      token: token,
      currency_id: id,
      status: status,
    };
    ChangeStatusCurrencyService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data?.msg);
          GetListCurrency(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => {
        isLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      GetListCurrency(1, 10, values);
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
          <ModifyCurrency
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
              GetListCurrency(1, 10, filters);
            }}
          />
        </GlobalModal>
      )}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Currency"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeStatusCurrency(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Currencies"
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
            handleListapi={GetListCurrency}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
