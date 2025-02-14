import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import classes from "../../main.module.css";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../../Shared/Methods";
import {
  CreateSupplierService,
  DistrictDropdownService,
  GetAddressService,
  StateDropdownService,
  UpdateSupplierService,
} from "../../../../Service/ApiMethods";
import { SupplierTypes } from "../../../../@Types/ComponentProps";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import { INPUT_LENGTHS, REGEX } from "../../../../Shared/Constants";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { DropdownTypes } from "../../../../@Types/ApiDataTypes";
import CommonSelect from "../../../../Components/FormFields/CommonSelect";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is required"),
  postal_code: Yup.string()
    .matches(REGEX.PIN_CODE, "Invalid Pin Code")
    .required("Pin Code is Required"),
  latitude: Yup.string().trim().required("Latitude is Required"),
  longitude: Yup.string()
    .trim()
    .test(
      "fields-not-same",
      "longitude cannot be the same as latitude",
      function (value) {
        return value !== this.parent.latitude; // `this.parent` gives access to sibling fields
      }
    )
    .required("Longtitude is Required"),

  address: Yup.string().trim().required("Address is Required"),
  state_id: Yup.string().required("State is Required"),
  district_id: Yup.string().required("District is Required"),
  phone_no: Yup.string()
    .matches(REGEX.MobileNo, "Invalid Mobile Number")
    .required("Phone Number is required"),
});
export default function ModifySupplier() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  let dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [stateList, setStateList] = useState<DropdownTypes[]>([]);
  const [DistrictList, setDistrictList] = useState<DropdownTypes[]>([]);
  const [districtError, setdistrictError] = useState(false);

  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        material_type: "",
        latitude: "",
        longitude: "",
        address: "",
        postal_code: "",
        country_id: 101,
        state_id: null,
        district_id: null,
        phone_no: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateSupplier(values);
        } else if (type === "Update") {
          handleUpdateSupplier(values);
        }
      },
    });

  const handleCreateSupplier = (values: SupplierTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateSupplierService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateSupplier = (values: SupplierTypes) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,

      supplier_id: state?.UpdateData?.supplier_id,
    };
    UpdateSupplierService(ConvertJSONtoFormData(finalObj))
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

  const getStateDropdown = (country_id: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("country_id", 101);

    StateDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data.data?.map((ele: any) => {
            return { label: ele?.name, value: ele?.id };
          });
          setStateList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const GetdistrictDropdown = (district_id: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("state_id", district_id);

    DistrictDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data.data?.map((ele: any) => {
            return { label: ele?.name, value: ele?.id };
          });
          setDistrictList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const getUserAddress = (pinCode: string) => {
    // isLoading(true);
    let formdata: any = new FormData();
    formdata.append("postal_code", pinCode);
    formdata.append("country_id", 101);

    GetAddressService(formdata)
      .then((response) => {
        if (response.data.status === 1) {
          setValues((pre) => ({
            ...pre,
            state_id: response.data?.state.state_id,
            district_id: response.data?.district.district_id,
          }));
          GetdistrictDropdown(response.data?.state.state_id);
        } else {
          setValues((pre) => ({
            ...pre,
            state_id: null,
            district_id: null,
          }));
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
    // .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        setValues({
          name: state?.UpdateData?.name || "",
          material_type: state?.UpdateData?.material_type || "",
          latitude: state?.UpdateData?.latitude || "",
          longitude: state?.UpdateData?.longitude || "",
          address: state?.UpdateData?.address || "",
          postal_code: state?.UpdateData?.postal_code || "",
          country_id: state?.UpdateData?.country_id || 101,
          state_id: state?.UpdateData?.state_id || null,
          district_id: state?.UpdateData?.district_id || null,
          phone_no: state?.phone_no || null,
        });

        if (state.UpdateData?.state_id) {
          GetdistrictDropdown(state.UpdateData?.state_id);
        }
      }
      getStateDropdown(101);

      if (state?.filters) {
        dispatch(UpdateTableFilters(state.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Supplier`}
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
              lable="Phone Number"
              maxLength={INPUT_LENGTHS.phone}
              placeholder="Enter Phone Number"
              value={values.phone_no}
              onChange={(data) => {
                setFieldValue("phone_no", data);
              }}
              validationType={"NUMBER"}
              errorText={
                errors.phone_no && touched.phone_no ? errors.phone_no : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Latitude"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Latitude"
              value={values.latitude}
              isRequired={true}
              //   validationType="FLOAT"
              onChange={(data) => {
                setFieldValue("latitude", data);
              }}
              errorText={
                errors.latitude && touched.latitude ? errors.latitude : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Longitude"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Longitude"
              value={values.longitude}
              isRequired={true}
              //   validationType="FLOAT"
              onChange={(data) => {
                setFieldValue("longitude", data);
              }}
              errorText={
                errors.longitude && touched.longitude ? errors.longitude : ""
              }
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              placeholder="Enter Country"
              maxLength={20}
              value={"India"}
              disabled
              lable="Country"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Pin Code"
              maxLength={INPUT_LENGTHS.PinCode}
              placeholder="Enter Pin Code"
              value={values.postal_code}
              isRequired={true}
              validationType="NUMBER"
              onChange={(data) => {
                if (data.length === 6) {
                  getUserAddress(data);
                }
                setFieldValue("postal_code", data);
              }}
              errorText={
                errors.postal_code && touched.postal_code
                  ? errors.postal_code
                  : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonSelect
              lable="State"
              options={stateList}
              disabled
              placeholder="Select State"
              value={values?.state_id}
              onChange={(data, option) => {
                if (data) {
                  setdistrictError(false);
                } else {
                  setdistrictError(true);
                }
                setValues((pre) => ({
                  ...pre,
                  state_id: data,
                }));
              }}
              isRequired={true}
              errorText={
                errors.state_id && touched.state_id ? errors.state_id : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonSelect
              disabled
              lable="District"
              options={DistrictList}
              placeholder="Select District"
              value={values?.district_id}
              onChange={(data) => {
                setFieldValue("district_id", data);
              }}
              onClick={() => {
                if (!values?.country_id) {
                  setdistrictError(true);
                }
              }}
              isRequired={true}
              errorText={
                districtError
                  ? "Please select State before selecting District"
                  : errors.district_id && touched.district_id
                  ? errors.district_id
                  : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              maxLength={INPUT_LENGTHS.description}
              placeholder="Enter Address"
              value={values.address}
              disabled={type === "View"}
              onChange={(data) => {
                setFieldValue("address", data);
              }}
              validationType="PREVENT_EMOJI"
              lable="Address"
              isRequired={true}
              errorText={
                errors.address && touched.address ? errors.address : ""
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
