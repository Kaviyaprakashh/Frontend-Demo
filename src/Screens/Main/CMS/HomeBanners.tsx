import { useFormik } from "formik";
import { Col, Row } from "antd";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomeBannerFiltersType } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusHomeBannersService,
  ListHomeBannersService,
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
import ViewHomeBanners from "../../../Modals/ViewModals/ViewHomeBanners";
import GlobalModal from "../../../Modals/GlobalModal";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function HomeBanners() {
  const navigate = useNavigate();
  const token = GetToken();
  const tableFilters = GetTableFilters();
  const { isLoading } = useLoaderHook();
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const [showFilter, setshowFilter] = useState(false);
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
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
      GetListHomepageBanners(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // Home Banners List

  const GetListHomepageBanners = (
    page = 1,
    size = 10,
    values?: HomeBannerFiltersType
  ) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    ListHomeBannersService(page, size, ConvertJSONtoFormData(finalObj))
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

  // status => 0-inactive 1-active -1-delete

  const handleChangeBannersStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      banner_id: id,
      status: status,
    };

    ChangeStatusHomeBannersService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListHomepageBanners(page, size, filters);
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
      lable: "Title",
      render: (text) => ShowBigContent(text),
      key: "title",
      showTooltip: true,
    },
    {
      lable: "Header Title",
      render: (text) => ShowBigContent(text),
      key: "header_title",
      showTooltip: true,
    },
    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={
            !permissons?.cms?.homepage_banners?.change_status ? true : false
          }
          onChange={() => {
            handleChangeBannersStatus(
              data.homepageBannerId,
              text === 1 ? 0 : 1
            );
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
            permissionData={permissons?.cms?.homepage_banners}
            onClickViewIcon={() => {
              setViewModal({
                show: true,
                data: data,
              });
            }}
            onClickEditIcon={() => {
              navigate("/cms/modify_home_banners", {
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
                id: data.homepageBannerId,
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
      let finalFilters = tableFilters?.filters || values;
      GetListHomepageBanners(
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
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Homepage Banner"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeBannersStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}

      {/* View Modal */}

      {viewModal.show && (
        <GlobalModal
          OnClose={() => {
            setViewModal({ show: false, data: null });
          }}
          title="View"
          Visible={viewModal.show}
          size={1000}
        >
          <ViewHomeBanners UpdateData={viewModal.data} />
        </GlobalModal>
      )}

      <ScreenHeader
        permissionData={permissons?.cms?.homepage_banners}
        name="Homepage Banners"
        OnClickAdd={() => {
          navigate("/cms/modify_home_banners", {
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
            handleListapi={GetListHomepageBanners}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
