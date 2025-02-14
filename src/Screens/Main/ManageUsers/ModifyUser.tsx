import { useEffect, useRef, useState } from "react";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import { UserProps } from "../../../@Types/ComponentProps";
import { useLocation, useNavigate } from "react-router";
import { useFormik } from "formik";
import classes from "../main.module.css";
import { Col, Row } from "antd";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { AddressType, INPUT_LENGTHS, REGEX } from "../../../Shared/Constants";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import CommonTextArea from "../../../Components/FormFields/CommonTextArea";
import CommonFileInput from "../../../Components/FormFields/CommonFileInput";
import CommonButton from "../../../Components/Buttons/CommonButton";
import {
  ConvertJSONtoFormData,
  FilterValidObj,
  getCatchMsg,
  getUserTabName,
} from "../../../Shared/Methods";
import { GetToken } from "../../../Shared/StoreData";
import {
  CreateUserService,
  DistrictDropdownService,
  GetAddressService,
  priceNameDropdownService,
  StateDropdownService,
  UpdateUserService,
  UserDropdownService,
  ViewUserService,
} from "../../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import * as Yup from "yup";
import CommonCheckBox from "../../../Components/FormFields/CommonCheckBox";
import { DropdownTypes } from "../../../@Types/ApiDataTypes";
import ModifyAddress from "./ModifyAddress";

import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";

