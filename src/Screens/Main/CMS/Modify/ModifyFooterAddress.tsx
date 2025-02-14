import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Col, Row } from "antd";
import * as Yup from "yup";
import classes from "../../main.module.css";
import { INPUT_LENGTHS, REGEX } from "../../../../Shared/Constants";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import { FooterAddressProps } from "../../../../@Types/ComponentProps";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../../Shared/Methods";
import {
  CreateFooterAddressService,
  UpdateFooterAddressService,
} from "../../../../Service/ApiMethods";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string().trim().required("Description is required"),
  city: Yup.string().trim().required("City is required"),
  phone: Yup.string()
    .matches(REGEX.MobileNo, "Invalid Phone Number")
    .required("Phone Number is required"),
  emailId: Yup.string()
    .matches(REGEX.EMAIL, "Invalid Email Address")
    .required("Email is required"),
  sortOrder: Yup.string().required("Sort Order is required"),
});
export default function ModifyFooterAddress() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef: any = useRef();
  let dispatch = useAppDispatch();
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        content: "",
        city: "",
        phone: "",
        emailId: "",
        sortOrder: "",
        uploadImg: "",
      },
      validateOnMount: true,
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateFooterAdress(values);
        } else if (type === "Update") {
          handleUpdateFoterAddress(values);
        }
      },
    });

  const handleCreateFooterAdress = (values: FooterAddressProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      uploadImg: CheckFileType(values?.uploadImg),
    };
    CreateFooterAddressService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateFoterAddress = (values: FooterAddressProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      uploadImg: CheckFileType(values?.uploadImg),
      footerAddressId: state?.UpdateData?.footerAdddressid,
    };
    UpdateFooterAddressService(ConvertJSONtoFormData(finalObj))
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
      content: editData?.content || "",
      city: editData?.city || "",
      phone: editData?.phone || "",
      emailId: editData?.emailId || "",
      sortOrder: editData.sortOrder >= 0 ? editData.sortOrder : "",
      uploadImg: editData?.imgPath || "",
    });
  };

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        handleUpdateData(state?.UpdateData);
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
        name={`${state?.type} Footer Address`}
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
              errorText={errors.title && touched.title ? errors.title : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Phone Number"
              maxLength={INPUT_LENGTHS.phone}
              placeholder="Enter Phone Number"
              value={values.phone}
              validationType={"NUMBER"}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("phone", data);
              }}
              errorText={errors.phone && touched.phone ? errors.phone : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Email"
              maxLength={INPUT_LENGTHS.email}
              placeholder="Enter Email"
              value={values.emailId}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("emailId", data);
              }}
              errorText={
                errors.emailId && touched.emailId ? errors.emailId : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="City"
              isRequired={true}
              maxLength={INPUT_LENGTHS.metaTitle}
              placeholder="Enter City"
              value={values.city}
              onChange={(data) => {
                setFieldValue("city", data);
              }}
              validationType={"CHAR_AND_SPACE"}
              errorText={errors.city && touched.city ? errors.city : ""}
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
            <CommonFileInput
              lable="Image"
              type="image"
              value={values.uploadImg}
              fileRef={FileRef}
              OnChange={(event) => {
                setFieldValue("uploadImg", event);
              }}
              handleClear={() => {
                setFieldValue("uploadImg", "");
                FileRef.current.value = null;
              }}
              Clearable={type === "Create" || !state.UpdateData?.imgPath}
              imagePath={values.uploadImg}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              maxLength={INPUT_LENGTHS.content}
              placeholder="Enter Description"
              value={values.content}
              onChange={(data) => {
                setFieldValue("content", data);
              }}
              isRequired={true}
              lable="Description"
              errorText={
                errors.content && touched.content ? errors.content : ""
              }
            />
          </Col>

          <Col xs={24}>
            <CommonButton
              type="submit"
              lable={type}
              isright
              handleClickEvent={() => handleSubmit()}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
