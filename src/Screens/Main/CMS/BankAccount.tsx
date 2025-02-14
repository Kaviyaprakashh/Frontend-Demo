import { useEffect, useState } from "react";
import { GetToken } from "../../../Shared/StoreData";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../Shared/Methods";
import {
  CreateBankAccountService,
  UpdateBankAccountService,
  ViewBankAccountService,
} from "../../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { Col, Row } from "antd";
import { INPUT_LENGTHS, REGEX } from "../../../Shared/Constants";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { useFormik } from "formik";
import { BankAccountProps } from "../../../@Types/ComponentProps";
import * as Yup from "yup";
import { AccessPermissionObject } from "../../../@Types/accesspermission";
const validationSchema = Yup.object().shape({
  ifscCode: Yup.string().matches(REGEX.IFSC_regex, "Invalid IFSC Code"),
  accountNo: Yup.string()
    .matches(/^[0-9]+$/, "Account number must be numeric")
    .min(10, "Account number must be at least 10 digits")
    .max(16, "Account number must be at most 16 digits")
    .required("Account number is required"),
  swiftCode: Yup.string().matches(REGEX.SWIFT_CODE, "Invalid Swift Code"),
});

export default function BankAccount() {
  const token = GetToken();
  const [bankData, setBankData] = useState<any>({});
  const { isLoading } = useLoaderHook();
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const { values, errors, touched, setValues, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        bankName: "",
        bankBranch: "",
        accountName: "",
        accountNo: "",
        ifscCode: "",
        swiftCode: "",
      },
      validationSchema,
      onSubmit: (values) => {
        if (Object.entries(bankData).length <= 0) {
          handleCreateBankAccount(values);
        } else {
          handleUpdateBankAccount(values);
        }
      },
    });
  const getViewBankAccount = () => {
    isLoading(true);
    let finalObj = { token };
    ViewBankAccountService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalData = response?.data?.data;

          setValues({
            bankName: finalData?.bank_name || "",
            bankBranch: finalData?.bank_branch || "",
            accountName: finalData?.account_name || "",
            accountNo: finalData?.account_no || "",
            ifscCode: finalData?.ifsc_code || "",
            swiftCode: finalData?.swift_code || "",
          });
          setBankData(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const handleCreateBankAccount = (values: BankAccountProps) => {
    isLoading(true);
    let finalObj = {
      token,
      ...values,
    };
    CreateBankAccountService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          getViewBankAccount();
          toast.success(response.data.msg);
        } else {
          toast.error(response.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const handleUpdateBankAccount = (values: BankAccountProps) => {
    isLoading(true);
    let finalObj = {
      token,
      ...values,
      bankAccountId: bankData.bankAccountId,
    };
    UpdateBankAccountService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          getViewBankAccount();
          toast.success(response.data.msg);
        } else {
          toast.error(response.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      getViewBankAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <ScreenHeader name="Bank Account" />
      <div className={classes.bgContainer}>
        <Row gutter={[10, 16]}>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Bank Name"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Bank Name"
              value={values.bankName}
              onChange={(data) => {
                setFieldValue("bankName", data);
              }}
              validationType="PREVENT_EMOJI"
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Branch"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Branch"
              value={values.bankBranch}
              onChange={(data) => {
                setFieldValue("bankBranch", data);
              }}
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
              validationType="PREVENT_EMOJI"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Account Name"
              maxLength={INPUT_LENGTHS.Name}
              placeholder="Enter Account Name"
              value={values.accountName}
              onChange={(data) => {
                setFieldValue("accountName", data);
              }}
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
              validationType="CHAR_AND_SPACE"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Account No"
              maxLength={INPUT_LENGTHS.accountNo}
              placeholder="Enter Account No"
              value={values.accountNo}
              validationType={"NUMBER"}
              onChange={(data) => {
                setFieldValue("accountNo", data);
              }}
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
              errorText={
                errors.accountNo && touched.accountNo ? errors.accountNo : ""
              }
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="IFSC Code"
              maxLength={INPUT_LENGTHS.ifsccode}
              placeholder="Enter IFSC Code"
              value={values.ifscCode}
              validationType="ALPHA_NUMERIC"
              onChange={(data) => {
                setFieldValue("ifscCode", data);
              }}
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
              errorText={
                errors.ifscCode && touched.ifscCode ? errors.ifscCode : ""
              }
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Swift Code"
              maxLength={INPUT_LENGTHS.ifsccode}
              validationType="ALPHA_NUMERIC"
              placeholder="Enter Swift Code"
              value={values.swiftCode}
              disabled={
                permission?.cms?.bank_account?.edit_bank_account ? false : true
              }
              onChange={(data) => {
                setFieldValue("swiftCode", data);
              }}
              errorText={
                errors.swiftCode && touched.swiftCode ? errors.swiftCode : ""
              }
            />
          </Col>
          {permission?.cms?.bank_account?.edit_bank_account ? (
            <Col xs={24}>
              <CommonButton
                lable="Submit"
                handleClickEvent={() => {
                  handleSubmit();
                }}
              />
            </Col>
          ) : (
            ""
          )}
        </Row>
      </div>
    </div>
  );
}
