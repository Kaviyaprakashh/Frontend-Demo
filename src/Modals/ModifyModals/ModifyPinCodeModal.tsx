import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Col, Row } from "antd";
import { useEffect } from "react";

import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS, REGEX } from "../../Shared/Constants";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreatePinCodeService,
  UpdatePinCodeService,
} from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import { PinCodeFilterProps } from "../../@Types/FiltersTypes";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  pincodeNo: Yup.string()
    .matches(REGEX.PIN_CODE, "Invalid Pin Code")
    .required("Pin Code is Required"),
});

export default function ModifyPinCodeModal({
  type,
  UpdateData,
  OnClose,
  handleSuccess,
}: GlobalModifyModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues: {
        pincodeNo: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreatePinCode(values);
        } else {
          handleUpdatePinCode(values);
        }
      },
    });

  const handleCreatePinCode = (values: PinCodeFilterProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreatePinCodeService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          handleSuccess();
          OnClose();
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

  const handleUpdatePinCode = (values: PinCodeFilterProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      pincodeId: UpdateData?.pincodeId,
    };
    UpdatePinCodeService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          handleSuccess();
          OnClose();
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
      if (UpdateData) {
        setValues({
          pincodeNo: UpdateData?.pincodeNo || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      <Row gutter={[16, 16]} align={"top"}>
        <Col xs={24}>
          <CommonInput
            lable="Pin Code"
            maxLength={INPUT_LENGTHS.PinCode}
            placeholder="Enter Pin Code"
            value={values?.pincodeNo}
            onChange={(data) => {
              setFieldValue("pincodeNo", data);
            }}
            validationType={"NUMBER"}
            isRequired={true}
            errorText={
              errors.pincodeNo && touched.pincodeNo ? errors.pincodeNo : ""
            }
          />
        </Col>
        <ModalButton lable={type} handleSubmit={handleSubmit} />
      </Row>
    </>
  );
}
