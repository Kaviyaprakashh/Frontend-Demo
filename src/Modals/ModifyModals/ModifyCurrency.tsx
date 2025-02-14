import { Col, Row } from "antd";
import { useEffect } from "react";
import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import { useFormik } from "formik";
import { CurrencyProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreateCurrencyService,
  UpdateCurrencyService,
} from "../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../Shared/UpdateLoader";
import * as Yup from "yup";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  symbol: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Symbol is required"),
  value: Yup.string().required("Currency Value is required"),
});

export default function ModifyCurrency({
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
        symbol: "",
        value: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateCurrency(values);
        } else {
          handleUpdateCurrency(values);
        }
      },
    });
  const handleCreateCurrency = (values: CurrencyProps) => {
    isLoading(true);

    const finalObj = {
      ...values,
      token: token,
    };
    CreateCurrencyService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateCurrency = (values: CurrencyProps) => {
    isLoading(true);

    const finalObj = {
      ...values,
      token: token,
      currency_id: UpdateData?.id,
    };
    UpdateCurrencyService(ConvertJSONtoFormData(finalObj))
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
          symbol: UpdateData?.symbol || "",
          value: UpdateData?.value || "",
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
            lable="Title"
            maxLength={INPUT_LENGTHS.title}
            placeholder="Enter Title"
            value={values.title}
            isRequired={true}
            onChange={(data) => {
              setFieldValue("title", data);
            }}
            errorText={errors.title && touched.title ? errors.title : ""}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CommonInput
            lable="Symbol"
            isRequired={true}
            maxLength={INPUT_LENGTHS.symbol}
            placeholder="Enter Symbol"
            validationType="PREVENT_EMOJI"
            value={values.symbol}
            onChange={(data) => {
              setFieldValue("symbol", data);
            }}
            errorText={errors.symbol && touched.symbol ? errors.symbol : ""}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CommonInput
            lable="Currency Value"
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Currency Value"
            value={values.value}
            isRequired={true}
            onChange={(data) => {
              setFieldValue("value", data);
            }}
            validationType={"AMOUNT"}
            errorText={errors.value && touched.value ? errors.value : ""}
          />
        </Col>

        <ModalButton lable={type} handleSubmit={handleSubmit} />
      </Row>
    </>
  );
}