export default function ModifyUser() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type, usertype } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef: any = useRef();
  let dispatch = useAppDispatch();
  const [DistrictList, setDistrictList] = useState<DropdownTypes[]>([]);
  const [districtError, setDistrictError] = useState(false);
  const [stateList, setStateList] = useState<DropdownTypes[]>([]);
  const [executiveList, setExecutiveList] = useState<DropdownTypes[]>([]);
  const [PriceNameList, setPriceNameList] = useState<DropdownTypes[]>([]);

  const [userData, setUserData] = useState<any>(null);
  const validationSchema = Yup.object().shape({
    // executive_ref_id:
    //   usertype === 4
    //     ? Yup.string().required("Executive is Required")
    //     : Yup.string().notRequired(),
    username:
      usertype === 5 || usertype === 4
        ? Yup.string()
            .min(3, "Username is too short")
            .trim("Please remove leading and trailing spaces")
            .strict(true)
            .optional()
        : Yup.string()
            .min(3, "Username is too short")
            .trim("Please remove leading and trailing spaces")
            .strict(true)
            .required("Username is Required"),
    firstName: Yup.string()
      .trim("Please remove leading and trailing spaces")
      .strict(true)
      .required("First Name is Required"),
    phone: Yup.string()
      .matches(REGEX.MobileNo, "Mobile Number is invalid")
      .required("Phone Number is Required"),
    phone2: Yup.string()
      .matches(REGEX.MobileNo, "Mobile Number is invalid")
      .nullable(),
    email: Yup.string()
      .matches(REGEX.EMAIL, "Email is invalid")
      .required("Email is Required"),
    email2: Yup.string().matches(REGEX.EMAIL, "Email is invalid").nullable(),
    type: Yup.boolean().required(),

    fax: Yup.string()
      .matches(/^[0-9-+()\s]+$/, "Invalid fax number format")
      .min(10, "Fax number is too short")
      .max(15, "Fax number is too long"),
    landline: Yup.string()
      .matches(/^[0-9+()-\s]+$/, "Invalid landline number format")
      .min(7, "Landline number is too short")
      .max(15, "Landline number is too long"),

    password: Yup.string().when("type", {
      is: true,
      then: () =>
        Yup.string()
          .trim()
          .min(3, "Password is too short")
          .required("Password is Required"),
    }),

    address_type: Yup.string().when("type", {
      is: true,
      then: () => Yup.string().required("Address Type is Required"),
      otherwise: () => Yup.string().notRequired(),
    }),

    address_1: Yup.string()
      .trim()
      .when("type", {
        is: true,
        then: () => Yup.string().trim().required("Address is Required"),
        otherwise: () => Yup.string().notRequired(),
      }),

    city: Yup.string().when("type", {
      is: true,
      then: () => Yup.string().trim().required("City is Required"),
      otherwise: () => Yup.string().notRequired(),
    }),

    district_id: Yup.string().when("type", {
      is: true,
      then: () => Yup.string().required("District is Required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    postal_code: Yup.string().when("type", {
      is: true,
      then: () =>
        Yup.string()
          .matches(REGEX.PIN_CODE, "Invalid Pin Code")
          .required("Pin Code is Required"),
    }),

    state_id: Yup.string().when("type", {
      is: true,
      then: () => Yup.string().trim().required("State is Required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    pan: Yup.string().matches(REGEX.PAN, "Invalid Pan Number"),
    is_default: Yup.string().when("type", {
      is: true,
      then: () => Yup.string().required("is Default Required"),
      otherwise: () => Yup.string().trim().notRequired(),
    }),
    gst: Yup.string().matches(REGEX.GST_IN, "Invalid GSTIN").nullable(),
    ifsc_code: Yup.string().matches(REGEX.IFSC_regex, "Invalid IFSC Code"),
    account_number: Yup.string()
      .matches(/^[0-9]+$/, "Account number must be numeric")
      .min(10, "Account number must be at least 10 digits")
      .max(16, "Account number must be at most 16 digits"),
  });
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        type: state.UpdateData ? false : true,
        username: "",
        firstName: "",
        lastName: "",
        executive_ref_id: null,
        executive_name: "",
        engineer_ref_id: "",
        show_reward: null,
        phone: "",
        email: "",
        password: "",
        address_type: null,
        address_1: "",
        address_2: "",
        city: "",
        district_id: null,
        postal_code: "",
        state_id: null,
        country_id: 101,
        is_default: 1,
        email2: "",
        phone2: "",
        landline: "",
        fax: "",
        gst: "",
        pan: "",
        img_path: "",
        price_name_id: null,

        // Bank Account
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        bank_name: "",
        bank_branch: "",
      },
      validateOnMount: true,
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateUser(values);
        } else if (type === "Update") {
          handleUpdateUser(values);
        }
      },
    });

  const handleCreateUser = (values: UserProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      usertype: usertype,
      username: usertype !== 4 && usertype !== 5 ? values?.username : "",
      img_path: typeof values.img_path === "string" ? "" : values?.img_path,
      executive_name: "",
    });
    CreateUserService(finalObj)
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

  const handleUpdateUser = (values: UserProps) => {
    isLoading(true);
    const finalObj = FilterValidObj({
      token: token,
      userId: state?.UpdateData?.id,
      img_path: typeof values.img_path === "string" ? "" : values?.img_path,
      usertype: usertype,
      username: usertype !== 4 && usertype !== 5 ? values.username || "" : "",
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      phone: values.phone || "",
      email: values.email || "",
      password: values.password || "",
      email2: values.email2 || "",
      phone2: values.phone2 || "",
      landline: values.landline || "",
      fax: values.fax || "",
      gst: values.gst || "",
      pan: values.pan || "",
      price_name_id: values?.price_name_id || null,
      executive_ref_id: values?.executive_ref_id || null,

      // Bank Account
      account_holder_name: values?.account_holder_name || "",
      account_number: values?.account_number || "",
      ifsc_code: values?.ifsc_code || "",
      bank_name: values?.bank_name || "",
      bank_branch: values?.bank_branch || "",
      executive_name: "",
    });
    UpdateUserService(ConvertJSONtoFormData(finalObj))
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
      ...values,
      username: editData?.username || "",
      firstName: editData?.first_name || "",
      lastName: editData?.last_name || "",
      executive_ref_id: editData?.executive_ref_id || null,
      engineer_ref_id: editData?.engineer_ref_id || "",
      phone: editData?.phone || "",
      email: editData?.email || "",
      password: editData?.password || "",
      address_type: editData?.address_type || null,
      address_1: editData?.address_1 || "",
      address_2: editData?.address_2 || "",
      city: editData?.city || "",
      district_id: editData?.district_id || null,
      postal_code: editData?.postal_code || "",
      state_id: editData?.state_id || null,
      country_id: editData?.country_id || 101,
      is_default: editData?.is_default || 0,
      email2: editData?.email2 || "",
      phone2: editData?.phone2 || "",
      landline: editData?.landline || "",
      gst: editData?.gst || "",
      fax: editData?.fax || "",
      pan: editData?.pan || "",
      img_path: editData?.img_path || "",
      executive_name: editData?.executive_name || "",
      price_name_id: editData?.price_name_id || null,

      // Bank Account
      account_holder_name:
        editData?.user_accounts[0]?.account_holder_name || "",
      account_number: editData?.user_accounts[0]?.account_number || "",
      ifsc_code: editData?.user_accounts[0]?.ifsc_code || "",
      bank_name: editData?.user_accounts[0]?.bank_name || "",
      bank_branch: editData?.user_accounts[0]?.bank_branch || "",
    });
  };

  const getStateDropdown = () => {
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

  const getViewUser = () => {
    isLoading(true);
    let finalObj = { token: token, user_id: state?.UpdateData?.id };
    ViewUserService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setUserData(response.data.data);
          handleUpdateData(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const GetdistrictDropdown = (state_id: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("state_id", state_id);

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
            city: response.data?.city,
          }));

          GetdistrictDropdown(response.data?.state.state_id);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
    // .finally(() => isLoading(false));
  };
  const getExecutiveDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("user_type", 3);

    UserDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response?.data?.data?.map((ele: any) => ({
            label: `${ele?.first_name} (${ele?.email ?? ele?.phone})`,
            value: ele?.id,
          }));
          setExecutiveList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const getPriceTagDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("user_type", 3);

    priceNameDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response?.data?.data?.map((ele: any) => ({
            label: ele?.title,
            value: ele?.id,
          }));
          setPriceNameList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      getExecutiveDropdown();
      if (type === "Create") {
        getStateDropdown();
      }
      getPriceTagDropdown();
      if (state?.UpdateData) {
        getViewUser();
      }
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className={classes.MainViewContainer}>
      <ScreenHeader
        name={`${state?.type} ${getUserTabName(usertype)}`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]}>
          {usertype === 4 && (
            <>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonSelect
                  lable="Executive"
                  placeholder="Select Executive"
                  value={values.executive_ref_id}
                  optionName={values?.executive_name}
                  disabled={state?.UpdateData?.executive_ref_id ? true : false}
                  onChange={(data) => {
                    setFieldValue("executive_ref_id", data);
                  }}
                  allowClear
                  options={executiveList}
                />
              </Col>
            </>
          )}
          {usertype !== 4 && usertype !== 5 && (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <CommonInput
                lable="Username"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Username"
                value={values.username}
                isRequired={true}
                validationType="ALPHA_NUMERIC"
                onChange={(data) => {
                  setFieldValue("username", data);
                }}
                errorText={
                  errors.username && touched.username ? errors.username : ""
                }
              />
            </Col>
          )}
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="First Name"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter First Name"
              value={values.firstName}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("firstName", data);
              }}
              errorText={
                errors.firstName && touched.firstName ? errors.firstName : ""
              }
              validationType="CHAR_AND_SPACE"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Last Name"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Last Name"
              value={values.lastName}
              onChange={(data) => {
                setFieldValue("lastName", data);
              }}
              validationType="CHAR_AND_SPACE"
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
              lable="Alternate Phone Number"
              maxLength={INPUT_LENGTHS.phone}
              placeholder="Enter Alternate Phone Number"
              value={values.phone2}
              onChange={(data) => {
                setFieldValue("phone2", data);
              }}
              validationType={"NUMBER"}
              errorText={errors.phone2 && touched.phone2 ? errors.phone2 : ""}
            />
          </Col>
          {usertype !== 5 && (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <CommonInput
                lable="Landline"
                maxLength={INPUT_LENGTHS.Landline}
                placeholder="Enter Landline"
                value={values.landline}
                onChange={(data) => {
                  setFieldValue("landline", data);
                }}
                validationType={"NUMBER"}
                errorText={
                  errors.landline && touched.landline ? errors.landline : ""
                }
              />
            </Col>
          )}
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Email"
              maxLength={INPUT_LENGTHS.email}
              placeholder="Enter Email"
              value={values.email}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("email", data);
              }}
              errorText={errors.email && touched.email ? errors.email : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Email"
              maxLength={INPUT_LENGTHS.email}
              placeholder="Enter Alternate Email"
              value={values.email2}
              onChange={(data) => {
                setFieldValue("email2", data);
              }}
              errorText={errors.email2 && touched.email2 ? errors.email2 : ""}
            />
          </Col>
          {usertype !== 5 && (
            <>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Pan"
                  maxLength={INPUT_LENGTHS.pan}
                  placeholder="Enter Pan"
                  value={values.pan}
                  onChange={(data) => {
                    setFieldValue("pan", data);
                  }}
                  errorText={errors.pan && touched.pan ? errors.pan : ""}
                  validationType="ALPHA_NUMERIC"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="GSTIN"
                  maxLength={INPUT_LENGTHS.gstIn}
                  placeholder="Enter GSTIN"
                  value={values?.gst}
                  validationType="ALPHA_NUMERIC"
                  onChange={(data) => {
                    setFieldValue("gst", data);
                  }}
                  errorText={errors.gst && touched.gst ? errors.gst : ""}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Fax"
                  maxLength={INPUT_LENGTHS.Fax}
                  placeholder="Enter Fax"
                  value={values.fax}
                  onChange={(data) => {
                    setFieldValue("fax", data);
                  }}
                  errorText={errors.fax && touched.fax ? errors.fax : ""}
                />
              </Col>
            </>
          )}
          {type === "Create" && (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <CommonInput
                lable="Password"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Password"
                value={values.password}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("password", data);
                }}
                errorText={
                  errors.password && touched.password ? errors.password : ""
                }
              />
            </Col>
          )}
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
                FileRef.current.value = null;
              }}
              Clearable={type === "Create"}
              imagePath={values.img_path}
            />
          </Col>
          {usertype === 4 && (
            <>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonSelect
                  lable="Price Name"
                  placeholder="Select Price Name"
                  value={values.price_name_id}
                  onChange={(data) => {
                    setFieldValue("price_name_id", data);
                  }}
                  options={PriceNameList}
                  allowClear
                />
              </Col>
            </>
          )}
          {usertype === 4 && (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <div className={classes.defaultBlock}>
                <p></p>
                <div>
                  <div>
                    <CommonCheckBox
                      checked={values.show_reward ? true : false}
                      onChange={() => {
                        setFieldValue(
                          "show_reward",
                          values.show_reward ? 0 : 1
                        );
                      }}
                    />
                    <p className="Label">Show Rewards ?</p>
                  </div>
                </div>
                {errors.show_reward && touched.show_reward ? (
                  <p className="ErroText">{errors.show_reward}</p>
                ) : (
                  ""
                )}
              </div>
            </Col>
          )}
        </Row>
        {type === "Create" && (
          <div style={{ marginTop: "25px" }}>
            <p className={classes.subHeader}>Address Details</p>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <div className={classes.defaultBlock}>
                  <p></p>
                  <div>
                    <div>
                      <CommonCheckBox
                        checked={values.is_default ? true : false}
                        onChange={() => {
                          setFieldValue(
                            "is_default",
                            values.is_default ? 0 : 1
                          );
                        }}
                      />
                      <p className="Label">is Default ?</p>
                    </div>
                  </div>
                  {errors.is_default && touched.is_default ? (
                    <p className="ErroText">{errors.is_default}</p>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  disabled
                  lable="Country"
                  value={"India"}
                  maxLength={10}
                  placeholder="Select Country"
                  isRequired={true}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Pin Code"
                  validationType={"NUMBER"}
                  maxLength={INPUT_LENGTHS.PinCode}
                  placeholder="Enter Pin Code"
                  value={values.postal_code}
                  isRequired={true}
                  onChange={(data) => {
                    if (data.length === 6) {
                      getUserAddress(data);
                    } else {
                      setValues((pre) => ({
                        ...pre,
                        state_id: null,
                        district_id: null,
                        city: "",
                      }));
                    }
                    setFieldValue("postal_code", data);
                  }}
                  handleSubmit={() =>
                    values.postal_code.length === 6 &&
                    getUserAddress(values.postal_code)
                  }
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
                  onChange={(data) => {
                    if (data) {
                      setDistrictError(false);
                    }
                    setFieldValue("state_id", data);
                  }}
                  isRequired={true}
                  errorText={
                    errors.state_id && touched.state_id ? errors.state_id : ""
                  }
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonSelect
                  lable="District"
                  placeholder="Select District"
                  value={values.district_id}
                  disabled
                  onChange={(data) => {
                    setFieldValue("district_id", data);
                  }}
                  onClick={() => {
                    if (!values.state_id) {
                      setDistrictError(true);
                    }
                  }}
                  options={DistrictList}
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
                <CommonInput
                  lable="City"
                  maxLength={INPUT_LENGTHS.Name}
                  placeholder="Enter City"
                  value={values.city}
                  validationType="CHAR_AND_SPACE"
                  isRequired={true}
                  onChange={(data) => {
                    setFieldValue("city", data);
                  }}
                  errorText={errors.city && touched.city ? errors.city : ""}
                />
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonSelect
                  lable="Address Type"
                  options={AddressType}
                  isRequired={true}
                  placeholder="Select Address Type"
                  value={values?.address_type}
                  onChange={(data) => {
                    setFieldValue("address_type", data);
                  }}
                  errorText={
                    errors.address_type && touched.address_type
                      ? errors.address_type
                      : ""
                  }
                />
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonTextArea
                  maxLength={INPUT_LENGTHS.description}
                  placeholder="Enter Address"
                  value={values.address_1}
                  onChange={(data) => {
                    setFieldValue("address_1", data);
                  }}
                  lable="Address 1"
                  isRequired={true}
                  errorText={
                    errors.address_1 && touched.address_1
                      ? errors.address_1
                      : ""
                  }
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonTextArea
                  maxLength={INPUT_LENGTHS.description}
                  placeholder="Enter Address"
                  value={values.address_2}
                  onChange={(data) => {
                    setFieldValue("address_2", data);
                  }}
                  lable="Address 2"
                />
              </Col>
            </Row>
          </div>
        )}
        {type === "Update" && usertype !== 2 && (
          <div style={{ marginTop: "25px" }}>
            <h3 className={classes.subHeader}>Bank Details</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Account Holder Name"
                  maxLength={INPUT_LENGTHS.Name}
                  placeholder="Enter Account Holder Name"
                  value={values.account_holder_name}
                  onChange={(data) => {
                    setFieldValue("account_holder_name", data);
                  }}
                  validationType="CHAR_AND_SPACE"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Account Number"
                  maxLength={INPUT_LENGTHS.accountNo}
                  placeholder="Enter Account Number"
                  value={values.account_number}
                  onChange={(data) => {
                    setFieldValue("account_number", data);
                  }}
                  validationType={"NUMBER"}
                  errorText={
                    errors.account_number && touched.account_number
                      ? errors.account_number
                      : ""
                  }
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="IFSC CODE"
                  maxLength={INPUT_LENGTHS.ifsccode}
                  placeholder="Enter IFSC Code"
                  value={values.ifsc_code}
                  onChange={(data) => {
                    setFieldValue("ifsc_code", data);
                  }}
                  validationType="ALPHA_NUMERIC"
                  errorText={
                    errors.ifsc_code && touched.ifsc_code
                      ? errors.ifsc_code
                      : ""
                  }
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Bank Name"
                  maxLength={INPUT_LENGTHS.Name}
                  placeholder="Enter Bank Name"
                  value={values.bank_name}
                  onChange={(data) => {
                    setFieldValue("bank_name", data);
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <CommonInput
                  lable="Bank Branch"
                  maxLength={INPUT_LENGTHS.Name}
                  placeholder="Enter Bank Branch"
                  value={values.bank_branch}
                  onChange={(data) => {
                    setFieldValue("bank_branch", data);
                  }}
                />
              </Col>
            </Row>
          </div>
        )}
        <Col xs={24}>
          <CommonButton
            type="submit"
            isright={true}
            lable={type}
            handleClickEvent={() => handleSubmit()}
          />
        </Col>
      </div>

      {type === "Update" && (
        <>
          <ModifyAddress
            userData={userData}
            handleSuccess={() => getViewUser()}
          />
        </>
      )}
    </div>
  );
}
