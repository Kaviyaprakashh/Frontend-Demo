import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import * as Yup from "yup";

import { CategoryProps } from "../../../@Types/ComponentProps";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import CommonTextArea from "../../../Components/FormFields/CommonTextArea";
import CommonFileInput from "../../../Components/FormFields/CommonFileInput";
import CommonButton from "../../../Components/Buttons/CommonButton";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
} from "../../../Shared/Methods";
import { GetToken } from "../../../Shared/StoreData";
import {
  CategoryDropdownService,
  CreateCategoryService,
  UpdateCategoryService,
} from "../../../Service/ApiMethods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { OptionTypes } from "../../../@Types/GlobalTypes";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  seo_url: Yup.string().required("Seo Url is required"),
  meta_title: Yup.string().trim().required("Meta title is required"),
  sort_order: Yup.string().required("Sort Order is required"),
});
export default function ModifyCategory() {
  const { state } = useLocation();
  const { type } = state || {};
  const FileRef: any = useRef();
  const { isLoading } = useLoaderHook();
  const token = GetToken();
  const navigate = useNavigate();
  let dispatch = useAppDispatch();

  const [CategoryList, setCategoryList] = useState([]);
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        parent_id: null,
        name: "",
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        seo_url: "",
        img_path: "",
        img_alt: "",
        sort_order: "",
      },
      validateOnMount: true,
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateCategory(values);
        } else if (type === "Update") {
          handleUpdateCategory(values);
        }
      },
    });

  // Create Category Service
  const handleCreateCategory = (values: CategoryProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      img_path: CheckFileType(values?.img_path),
    });
    CreateCategoryService(finalObj)
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

  // Update Category Service

  const handleUpdateCategory = (values: CategoryProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      img_path: CheckFileType(values?.img_path),
      category_id: state?.UpdateData?.id,
    });
    UpdateCategoryService(finalObj)
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

  const getCategoryDropdown = () => {
    isLoading(true);
    let finalObj = { token: token, type: 1 };
    CategoryDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.name, value: ele?.id };
          });
          if (state.UpdateData?.id) {
            finalList = finalList?.filter(
              (ele: OptionTypes) => ele?.value !== state?.UpdateData?.id
            );
          }

          setCategoryList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => isLoading(false));
  };

  const handleUpdateData = (editData: any) => {
    setValues({
      parent_id: editData?.parent_id || null,
      name: editData?.name || "",
      description: editData?.description || "",
      meta_title: editData?.meta_title || "",
      meta_description: editData?.meta_description || "",
      meta_keywords: editData?.meta_keywords || "",
      seo_url: editData?.seo_url || "",
      img_path: editData?.img_path || "",
      img_alt: editData?.img_alt || "",
      sort_order: editData.sort_order >= 0 ? editData.sort_order : "",
    });
  };

  useEffect(() => {
    if (token) {
      getCategoryDropdown();
      if (state?.UpdateData) {
        handleUpdateData(state?.UpdateData);
      }
      if (state?.filters) {
        dispatch(UpdateTableFilters(state.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Category`}
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
              lable="Name"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Name"
              value={values.name}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("name", data);
              }}
              validationType="PREVENT_SPECIAL_CHAR"
              errorText={errors.name && touched.name ? errors.name : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Meta Title"
              isRequired={true}
              maxLength={INPUT_LENGTHS.metaTitle}
              placeholder="Enter Meta Title"
              value={values.meta_title}
              validationType="PREVENT_EMOJI"
              onChange={(data) => {
                setFieldValue("meta_title", data);
              }}
              errorText={
                errors.meta_title && touched.meta_title ? errors.meta_title : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Seo Url"
              maxLength={INPUT_LENGTHS.SEO_URL}
              placeholder="Enter Seo Url"
              value={values.seo_url}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("seo_url", data);
              }}
              validationType="SEO_URL"
              errorText={
                errors.seo_url && touched.seo_url ? errors.seo_url : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Sort Order"
              validationType={"NUMBER"}
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.sort_order}
              onChange={(data) => {
                setFieldValue("sort_order", data);
              }}
              isRequired={true}
              errorText={
                errors.sort_order && touched.sort_order ? errors.sort_order : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonFileInput
              lable="Image"
              type="image"
              value={values.img_path}
              fileRef={FileRef}
              OnChange={(event) => {
                setFieldValue("img_path", event);
              }}
              handleClear={() => {
                setFieldValue("img_path", "");
                FileRef.current.value = "";
              }}
              Clearable={type === "Create"}
              imagePath={values.img_path}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Image Name"
              value={values.img_alt}
              onChange={(data) => {
                setFieldValue("img_alt", data);
              }}
              validationType="PREVENT_EMOJI"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              maxLength={INPUT_LENGTHS.description}
              placeholder="Enter Description"
              value={values.description}
              onChange={(data) => {
                setFieldValue("description", data);
              }}
              validationType="PREVENT_SPECIAL_CHAR"
              lable="Description"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              lable="Meta Description"
              maxLength={INPUT_LENGTHS.description}
              placeholder="Enter Meta Description"
              value={values.meta_description}
              validationType="PREVENT_SPECIAL_CHAR"
              onChange={(data) => {
                setFieldValue("meta_description", data);
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              lable="Meta Keywords"
              maxLength={INPUT_LENGTHS.metaKeywords}
              placeholder="Enter Meta Keywords"
              value={values.meta_keywords}
              onChange={(data) => {
                setFieldValue("meta_keywords", data);
              }}
              validationType="PREVENT_SPECIAL_CHAR"
            />
          </Col>
          {(type === "Create" || state?.UpdateData?.parent_id) && (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <CommonSelect
                lable="Parent Category"
                options={CategoryList}
                placeholder="Select Parent Category"
                value={values?.parent_id}
                optionName={
                  values?.parent_id
                    ? state?.UpdateData?.parent_category_name
                    : ""
                }
                onChange={(data) => {
                  setFieldValue("parent_id", data);
                }}
                allowClear
              />
            </Col>
          )}
          <Col xs={24}>
            <CommonButton
              type="submit"
              lable={type}
              handleClickEvent={() => handleSubmit()}
              isright={true}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
