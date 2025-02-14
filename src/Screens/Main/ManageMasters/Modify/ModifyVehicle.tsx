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
  CreateVehicleService,
  UpdateVehicleService,
} from "../../../../Service/ApiMethods";
import { VehicleTypes } from "../../../../@Types/ComponentProps";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  min_weight: Yup.string().required("Minimum Weight is required"),
  max_weight: Yup.string()
    .test(
      "min_weight",
      "Maximum Weight must be greater than Minimum Weight",
      function (value: any) {
        const { min_weight } = this.parent; // Accessing the value of actual_price
        return min_weight && value
          ? parseFloat(min_weight) < parseFloat(value)
          : true;
      }
    )
    .required("Maximum weight required"),
  per_km_charge: Yup.string().required("Charge per Kilometer is required"),
  min_charge: Yup.string().required("Minimum Charge is required"),
});
export default function ModifyVehicle() {
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
        vehicle_type: "",
        min_weight: "",
        max_weight: "",
        per_km_charge: "",
        min_charge: "",
        img_path: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateVehicle(values);
        } else if (type === "Update") {
          handleUpdateVehicle(values);
        }
      },
    });

  const handleCreateVehicle = (values: VehicleTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateVehicleService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateVehicle = (values: VehicleTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      img_path: CheckFileType(values?.img_path),
      vehicle_id: state?.UpdateData?.vehicle_id,
    };
    UpdateVehicleService(ConvertJSONtoFormData(finalObj))
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

          vehicle_type: state?.UpdateData?.vehicle_type || "",
          min_weight: state?.UpdateData?.min_weight || "",
          max_weight: state?.UpdateData?.max_weight || "",
          per_km_charge: state?.UpdateData?.per_km_charge || "",
          min_charge: state?.UpdateData?.min_charge || "",
          img_path: state?.UpdateData?.img_path || "",
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
        name={`${state?.type} Vehicle`}
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
              lable="Minimum Weight"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Minimum Weight"
              value={values.min_weight}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("min_weight", data);
              }}
              validationType="AMOUNT"
              errorText={
                errors.min_weight && touched.min_weight ? errors.min_weight : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Maximum Weight"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Maximum Weight"
              value={values.max_weight}
              isRequired={true}
              validationType="AMOUNT"
              onChange={(data) => {
                setFieldValue("max_weight", data);
              }}
              errorText={
                errors.max_weight && touched.max_weight ? errors.max_weight : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Charge per Kilometer"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Charge per Kilometer"
              value={values.per_km_charge}
              isRequired={true}
              validationType="AMOUNT"
              onChange={(data) => {
                setFieldValue("per_km_charge", data);
              }}
              errorText={
                errors.per_km_charge && touched.per_km_charge
                  ? errors.per_km_charge
                  : ""
              }
            />
          </Col>{" "}
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Minimum Charge"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Minimum Charge"
              value={values.min_charge}
              validationType="AMOUNT"
              isRequired={true}
              onChange={(data) => {
                setFieldValue("min_charge", data);
              }}
              errorText={
                errors.min_charge && touched.min_charge ? errors.min_charge : ""
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
              Clearable={type === "Create"}
              imagePath={values.img_path}
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
