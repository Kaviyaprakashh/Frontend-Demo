import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Row } from "antd";
import { useEffect } from "react";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import CommonButton from "../../../Components/Buttons/CommonButton";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import {
  EditPointStystem,
  ViewPointStystemService,
} from "../../../Service/ApiMethods";
import { ConvertJSONtoFormData, getCatchMsg } from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { GetToken } from "../../../Shared/StoreData";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
  points: Yup.string().required("Point is required"),
  amount: Yup.number()
    .moreThan(0.0, "Value must be greater than zero")
    .required("Amount is required"),
});

export default function PointSystem() {
  const { isLoading } = useLoaderHook();
  const token = GetToken();
  const { values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues: {
        amount: "",
        points: 1,
        point_master_id: 0,
      },
      validationSchema,
      onSubmit(values) {
        handleUpdatePointAmount(values);
      },
    });

  const handleUpdatePointAmount = (values: any) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    EditPointStystem(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data?.status === 1) {
          toast.success(response?.data?.msg);
          ViewPointSystem();
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const ViewPointSystem = () => {
    isLoading(true);
    ViewPointStystemService()
      .then((response) => {
        let finalData = response?.data?.data;
        setValues({
          amount: finalData?.amount || "",
          points: finalData?.points || 1,
          point_master_id: finalData?.point_master_id,
        });
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    ViewPointSystem();
  }, []);
  return (
    <div>
      <ScreenHeader name="Point System" />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]} align={"top"}>
          <Col xs={24} sm={24} md={8} lg={8} xl={6}>
            <CommonInput
              lable="Point"
              maxLength={INPUT_LENGTHS.Price}
              placeholder="Enter Point"
              disabled
              value={values?.points}
              isRequired={true}
              errorText={errors.points && touched.points ? errors.points : ""}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={6}>
            <CommonInput
              lable="Amount"
              maxLength={5}
              placeholder="Enter Amount"
              value={values?.amount}
              onChange={(data) => {
                if (data < 1) {
                  setFieldValue("amount", data);
                }
              }}
              isRequired={true}
              errorText={errors.amount && touched.amount ? errors.amount : ""}
            />
          </Col>
          <Col xs={24}>
            <CommonButton
              lable="Submit"
              handleClickEvent={() => {
                handleSubmit();
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
