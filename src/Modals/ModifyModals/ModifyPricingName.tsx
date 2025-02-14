import * as Yup from "yup";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { useFormik } from "formik";
import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";

import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreateProductPricingNameService,
  UpdateProductPricingNameService,
} from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import { PricingNameProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .required("Title is Required"),
});

export default function ModifyPricingName({
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
        title: "",
        sort_order: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateProductPricingName(values);
        } else {
          handleUpdateProductPricingName(values);
        }
      },
    });

  // Create Product pricing Service
  const handleCreateProductPricingName = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateProductPricingNameService(ConvertJSONtoFormData(finalObj))
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

  // Update Product pricing service
  const handleUpdateProductPricingName = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      pricing_id: UpdateData?.id,
    };
    UpdateProductPricingNameService(ConvertJSONtoFormData(finalObj))
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
          title: UpdateData?.title || "",
          sort_order: UpdateData.sort_order >= 0 ? UpdateData.sort_order : "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <CommonInput
          lable="Title"
          maxLength={INPUT_LENGTHS.title}
          placeholder="Enter Title"
          value={values?.title}
          onChange={(data) => {
            setFieldValue("title", data);
          }}
          isRequired={true}
          errorText={errors.title && touched.title ? errors.title : ""}
        />
      </Col>
      <Col xs={24}>
        <CommonInput
          lable="Sort Order"
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={values.sort_order}
          onChange={(data) => {
            setFieldValue("sort_order", data);
          }}
          validationType={"NUMBER"}
        />
      </Col>
      <ModalButton lable={type} handleSubmit={handleSubmit} />
    </Row>
  );
}
