import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "../main.module.css";

import { HomepageProductsFilterProps } from "../../../@Types/FiltersTypes";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";

import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusGalleryService,
  ListGalleryService,
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
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Gallery() {
  const navigate = useNavigate();
  const token = GetToken();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const tableFilters = GetTableFilters();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
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
      GetListGallery(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListGallery = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    ListGalleryService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data.data);
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
      showTooltip: true,
      render: (text) => ShowBigContent(text),

      key: "title",
    },
    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
      className: classes.NameBox,
    },

    {
      lable: "SEO Url",
      showTooltip: true,
      render: (text) => ShowBigContent(text),
      key: "seoUrl",
    },

    {
      lable: "Meta Title",
      showTooltip: true,
      render: (text) => ShowBigContent(text),

      key: "metaTitle",
    },

    {
      lable: "Meta Keywords",
      showTooltip: true,
      render: (text) => ShowBigContent(text),

      key: "metaKeywords",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={!permissons?.cms?.gallery?.change_status ? true : false}
          onChange={() => {
            handleChangeGalleryStatus(data.galleryId, text === 1 ? 0 : 1);
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
            permissionData={permissons?.cms?.gallery}
            onClickViewIcon={() => {
              navigate("/cms/view_gallery", {
                state: {
                  type: "View",
                  UpdateData: data,
                  filters: {
                    page,
                    size,
                    filters,
                  },
                },
              });
            }}
            onClickEditIcon={() => {
              navigate("/cms/modify_gallery", {
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
            onClickImageIcon={() => {
              navigate("/cms/modify_gallery_images", {
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
                id: data.galleryId,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  // Change Status Gallery
  const handleChangeGalleryStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      galleryId: id,
      status: status,
    };

    ChangeStatusGalleryService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListGallery(page, size, filters);
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
      GetListGallery(
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
            name="Gallery"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeGalleryStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Gallery"
        permissionData={permissons?.cms?.gallery}
        OnClickAdd={() => {
          navigate("/cms/modify_gallery", {
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
                maxLength={INPUT_LENGTHS.Name}
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
            handleListapi={GetListGallery}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
