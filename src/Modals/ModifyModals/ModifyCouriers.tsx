import { Col, Row } from "antd";
import { useEffect } from "react";
import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import { useFormik } from "formik";
import { CouriersProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreateCouriersService,
  UpdateCouriersService,
} from "../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../Shared/UpdateLoader";
import * as Yup from "yup";
import CommonTextArea from "../../Components/FormFields/CommonTextArea";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Name is Required"),
  description: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true),
});

export default function ModifyCouriers({
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
        description: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateCouriers(values);
        } else {
          handleUpdateCouriers(values);
        }
      },
    });
  const handleCreateCouriers = (values: CouriersProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateCouriersService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateCouriers = (values: CouriersProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      courier_id: UpdateData?.id,
    };
    UpdateCouriersService(ConvertJSONtoFormData(finalObj))
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
          description: UpdateData?.description || "",
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
          value={values?.name}
          onChange={(data) => {
            setFieldValue("name", data);
          }}
          isRequired={true}
          errorText={errors.name && touched.name ? errors.name : ""}
        />
      </Col>
      <Col xs={24}>
        <CommonTextArea
          lable="Description"
          maxLength={INPUT_LENGTHS.description}
          placeholder="Enter Description"
          value={values?.description}
          onChange={(data) => {
            setFieldValue("description", data);
          }}
          validationType="PREVENT_SPECIAL_CHAR"
          errorText={
            errors.description && touched.description ? errors.description : ""
          }
        />
      </Col>

      <ModalButton lable={type} handleSubmit={handleSubmit} />
    </Row>
  );
}
