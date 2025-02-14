import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useEffect, useRef } from "react";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import classes from "../../main.module.css";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../../Shared/Methods";
import {
  CreateBrandService,
  UpdateBrandService,
} from "../../../../Service/ApiMethods";
import { BrandTypes } from "../../../../@Types/ComponentProps";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is required"),
  distributor: Yup.string()
    .trim("Please remove leading and trailing spaces")

    .strict(true)
    .required("Distributor is required"),
  sort_order: Yup.string().required("Sort Order is required"),
  // img_path: Yup.string().required("Image is required"),
  img_alt: Yup.string().required("Alternate Image Name is required"),
});
export default function ModifyBrand() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  let dispatch = useAppDispatch();
  const navigate = useNavigate();
  let fileRef: any = useRef();
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
        distributor: "",
        img_path: "",
        img_alt: "",
        sort_order: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateBrand(values);
        } else if (type === "Update") {
          handleUpdateBrand(values);
        }
      },
    });

  const handleCreateBrand = (values: BrandTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateBrandService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateBrand = (values: BrandTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      img_path: CheckFileType(values?.img_path),
      brand_id: state?.UpdateData?.brand_id,
    };
    UpdateBrandService(ConvertJSONtoFormData(finalObj))
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
          name: state?.UpdateData?.name || "",
          description: state?.UpdateData?.description || "",
          distributor: state?.UpdateData?.distributor || "",
          img_path: state?.UpdateData?.img_path || "",
          img_alt: state?.UpdateData?.img_alt || "",
          sort_order: state?.UpdateData?.sort_order || "",
        });
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
        name={`${state?.type} Brand`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={handleSubmit}
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
              errorText={errors.name && touched.name ? errors.name : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Distributor"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Distributor"
              value={values.distributor}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("distributor", data);
              }}
              errorText={
                errors.distributor && touched.distributor
                  ? errors.distributor
                  : ""
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
              fileRef={fileRef}
              OnChange={(event) => {
                setFieldValue("img_path", event);
              }}
              handleClear={() => {
                setFieldValue("img_path", "");
                fileRef.current.value = "";
              }}
              isRequired
              Clearable={type === "Create"}
              imagePath={values.img_path}
              errorText={
                errors.img_path && touched.img_path ? errors.img_path : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Image Name"
              isRequired={true}
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Image Name"
              value={values.img_alt}
              onChange={(data) => {
                setFieldValue("img_alt", data);
              }}
              validationType="PREVENT_EMOJI"
              errorText={
                errors.img_alt && touched.img_alt ? errors.img_alt : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              maxLength={INPUT_LENGTHS.description}
              placeholder="Enter Description"
              value={values.description}
              disabled={type === "View"}
              onChange={(data) => {
                setFieldValue("description", data);
              }}
              validationType="PREVENT_EMOJI"
              lable="Description"
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
