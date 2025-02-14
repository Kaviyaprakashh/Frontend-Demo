import { useEffect, useState } from "react";
import { GetToken } from "../../../Shared/StoreData";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../Shared/Methods";
import {
  UpdateSettingsService,
  ViewSettingsService,
} from "../../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { Col, Row } from "antd";
import { INPUT_LENGTHS, REGEX } from "../../../Shared/Constants";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function CustomerSupport() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [customerSupportNo, setNumber] = useState("");
  const [errors, setError] = useState(false);
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const getViewSetting = () => {
    isLoading(true);
    let finalObj = { token };
    ViewSettingsService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setNumber(response.data.data?.customerSupportNo);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const handleUpdateSetting = () => {
    isLoading(true);
    let finalObj = {
      token,
      customerSupportNo: customerSupportNo,
    };
    UpdateSettingsService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          getViewSetting();
          toast.success(response.data?.msg);
        } else {
          toast.error(response.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      getViewSetting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <ScreenHeader name="Customer Support" />
      <div className={classes.bgContainer}>
        <Row gutter={10} className={classes.filterContainer}>
          <Col xs={24} sm={12} md={8}>
            <CommonInput
              lable="Customer Support Number"
              maxLength={INPUT_LENGTHS.phone}
              placeholder="Enter Customer Support Number"
              value={customerSupportNo}
              onChange={(data) => {
                if (errors) {
                  if (data.match(REGEX.MobileNo)) {
                    setError(false);
                  }
                }
                setNumber(data);
              }}
              disabled={
                permission?.cms?.customer_support?.edit_support_number
                  ? false
                  : true
              }
              validationType={"NUMBER"}
              errorText={errors ? "Invalid Mobile Number" : ""}
            />
          </Col>
          {permission?.cms?.customer_support?.edit_support_number ? (
            <Col xs={24}>
              <CommonButton
                lable="Submit"
                handleClickEvent={() => {
                  if (customerSupportNo.match(REGEX.MobileNo)) {
                    handleUpdateSetting();
                  } else {
                    setError(true);
                  }
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
