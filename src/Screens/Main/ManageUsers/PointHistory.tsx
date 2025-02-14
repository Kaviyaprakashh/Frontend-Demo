import classes from "../main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { PointHistoryFilters } from "../../../@Types/FiltersTypes";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import { GetToken } from "../../../Shared/StoreData";
import { ListUserPointHistoryService } from "../../../Service/ApiMethods";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { ShowBigContent } from "../../../Shared/Components";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";

export default function PointHistory() {
  const navigate = useNavigate();
  const token = GetToken();
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const [showFilter, setshowFilter] = useState(false);
  let dispatch = useAppDispatch();
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
        order_no: "",
      },
      onSubmit(values) {
        setFilters(values);
        GetListPointHistory(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  // List Orders Service

  const GetListPointHistory = (
    page = 1,
    size = 10,
    values?: PointHistoryFilters
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      user_id: state?.id,
    });
    ListUserPointHistoryService(page, size, finalObj)
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
  // Table Options
  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },

    {
      lable: "Order No",
      render: (text) => text ?? "-",
      key: "order_no",
      className: classes.NameBox,
    },
    {
      lable: "Current Points",
      render: (text) => text ?? "-",
      key: "current_points",
      className: classes.NameBox,
    },

    {
      lable: "Exist Points",
      render: (text) => text ?? "-",
      key: "exist_points",
      className: classes.NameBox,
    },

    {
      lable: "Description",
      render: (text) => ShowBigContent(text),
      key: "description",
      showTooltip: true,
    },
  ];

  useEffect(() => {
    if (token) {
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
      GetListPointHistory(page, size, values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Screen Header */}
      <ScreenHeader
        name={`Point History (${state?.UpdateData?.first_name})`}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />

      <div className={classes.bgContainer}>
        {/* Filters */}
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Order No"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Order No"
                value={values.order_no}
                onChange={(data) => {
                  setFieldValue("order_no", data);
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

        {/* Table Container */}
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListPointHistory}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
