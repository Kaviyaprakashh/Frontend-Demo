import { useFormik } from "formik";
import * as Yup from "yup";
import { AddressProps, UserAddressProps } from "../../../@Types/ComponentProps";
import classes from "../main.module.css";
import { useEffect, useState } from "react";
import { GetToken } from "../../../Shared/StoreData";
import { Col, Row } from "antd";
import CommonCheckBox from "../../../Components/FormFields/CommonCheckBox";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  ObjectType,
} from "../../../Shared/Methods";
import {
  DeleteUserAddressService,
  DistrictDropdownService,
  GetAddressService,
  StateDropdownService,
  UpdateUserAddress,
} from "../../../Service/ApiMethods";
import { DropdownTypes } from "../../../@Types/ApiDataTypes";
import toast from "react-hot-toast";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { AddressType, INPUT_LENGTHS, REGEX } from "../../../Shared/Constants";
import CommonTextArea from "../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../Components/Buttons/CommonButton";
import useLoaderHook from "../../../Shared/UpdateLoader";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { Images } from "../../../Shared/ImageExport";
import { useLocation } from "react-router";
import CommonAlter from "../../../Components/UIComponents/CommonAlter";

const validationSchema = Yup.object().shape({
  listAddress: Yup.array().of(
    Yup.object().shape({
      address_type: Yup.string().trim().required("Address Type is Required"),
      address_1: Yup.string().trim().required("Address is Required"),
      city: Yup.string().trim().required("City is Required"),
      district_id: Yup.string().required("District is Required"),
      postal_code: Yup.string()
        .matches(REGEX.PIN_CODE, "Invalid Pin Code")
        .required("Pin Code is Required"),
      state_id: Yup.string().required("State is Required"),
    })
  ),
});
export default function ModifyAddress({
  userData,
  handleSuccess,
}: AddressProps) {
  const token = GetToken();
  const { state } = useLocation();
  const [stateList, setStateList] = useState<DropdownTypes[]>([]);
  const { isLoading } = useLoaderHook();
  const [deleteModal, setDeleteModal] = useState({ show: false, id: 0 });
  const [isEdit, setisEdit] = useState(true);
  const [DistrictList, setDistrictList] = useState<DropdownTypes[]>([]);

  const [defaultAddressError, setDefaultadressError] = useState({
    msg: "",
    show: false,
  });
  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      listAddress: [
        {
          is_default: 0,
          address_type: null,
          address_1: "",
          address_2: "",
          postal_code: "",
          city: "",
          district_id: null,
          state_id: null,
          country_id: 101,
        },
      ],
    },
    validateOnMount: true,
    validationSchema,
    onSubmit(values) {
      HandleSetDefaultAddresssError(values?.listAddress, true);
    },
  });

  const getErrors = (index: number, key: string, main_key: string) => {
    // @ts-ignore
    if (errors[main_key]?.[index]?.[key] && touched[main_key]) {
      // @ts-ignore
      return errors[main_key]?.[index]?.[key];
    } else return "";
  };

  const handleSetFiledValue = (index: number, key: string, value?: any) => {
    setFieldValue(
      "listAddress",
      values?.listAddress?.map((ele, ind) =>
        index === ind
          ? {
              ...ele,
              [key]: value,
            }
          : key === "is_default"
          ? { ...ele, [key]: 0 }
          : ele
      )
    );
  };
  const handleUpdateAddress = (values: UserAddressProps) => {
    isLoading(true);
    let finalObj = {
      token: token,
      user_id: userData.id,
      ...values,
    };
    UpdateUserAddress(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          handleSuccess();
          setisEdit(true);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const getStateDropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    StateDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data.data?.map((ele: any, index: number) => {
            return { label: ele?.name, value: ele?.id, key: index };
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

  const DeleteUserAddress = (id: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      address_id: id,
      user_id: state?.UpdateData?.id,
    };

    DeleteUserAddressService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          setDeleteModal({ show: false, id: 0 });
          handleSuccess();
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const HandleSetDefaultAddresssError = (
    finalValues: ObjectType,
    isSubmit = false
  ) => {
    const findValue = finalValues.filter((ele: any) => ele?.is_default);
    if (findValue.length > 1) {
      setDefaultadressError({
        show: true,
        msg: "Can't set multiple addresses as default address",
      });
    } else if (findValue.length === 1) {
      setDefaultadressError({ msg: "", show: false });
      if (isSubmit) {
        handleUpdateAddress(values);
      }
    } else {
      setDefaultadressError({
        msg: "Please select one address as the default address from the list of available addresses.",
        show: true,
      });
    }
  };
  const GetdistrictDropdown = (state_id?: number) => {
    let formData: any = new FormData();
    formData.append("token", token);
    if (state_id) {
      formData.append("state_id", state_id);
    }

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
  const getUserAddress = (pinCode: string, index: number) => {
    // isLoading(true);
    let formdata: any = new FormData();
    formdata.append("postal_code", pinCode);
    formdata.append("country_id", 101);

    GetAddressService(formdata)
      .then((response) => {
        if (response.data.status === 1) {
          setFieldValue(`listAddress[${index}]`, {
            ...values.listAddress[index],
            postal_code: pinCode,
            city: response.data?.city,
            district_id: response.data?.district.district_id,
            state_id: response.data?.state.state_id,
          });

          // GetdistrictDropdown(response.data?.state.state_id);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
    // .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token && userData) {
      getStateDropdown();
      GetdistrictDropdown();

      setFieldValue(
        "listAddress",
        userData?.user_address?.map((ele: any, index: number) => ({
          key: index,
          address_id: ele?.id || null,
          is_default: ele?.is_default || 0,
          address_type: ele?.address_type || null,
          address_1: ele?.address_1 || "",
          // full_address: ele?.full_address || "",
          address_2: ele?.address_2 || "",
          city: ele?.city || "",
          district_id: ele?.district_id || null,
          postal_code: ele?.postal_code || "",
          state_id: ele?.state_id || null,
          country_id: ele?.country_id || 101,
        })) || []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userData]);
  return (
    <>
      {deleteModal.show && (
        <GlobalModal
          Visible={deleteModal.show}
          OnClose={() => {
            setDeleteModal({ show: false, id: 0 });
          }}
          size={400}
        >
          <ConfirmationModal
            onClickcancelButton={() => {
              setDeleteModal({ show: false, id: 0 });
            }}
            onClickOkButton={() => {
              DeleteUserAddress(deleteModal.id);
            }}
            title="Delete"
            name="Address"
            OkButton="Delete"
            cancelButton="Cancel"
          />
        </GlobalModal>
      )}
      <div className={classes.bgContainer}>
        <div className={classes.SubheaderBlock}>
          <h3 className={classes.subHeader}>Multiple Address</h3>
          <div style={{ display: "flex", gap: 10 }}>
            {values?.listAddress.length > 0 && (
              <CommonButton
                lable={isEdit ? "Edit" : "Save"}
                handleClickEvent={() => {
                  if (isEdit) {
                    setisEdit(false);
                  } else {
                    handleSubmit();
                  }
                }}
                type={isEdit ? "edit" : "submit"}
              />
            )}

            <CommonButton
              lable="Add"
              type="modalOk"
              handleClickEvent={() => {
                setisEdit(false);
                if (errors.listAddress) {
                  setFieldTouched("listAddress", true);
                } else {
                  setFieldValue("listAddress", [
                    {
                      is_default: values?.listAddress?.length <= 0 ? 1 : 0,
                      address_type: null,
                      address_1: "",
                      address_2: "",
                      city: "",
                      district_id: null,
                      postal_code: "",
                      state_id: null,
                      country_id: 101,
                    },
                    ...values.listAddress,
                  ]);
                }
              }}
            />
          </div>
        </div>
        {defaultAddressError.show && (
          <CommonAlter
            msg={defaultAddressError.msg}
            type="error"
            style={{ marginTop: "10px" }}
          />
        )}
        <div className={classes.userAddresContainer}>
          {values.listAddress?.map((ele: any, index) => {
            return (
              <Row
                key={index}
                gutter={[16, 16]}
                className={`${classes.UserAddresBox}`}
              >
                <Col xs={24}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexFlow: "wrap",
                    }}
                  >
                    <div className={classes.checkBoxStyle}>
                      <CommonCheckBox
                        checked={ele.is_default === 1 ? true : false}
                        disabled={isEdit}
                        onChange={() => {
                          handleSetFiledValue(
                            index,
                            "is_default",
                            ele.is_default === 1 ? 0 : 1
                          );
                          let finalValues = values.listAddress?.map(
                            (ele, ind) => ({
                              ...ele,
                              is_default:
                                ind === index
                                  ? ele.is_default === 1
                                    ? 0
                                    : 1
                                  : 0,
                            })
                          );

                          HandleSetDefaultAddresssError(finalValues);
                        }}
                      />
                      <p className="Label">is Default ?</p>
                    </div>

                    {isEdit && !ele?.is_default && (
                      <div
                        className={classes.removeBtn}
                        onClick={() => {
                          if (ele?.address_id) {
                            setDeleteModal({ show: true, id: ele?.address_id });
                          } else {
                            setFieldValue(
                              "listAddress",
                              values?.listAddress?.filter(
                                (ele, ind) => ind !== index
                              )
                            );
                          }
                        }}
                      >
                        <img src={Images.TRASH_ICON} alt="Trash Icon" />
                      </div>
                    )}
                  </div>
                </Col>
                {/* <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <div className={classes.defaultBlock}>
                    <p></p>
                    <div>
                      <div>
                        <CommonCheckBox
                          checked={ele.is_default === 1 ? true : false}
                          disabled={isEdit}
                          onChange={() => {
                            handleSetFiledValue(
                              index,
                              "is_default",
                              ele.is_default === 1 ? 0 : 1
                            );
                            let finalValues = values.listAddress?.map(
                              (ele, ind) =>
                                ind === index
                                  ? {
                                      ...ele,
                                      is_default: ele.is_default === 1 ? 0 : 1,
                                    }
                                  : ele
                            );

                            HandleSetDefaultAddresssError(finalValues);
                          }}
                        />
                        <p className="Label">is Default ?</p>
                      </div>
                    </div>
                    {getErrors(index, "is_default", "listAddress") ? (
                      <p className="ErroText">
                        {getErrors(index, "is_default", "listAddress")}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </Col> */}
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonInput
                    lable="Country"
                    maxLength={20}
                    placeholder="Enter Country"
                    disabled
                    value={"India"}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonInput
                    lable="Pin Code"
                    disabled={isEdit}
                    validationType={"NUMBER"}
                    maxLength={INPUT_LENGTHS.PinCode}
                    placeholder="Enter Pin Code"
                    value={ele.postal_code}
                    isRequired={true}
                    onChange={(data) => {
                      if (data.length === 6) {
                        handleSetFiledValue(index, "postal_code", data);
                        getUserAddress(data, index);
                      } else {
                        setFieldValue(`listAddress[${index}]`, {
                          ...ele,
                          postal_code: data,
                          city: "",
                          district_id: null,
                          state_id: null,
                        });
                      }
                    }}
                    errorText={getErrors(index, "postal_code", "listAddress")}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonSelect
                    lable="State"
                    options={stateList}
                    // disabled={isEdit}
                    disabled
                    placeholder="Select State"
                    value={ele?.state_id}
                    optionName={ele?.state}
                    onChange={(data) => {
                      handleSetFiledValue(index, "state_id", data);
                    }}
                    isRequired={true}
                    errorText={getErrors(index, "state_id", "listAddress")}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonSelect
                    lable="District"
                    // disabled={isEdit}
                    disabled
                    placeholder="Enter District"
                    value={ele.district_id}
                    onChange={(data) => {
                      handleSetFiledValue(index, "district_id", data);
                    }}
                    onKeyDown={() => {
                      setFieldTouched("district_id", true);
                    }}
                    options={DistrictList}
                    isRequired={true}
                    errorText={getErrors(index, "district_id", "listAddress")}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonInput
                    lable="City"
                    disabled={isEdit}
                    maxLength={INPUT_LENGTHS.Name}
                    placeholder="Enter City"
                    value={ele.city}
                    isRequired={true}
                    onChange={(data) => {
                      handleSetFiledValue(index, "city", data);
                    }}
                    validationType="PREVENT_SPECIAL_CHAR"
                    onKeyDown={() => {
                      setFieldTouched("city", true);
                    }}
                    errorText={getErrors(index, "city", "listAddress")}
                  />
                </Col>
                {/* <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonInput
                    lable="Taluk"
                    disabled={isEdit}
                    maxLength={INPUT_LENGTHS.Name}
                    placeholder="Enter Taluk"
                    value={ele.taluk}
                    isRequired={true}
                    validationType="PREVENT_SPECIAL_CHAR"
                    onChange={(data) => {
                      handleSetFiledValue(index, "taluk", data);
                    }}
                    errorText={getErrors(index, "taluk", "listAddress")}
                  />
                </Col> */}

                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonSelect
                    lable="Address Type"
                    disabled={isEdit}
                    options={AddressType}
                    isRequired={true}
                    placeholder="Select Address Type"
                    value={ele?.address_type}
                    onChange={(data) => {
                      handleSetFiledValue(index, "address_type", data);
                    }}
                    errorText={getErrors(index, "address_type", "listAddress")}
                  />
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonTextArea
                    maxLength={INPUT_LENGTHS.description}
                    placeholder="Enter Address"
                    disabled={isEdit}
                    value={ele.address_1}
                    onChange={(data) => {
                      handleSetFiledValue(index, "address_1", data);
                    }}
                    lable="Address 1"
                    isRequired={true}
                    errorText={getErrors(index, "address_1", "listAddress")}

                    // errorText={
                    //   errors.address_1 && touched.address_1 ? errors.address_1 : ""
                    // }
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonTextArea
                    maxLength={INPUT_LENGTHS.description}
                    placeholder="Enter Address"
                    disabled={isEdit}
                    value={ele.address_2}
                    onChange={(data) => {
                      handleSetFiledValue(index, "address_2", data);
                    }}
                    lable="Address 2"
                  />
                </Col>
                {/* <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                  <CommonTextArea
                    maxLength={INPUT_LENGTHS.description}
                    placeholder="Enter Full Address"
                    disabled={isEdit}
                    value={ele.full_address}
                    onChange={(data) => {
                      handleSetFiledValue(index, "full_address", data);
                    }}
                    lable="Full Address"
                  />
                </Col> */}
              </Row>
            );
          })}
        </div>
      </div>
    </>
  );
}
