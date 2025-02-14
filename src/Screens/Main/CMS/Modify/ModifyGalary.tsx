import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";

import {
  ConvertJSONtoFormData,
  FilterValidObj,
  getCatchMsg,
  getPermissionData,
} from "../../../../Shared/Methods";
import {
  CreateGalleryService,
  DeletGalleryItems,
  ListGalleryItemsService,
  UpdateGalleryService,
} from "../../../../Service/ApiMethods";
import {
  DataListTypes,
  GalleryProps,
  ListItem,
} from "../../../../@Types/ComponentProps";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";

import classes from "../../main.module.css";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS, REGEX } from "../../../../Shared/Constants";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { Images } from "../../../../Shared/ImageExport";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../../Components/UIComponents/CommonPagination";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  seoUrl: Yup.string().required("SEO Url is required"),
  sortOrder: Yup.string().required("Sort Order is required"),
  listItems: Yup.array().of(
    Yup.object().shape({
      sortOrder: Yup.string().required("Sort Order is required"),
      filePath: Yup.string()
        .required("Video URL is required")
        .test(
          "is-valid-video",
          "Enter a valid MP4, YouTube video, or Shorts URL",
          (value) => {
            if (!value) return false;
            const mp4Regex = /\.mp4$/; // Matches .mp4 files
            const youtubeRegex =
              /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;

            return mp4Regex.test(value) || youtubeRegex.test(value);
          }
        ),
    })
  ),
});
export default function ModifyGalary() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  let dispatch = useAppDispatch();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const [DataList, setDataList] = useState<DataListTypes>({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const {
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      title: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      seoUrl: "",
      sortOrder: "",
      listItems: [
        // {
        //   filePath: "",
        //   imgAlt: "",
        //   sortOrder: null,
        // },
      ],
    },
    validateOnMount: true,
    validationSchema,
    onSubmit(values) {
      if (type === "Create") {
        handleCreateGallery(values);
      } else if (type === "Update") {
        handleUpdateGallery(values);
      }
    },
  });

  const handleCreateGallery = (values: GalleryProps) => {
    isLoading(true);
    const finalObj = FilterValidObj({
      ...values,
      token: token,
      sortOrder: values?.sortOrder ? parseInt(values?.sortOrder) : "",
    });
    CreateGalleryService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          navigate(-1);
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

  const handleUpdateGallery = (values: GalleryProps) => {
    isLoading(true);
    const finalObj = FilterValidObj({
      ...values,
      token: token,
      listItems: items,
      sortOrder: values?.sortOrder ? parseInt(values?.sortOrder) : "",
      galleryId: state?.UpdateData?.galleryId,
    });
    UpdateGalleryService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          navigate(-1);
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

  const handleUpdateData = (editData: any) => {
    setValues({
      title: editData?.title || "",
      metaTitle: editData?.metaTitle || "",
      metaDescription: editData?.metaDescription || "",
      metaKeywords: editData?.metaKeywords || "",
      seoUrl: editData?.seoUrl || "",
      sortOrder: editData.sortOrder >= 0 ? editData.sortOrder : "",
      listItems:
        editData?.listItems?.map((ele: any) => ({
          galleryItemId: ele?.galleryItemId || "",
          filePath: ele?.filePath || "",
          sortOrder: ele.sortOrder >= 0 ? ele.sortOrder : "",
        })) || [],
    });
  };
  const getErrors = (index: number, key: string, main_key: string) => {
    // @ts-ignore
    if (errors[main_key]?.[index]?.[key] && touched[main_key]) {
      // @ts-ignore
      return errors[main_key]?.[index]?.[key];
    } else return "";
  };

  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Video Url",
      key: "filePath",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.title}
          placeholder="Enter Video Url"
          value={text}
          onChange={(data) => {
            setFieldValue(`listItems[${index}].filePath`, data);
            if (type === "Update") {
              setDataList((pre) => ({
                ...pre,
                items: values?.listItems?.map((ele: ListItem, ind) =>
                  index === ind ? { ...ele, filePath: data } : ele
                ),
              }));
            }
          }}
          errorText={getErrors(index, "filePath", "listItems")}
        />
      ),
    },

    {
      lable: "Sort Order",
      key: "sortOrder",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={text ?? ""}
          validationType={"NUMBER"}
          onChange={(data) => {
            setFieldValue(`listItems[${index}].sortOrder`, data);
            if (type === "Update") {
              setDataList((pre) => ({
                ...pre,
                items: values?.listItems?.map((ele: ListItem, ind) =>
                  index === ind ? { ...ele, sortOrder: data } : ele
                ),
              }));
            }
          }}
          errorText={getErrors(index, "sortOrder", "listItems")}
        />
      ),
    },

    {
      lable: (
        <img
          src={Images.ADD_ICON}
          alt="add icon"
          className={classes.TableIcons}
          onClick={() => {
            if (!errors?.listItems) {
              setFieldValue("listItems", [
                {
                  filePath: "",
                  sortOrder: "",
                },
                ...values.listItems,
              ]);
              if (type === "Update") {
                setDataList((pre) => ({
                  ...pre,
                  items: [
                    {
                      filePath: "",
                      sortOrder: "",
                    },
                    ...pre.items,
                  ],
                }));
              }
            } else {
              setFieldTouched("listItems", true);
            }
          }}
        />
      ),
      key: "",
      className: "contant2_width",
      render: (text: any, data, index) => (
        <>
          <img
            src={Images.CANCEL_ICON}
            alt="Cancel Icon"
            className={classes.TableIcons}
            onClick={() => {
              if (data.galleryItemId) {
                DeleteGalleryItems(data.galleryItemId);
              } else {
                setFieldValue(
                  "listItems",
                  values.listItems.filter((elem, ind) => ind !== index)
                );
                setDataList((pre) => ({
                  ...pre,
                  items: values.listItems.filter((elem, ind) => ind !== index),
                }));
              }
            }}
          />
        </>
      ),
    },
  ];

  const DeleteGalleryItems = (id: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      galleryItemId: id,
    };
    DeletGalleryItems(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          getListGalleryItems(page, size);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => {
        isLoading(false);
      });
  };
  const getListGalleryItems = (page = 1, size = 10) => {
    isLoading(true);
    let finalObj = {
      token: token,
      fileType: 2,
      galleryId: state.UpdateData.galleryId,
    };
    ListGalleryItemsService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalItems =
            response.data?.data?.items?.map((ele: ListItem) => ({
              filePath: ele.filePath,
              sortOrder: ele.sortOrder,
              galleryItemId: ele?.galleryItemId,
            })) || [];
          setDataList({
            ...response.data.data,
            items: finalItems,
          });
          setFieldValue("listItems", finalItems);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        getCatchMsg(error);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        handleUpdateData(state?.UpdateData);
        getListGalleryItems(1, 10);
        if (state?.filters) {
          dispatch(UpdateTableFilters(state?.filters));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className={classes.MainViewContainer}>
      <ScreenHeader
        name={`${state?.type} Gallery`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={() => {
          handleSubmit();
        }}
      />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Title"
              maxLength={INPUT_LENGTHS.title}
              placeholder="Enter Title"
              value={values.title}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("title", data);
              }}
              validationType="PREVENT_EMOJI"
              errorText={errors.title && touched.title ? errors.title : ""}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="SEO URL"
              maxLength={INPUT_LENGTHS.SEO_URL}
              placeholder="Enter SEO URL"
              value={values.seoUrl}
              isRequired={true}
              validationType="SEO_URL"
              onChange={(data) => {
                setFieldValue("seoUrl", data);
              }}
              errorText={errors.seoUrl && touched.seoUrl ? errors.seoUrl : ""}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Sort Order"
              validationType={"NUMBER"}
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.sortOrder}
              onChange={(data) => {
                setFieldValue("sortOrder", data);
              }}
              isRequired={true}
              errorText={
                errors.sortOrder && touched.sortOrder ? errors.sortOrder : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Meta Title"
              maxLength={INPUT_LENGTHS.metaTitle}
              placeholder="Enter Meta Title"
              value={values.metaTitle}
              onChange={(data) => {
                setFieldValue("metaTitle", data);
              }}
              validationType="PREVENT_EMOJI"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              lable="Meta Keywords"
              maxLength={INPUT_LENGTHS.metaKeywords}
              placeholder="Enter Meta Keywords"
              value={values.metaKeywords}
              onChange={(data) => {
                setFieldValue("metaKeywords", data);
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              lable="Meta Description"
              maxLength={INPUT_LENGTHS.description}
              placeholder="Enter Meta Description"
              value={values.metaDescription}
              onChange={(data) => {
                setFieldValue("metaDescription", data);
              }}
            />
          </Col>
        </Row>
        <div>
          <h3 className={classes.subHeader}>Gallery Videos</h3>
          <Col xs={24}>
            <GlobalTable
              Options={TableOptions}
              items={type === "Create" ? values?.listItems : items}
              total={
                type === "Create"
                  ? values?.listItems?.length
                  : total || values?.listItems?.length
              }
            />
          </Col>
          {type !== "Create" && (
            <CommonPaginaion
              DataList={DataList}
              filters={{}}
              handleListapi={(page, size) => {
                let findnewItems = values?.listItems?.find(
                  (ele: any) => ele?.galleryItemId === undefined
                );
                if (findnewItems) {
                  toast.error(
                    "Please Update Newly added items before change the page or size"
                  );
                } else {
                  getListGalleryItems(page, size);
                }
              }}
            />
          )}
        </div>
        <Col xs={24}>
          <CommonButton
            styles={{ marginTop: "10px" }}
            type="submit"
            lable={type}
            isright
            handleClickEvent={() => handleSubmit()}
          />
        </Col>
      </div>
    </div>
  );
}
