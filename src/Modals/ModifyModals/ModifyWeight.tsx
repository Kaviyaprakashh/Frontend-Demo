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
  CreateWeightService,
  UpdateWeightService,
} from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is Required"),
});

export default function ModifyWeight({
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
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateWeight(values);
        } else {
          handleUpdateWeight(values);
        }
      },
    });
  const handleCreateWeight = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateWeightService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateWeight = (values: PricingNameProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      weight_measure_id: UpdateData?.id,
    };
    UpdateWeightService(ConvertJSONtoFormData(finalObj))
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
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <CommonInput
          lable="Name"
          maxLength={INPUT_LENGTHS.Name}
          placeholder="Enter Name"
          validationType="PREVENT_SPECIAL_CHAR"
          value={values?.name}
          onChange={(data) => {
            setFieldValue("name", data);
          }}
          handleSubmit={handleSubmit}
          isRequired={true}
          errorText={errors.name && touched.name ? errors.name : ""}
        />
      </Col>
      <Col xs={24}>
        <CommonInput
          lable="Sort Order"
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={values?.sort_order}
          onChange={(data) => {
            setFieldValue("sort_order", data);
          }}
          handleSubmit={handleSubmit}
          validationType={"NUMBER"}
        />
      </Col>
      <ModalButton lable={type} handleSubmit={handleSubmit} />
    </Row>
  );
}
