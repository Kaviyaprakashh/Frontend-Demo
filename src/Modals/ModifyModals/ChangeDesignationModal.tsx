import * as Yup from "yup";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useFormik } from "formik";

import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import { ChangeDesignationService } from "../../Service/ApiMethods";
import useLoaderHook from "../../Shared/UpdateLoader";
import { ChangeDesignationProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import ModalButton from "../../Components/UIComponents/ModalButton";
import CommonSelect from "../../Components/FormFields/CommonSelect";

const validationSchema = Yup.object().shape({
  type: Yup.string().required(
    "Please Select the Designation that you need to change"
  ),
});

export default function ChangeDesignationModal({
  UpdateData,
  OnClose,
  handleSuccess,
}: GlobalModifyModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      type: null,
    },
    validationSchema,
    onSubmit(values) {
      handleChangeDesignation(values);
    },
  });

  // Create Product pricing Service
  const handleChangeDesignation = (values: ChangeDesignationProps) => {
    isLoading(true);
    const finalObj = {
      token: token,
      type: values.type,
      user_id: UpdateData,
    };
    ChangeDesignationService(ConvertJSONtoFormData(finalObj))
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

  return (
    <Row>
      <Col xs={24}>
        <CommonSelect
          lable="Designation"
          placeholder="Select Designation"
          value={values?.type}
          onChange={(data) => {
            setFieldValue("type", data);
          }}
          options={[
            {
              label: "Sales Executive",
              value: 3,
            },
            {
              label: "Engineer",
              value: 4,
            },
          ]}
          isRequired={true}
          errorText={errors.type && touched.type ? errors.type : ""}
        />
      </Col>

      <ModalButton lable={"Submit"} handleSubmit={handleSubmit} />
    </Row>
  );
}
