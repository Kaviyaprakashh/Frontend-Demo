import { Col, Row } from "antd";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import { PricingNameProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreateOrderstatusService,
  UpdateOrderStatusService,
} from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is Required"),
  sort_order: Yup.string().trim().required("Sort Order is Required"),
});

export default function ModifyOrderStatus({
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
        name: "",
        sort_order: "",
        colour_code: "#ff0000",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateOrderStatus(values);
        } else {
          handleUpdateOrderStatus(values);
        }
      },
    });

  const handleCreateOrderStatus = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateOrderstatusService(ConvertJSONtoFormData(finalObj))
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

  const handleUpdateOrderStatus = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      order_status_id: UpdateData?.id,
    };
    UpdateOrderStatusService(ConvertJSONtoFormData(finalObj))
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
          name: UpdateData?.name || "",
          sort_order: UpdateData.sort_order >= 0 ? UpdateData.sort_order : "",
          colour_code: UpdateData?.colour_code || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      <Row gutter={[16, 16]} align={"top"}>
        <Col xs={24} sm={24} md={12}>
          <CommonInput
            lable="Name"
            maxLength={INPUT_LENGTHS.Name}
            placeholder="Enter Name"
            value={values?.name}
            onChange={(data) => {
              setFieldValue("name", data);
            }}
            isRequired={true}
            errorText={errors.name && touched.name ? errors.name : ""}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CommonInput
            lable="Sort Order"
            maxLength={INPUT_LENGTHS.sortOrder}
            placeholder="Enter Sort Order"
            value={values?.sort_order}
            onChange={(data) => {
              setFieldValue("sort_order", data);
            }}
            disabled
            isRequired={true}
            errorText={
              errors.sort_order && touched.sort_order ? errors.sort_order : ""
            }
            validationType={"NUMBER"}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CommonInput
            lable="Color"
            // onChange
            maxLength={INPUT_LENGTHS.Name}
            placeholder="Select Color"
            value={values?.colour_code}
            onChange={(data) => {
              setFieldValue("colour_code", data);
            }}
            inputtype="color"
          />
        </Col>

        <ModalButton lable={type} handleSubmit={handleSubmit} />
      </Row>
    </>
  );
}
