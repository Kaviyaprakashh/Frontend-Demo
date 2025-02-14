import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import { HomebannersProps } from "../../../../@Types/ComponentProps";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
} from "../../../../Shared/Methods";
import {
  CreateHomeBannersService,
  UpdateHomeBannersService,
} from "../../../../Service/ApiMethods";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import classes from "../../main.module.css";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonCheckBox from "../../../../Components/FormFields/CommonCheckBox";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  banner_presence: Yup.number().required("Banner Type is required").nullable(),
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .when("banner_presence", {
      is: 1,
      then: () => Yup.string().trim().required("Title is Required"),
      otherwise: () => Yup.string().notRequired(),
    }),

  url: Yup.string().url("Invalid Url"),
  sortOrder: Yup.string().required("Sort Order is required"),
  header_title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true),
  mobileImg: Yup.string().when("banner_presence", {
    is: 2,
    then: () => Yup.string().required("Mobile Image is Required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  webImg: Yup.string().when("banner_presence", {
    is: 2,
    then: () => Yup.string().required("Web Image is Required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  mobileWebImg: Yup.string().when("banner_presence", {
    is: 2,
    then: () => Yup.string().required("Mobile Web Image is Required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});
export default function ModifyhomeBanners() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const WebImageRef: any = useRef();
  const MobileImageRef: any = useRef();
  const MobileWebImageRef: any = useRef();
  let dispatch = useAppDispatch();
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        url: "",
        header_title: "",
        description: "",
        webImgAlt: "",
        mobileWebImgAlt: "",
        mobileImgAlt: "",
        sortOrder: "",
        mobileImg: "",
        mobileWebImg: "",
        webImg: "",
        banner_presence: 1,
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateHomeBanners(values);
        } else if (type === "Update") {
          handleUpdateHomeBanners(values);
        }
      },
    });

  const checkBannerPresence = (value: any) => {
    return values?.banner_presence === 2 ? "" : value;
  };
  // Create Home Page Banners Serivice

  const handleCreateHomeBanners = (values: HomebannersProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      mobileImg: CheckFileType(values.mobileImg),
      mobileWebImg: CheckFileType(values.mobileWebImg),
      webImg: CheckFileType(values.webImg),
      title: checkBannerPresence(values?.title),
      header_title: checkBannerPresence(values?.header_title),
      description: checkBannerPresence(values?.description),
    });
    CreateHomeBannersService(finalObj)
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

  const handleUpdateHomeBanners = (values: HomebannersProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      mobileImg: CheckFileType(values.mobileImg),
      mobileWebImg: CheckFileType(values.mobileWebImg),
      webImg: CheckFileType(values.webImg),
      token: token,
      homePageBannerId: state?.UpdateData?.homepageBannerId,
      title: checkBannerPresence(values?.title),
      header_title: checkBannerPresence(values?.header_title),
      description: checkBannerPresence(values?.description),
    });
    UpdateHomeBannersService(finalObj)
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

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        setValues({
          title: state.UpdateData?.title || "",
          url: state.UpdateData?.url || "",
          header_title: state.UpdateData?.header_title || "",

          description: state.UpdateData?.description || "",

          webImgAlt: state.UpdateData?.webImgAlt || "",
          mobileWebImgAlt: state.UpdateData?.mobileWebImgAlt || "",
          mobileImgAlt: state.UpdateData?.mobile_img_alt || "",
          sortOrder:
            state.UpdateData.sortOrder >= 0 ? state.UpdateData.sortOrder : "",
          mobileImg: state.UpdateData?.mobImgPath || "",
          mobileWebImg: state.UpdateData?.mobWebImgPath || "",
          webImg: state.UpdateData?.webImgPath || "",
          banner_presence: state?.UpdateData?.banner_presence || null,
        });
      }
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Homepage Banner`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={() => {
          handleSubmit();
        }}
      />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <p className="Label">
              Banner Type<span className="requiredIcon">*</span>
            </p>
            <div className={classes.CheckBoxContainer}>
              <div>
                <CommonCheckBox
                  checked={values?.banner_presence === 2 ? true : false}
                  onChange={() => {
                    setFieldValue("banner_presence", 2);
                  }}
                />
                <p>Full Width Banner</p>
              </div>
              <div>
                <CommonCheckBox
                  checked={values?.banner_presence === 1 ? true : false}
                  onChange={() => {
                    setFieldValue("banner_presence", 1);
                  }}
                />
                <p>Normal Width Banner</p>
              </div>
            </div>
            {errors.banner_presence && touched.banner_presence ? (
              <p className="ErroText">{errors.banner_presence}</p>
            ) : (
              ""
            )}
          </Col>
          {values.banner_presence === 1 && (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Title"
                maxLength={INPUT_LENGTHS.title}
                placeholder="Enter Title"
                value={values.title}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("title", data);
                }}
                errorText={errors.title && touched.title ? errors.title : ""}
              />
            </Col>
          )}
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonInput
              lable="Sort Order"
              validationType={"NUMBER"}
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.sortOrder}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("sortOrder", data);
              }}
              errorText={
                errors.sortOrder && touched.sortOrder ? errors.sortOrder : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonInput
              lable="URL"
              maxLength={INPUT_LENGTHS.URL}
              placeholder="Enter URL  "
              value={values.url}
              onChange={(data) => {
                setFieldValue("url", data);
              }}
              errorText={errors.url && touched.url ? errors.url : ""}
            />
          </Col>
          {values.banner_presence === 1 && (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Header Title"
                maxLength={INPUT_LENGTHS.header_title}
                placeholder="Enter Header Title"
                value={values.header_title}
                onChange={(data) => {
                  setFieldValue("header_title", data);
                }}
                errorText={
                  errors.header_title && touched.header_title
                    ? errors.header_title
                    : ""
                }
              />
            </Col>
          )}

          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonFileInput
              lable="Mobile Image"
              type="image"
              id="mobileImg"
              fileRef={MobileImageRef}
              value={values.mobileImg}
              OnChange={(event) => {
                setFieldValue("mobileImg", event);
              }}
              Clearable={type === "Create"}
              handleClear={() => {
                setFieldValue("mobileImg", "");
                MobileImageRef.current.value = "";
              }}
              imagePath={values.mobileImg}
              errorText={
                errors.mobileImg && touched.mobileImg ? errors.mobileImg : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Mobile Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Mobile Image Name"
              value={values.mobileImgAlt}
              onChange={(data) => {
                setFieldValue("mobileImgAlt", data);
              }}
              errorText={
                errors.mobileImgAlt && touched.mobileImgAlt
                  ? errors.mobileImgAlt
                  : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonFileInput
              lable="Mobile Web Img"
              type="image"
              id="mobileWebImg"
              fileRef={MobileWebImageRef}
              OnChange={(event) => {
                setFieldValue("mobileWebImg", event);
              }}
              Clearable={type === "Create"}
              handleClear={() => {
                setFieldValue("mobileWebImg", "");
                MobileWebImageRef.current.value = "";
              }}
              imagePath={values.mobileWebImg}
              value={values?.mobileWebImg}
              errorText={
                errors.mobileWebImg && touched.mobileWebImg
                  ? errors.mobileWebImg
                  : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Mobile Web Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Mobile Web Image Name"
              value={values.mobileWebImgAlt} // isRequired={true}
              onChange={(data) => {
                setFieldValue("mobileWebImgAlt", data);
              }}
              errorText={
                errors.mobileWebImgAlt && touched.mobileWebImgAlt
                  ? errors.mobileWebImgAlt
                  : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonFileInput
              id="webImg"
              lable="Web Image"
              fileRef={WebImageRef}
              type="image"
              value={values.webImg}
              OnChange={(event) => {
                setFieldValue("webImg", event);
              }}
              Clearable={type === "Create"}
              handleClear={() => {
                setFieldValue("webImg", "");
                WebImageRef.current.value = "";
              }}
              imagePath={values.webImg}
              errorText={errors.webImg && touched.webImg ? errors.webImg : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Web Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Web Image Name"
              value={values.webImgAlt} // isRequired={true}
              onChange={(data) => {
                setFieldValue("webImgAlt", data);
              }}
              errorText={
                errors.webImgAlt && touched.webImgAlt ? errors.webImgAlt : ""
              }
            />
          </Col>
          {values.banner_presence === 1 && (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonTextArea
                lable="Description"
                maxLength={INPUT_LENGTHS.description}
                placeholder="Enter Description"
                value={values.description}
                onChange={(data) => {
                  setFieldValue("description", data);
                }}
                validationType="PREVENT_SPECIAL_CHAR"
              />
            </Col>
          )}
          <Col xs={24}>
            <CommonButton
              type="submit"
              isright
              lable={type ?? "Submit"}
              handleClickEvent={() => handleSubmit()}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
