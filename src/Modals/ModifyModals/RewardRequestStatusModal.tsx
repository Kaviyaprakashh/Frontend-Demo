import toast from "react-hot-toast";
import { useFormik } from "formik";
import { Col, Row } from "antd";
import * as Yup from "yup";
import { GetToken } from "../../Shared/StoreData";
import useLoaderHook from "../../Shared/UpdateLoader";
import { ChangeStatusRewardRedemption } from "../../Service/ApiMethods";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import CommonSelect from "../../Components/FormFields/CommonSelect";
import { INPUT_LENGTHS, RedemptionRequestStatus } from "../../Shared/Constants";
import CommonTextArea from "../../Components/FormFields/CommonTextArea";
import ModalButton from "../../Components/UIComponents/ModalButton";
const validationSchema = Yup.object().shape({
  request_status: Yup.string().required("Request Status is Required"),
});

export default function RewardRequestStatusModal({
  OnClose,
  request_id,
  request_status,
}: {
  request_id: number;
  request_status: number;
  OnClose: () => void;
}) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues: {
        request_status: request_status,
        description: "",
      },
      validationSchema,
      onSubmit(values) {
        handleUpdateRequestStatus(values);
      },
    });

  const handleUpdateRequestStatus = (values: any) => {
    isLoading(true);
    let finalObj = {
      ...values,
      request_id,
      token,
    };
    ChangeStatusRewardRedemption(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          OnClose();
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <CommonSelect
          lable="Request Status"
          placeholder="Enter Request Status"
          value={values?.request_status}
          onChange={(data) => {
            setFieldValue("request_status", data);
          }}
          options={RedemptionRequestStatus}
          isRequired={true}
          errorText={
            errors.request_status && touched.request_status
              ? errors.request_status
              : ""
          }
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
          handleSubmit={handleSubmit}
        />
      </Col>
      <ModalButton lable={"Submit"} handleSubmit={handleSubmit} />
    </Row>
  );
}
