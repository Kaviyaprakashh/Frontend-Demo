import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SALT_KEY } from "../../Service/ServiceConstants";
import classes from "./Auth.module.css";
import { setSessionStorageData } from "../../Store/Storage";
import InputBox from "../../Components/FormFields/CommonInput";
import CommonButton from "../../Components/Buttons/CommonButton";
import { Images } from "../../Shared/ImageExport";
import { UpdateUserToken } from "../../Store/Rudux/Reducer/MainReducer";
import {
  ConvertJSONtoFormData,
  EncryptData,
  getCatchMsg,
} from "../../Shared/Methods";
import { SignInTypes } from "../../@Types/ApiDataTypes";
import {
  CheckCaptchaService,
  UserLoginService,
} from "../../Service/ApiMethods";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import useLoaderHook from "../../Shared/UpdateLoader";
import { useAppDispatch } from "../../Store/Rudux/Config/Hooks";

const validationSchema = Yup.object().shape({
  username: Yup.string().trim().required("Username is Required"),
  password: Yup.string().trim().required("Password is Required"),
});
export default function SignIn() {
  let dispatch = useAppDispatch();
  const { isLoading } = useLoaderHook();
  let navigate = useNavigate();
  var sha1 = require("sha1");
  const [token, settoken] = useState(false);
  const captchRef: any = useRef(null);
  const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit(values) {
      // if (token && captchRef.current.getValue()) {
      handleUserLogin(values);
      // }
    },
  });

  const handleUserLogin = (values: SignInTypes) => {
    isLoading(true);
    let finalObj = {
      ...values,
      authcode: sha1(SALT_KEY + values.username),
      device_type: 3,
    };
    UserLoginService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          dispatch(UpdateUserToken(response.data?.token));
          setSessionStorageData(
            "EM_LOGIN_DATA",
            EncryptData(
              JSON.stringify({
                first_name: response.data?.first_name,
                img_path: response?.data?.img_path,
                user_id: response?.data?.user_id,
                token: response?.data?.token,
                user_type: response?.data?.user_type,
              })
            )
          );
          setSessionStorageData(
            "EM_USER_ACCESS_PERMISSION",
            EncryptData(JSON.stringify(response.data?.access_permissions))
          );
          navigate("/dashboard");
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
  // This function checks if the captcha string is valid
  const CheckGoogleCaptch = (data: any) => {
    let formData: any = new FormData();
    formData.append("captcha_token", data);
    CheckCaptchaService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          settoken(true);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error));
  };

  return (
    <div className={classes.AuthBg}>
      <div className={classes.authContainer}>
        <img
          alt="sign in icon"
          src={Images.SIGN_IN_VECTOR}
          className={classes.SigninVector}
        />

        <div className={classes.container}>
          <img alt="logo icon" src={Images.APP_LOGO} className={classes.Logo} />

          <InputBox
            maxLength={INPUT_LENGTHS.Name}
            placeholder="Enter Username"
            lable="Username"
            isRequired={true}
            value={values.username}
            onChange={(data) => setFieldValue("username", data)}
            errorText={
              errors?.username && touched.username ? errors.username : ""
            }
            validationType="ALPHA_NUMERIC"
            onKeyDown={(data) => {
              if (data.which === 13) {
                handleSubmit();
              }
            }}
          />

          <InputBox
            maxLength={INPUT_LENGTHS.Name}
            placeholder="Enter Password"
            lable="Password"
            value={values.password}
            isRequired={true}
            isPassword={true}
            styles={{ paddingRight: "45px" }}
            onChange={(data) => setFieldValue("password", data)}
            errorText={
              errors?.password && touched.password ? errors.password : ""
            }
            validationType="PREVENT_SPACE"
            onKeyDown={(data) => {
              if (data.which === 13) {
                handleSubmit();
              }
            }}
          />
          {/* <ReCAPTCHA
              sitekey={GOOGLE_CAPTCHA_SITE_KEY}
              onChange={(data) => {
                CheckGoogleCaptch(data);
              }}
              ref={captchRef}
            /> */}
          <CommonButton
            lable="Sign In"
            handleClickEvent={() => {
              handleSubmit();
            }}
            type="auth"
          />
        </div>
      </div>
    </div>
  );
}
