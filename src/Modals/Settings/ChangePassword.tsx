import { Col, Row } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import CommonInput from "../../Components/FormFields/CommonInput";
import {
  ChangePasswordProps,
  PasswordModalProps,
} from "../../@Types/ModalProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import { ChangePasswordService } from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import ModalButton from "../../Components/UIComponents/ModalButton";

export default function ChangePasswordModal({
  OnClose,
  id,
  handleSuccess,
  isUser,
}: PasswordModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();

  const validationSchema = Yup.object().shape({
    currentpassword: isUser
      ? Yup.string()
      : Yup.string().trim().required("Password is Required"),
    newpassword: Yup.string().trim().required("New password is required"),
    confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newpassword")], "Passwords must match")
      .trim()
      .strict(true),
  });

  const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      currentpassword: "",
      newpassword: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit(values) {
      handleChangePassword(values);
    },
  });
  const handleChangePassword = (values: ChangePasswordProps) => {
    isLoading(true);
    const finalObj = {
      currentpassword: isUser ? "" : values.currentpassword,
      [isUser ? "password" : "newpassword"]: values.newpassword,
      token: token,
      user_id: id,
    };
    ChangePasswordService(
      ConvertJSONtoFormData(finalObj),
      isUser ? "changeUserPassword" : "changepassword"
    )
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          OnClose();
          handleSuccess?.();
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

  return (
    <Row gutter={[16, 16]}>
      {!isUser && (
        <Col xs={24}>
          <CommonInput
            maxLength={10}
            placeholder="Enter Old Password"
            lable="Old Password"
            value={values.currentpassword}
            isRequired={true}
            isPassword={true}
            validationType="PREVENT_EMOJI"
            onChange={(data) => setFieldValue("currentpassword", data)}
            errorText={
              errors?.currentpassword && touched.currentpassword
                ? errors.currentpassword
                : ""
            }
          />
        </Col>
      )}
      <Col xs={24}>
        <CommonInput
          maxLength={10}
          placeholder="Enter New Password"
          lable="New Password"
          value={values.newpassword}
          isRequired={true}
          isPassword={true}
          validationType="PREVENT_EMOJI"
          onChange={(data) => setFieldValue("newpassword", data)}
          errorText={
            errors?.newpassword && touched.newpassword ? errors.newpassword : ""
          }
        />
      </Col>
      <Col xs={24}>
        <CommonInput
          maxLength={10}
          placeholder="Enter Confirm Password"
          lable="Confirm Password"
          value={values.confirm_password}
          isRequired={true}
          isPassword={true}
          validationType="PREVENT_EMOJI"
          onChange={(data) => setFieldValue("confirm_password", data)}
          errorText={
            errors?.confirm_password && touched.confirm_password
              ? errors.confirm_password
              : ""
          }
        />
      </Col>
      <ModalButton lable={"Submit"} handleSubmit={handleSubmit} />
    </Row>
  );
}
