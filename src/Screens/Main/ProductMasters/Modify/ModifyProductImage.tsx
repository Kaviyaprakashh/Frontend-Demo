import * as Yup from "yup";
import {
  GlobalModifyModalProps,
  ProductImageModalProps,
} from "../../../../@Types/ModalProps";
import { GetToken } from "../../../../Shared/StoreData";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { useFormik } from "formik";
import { ConvertJSONtoFormData, getCatchMsg } from "../../../../Shared/Methods";
import {
  CreateProductImagesService,
  UpdateProductImagesService,
} from "../../../../Service/ApiMethods";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { Col, Row } from "antd";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import { useLocation } from "react-router";

const validationSchema = Yup.object().shape({
  img_alt: Yup.string().trim().required("Alternate Image Name is Required"),
  img_path: Yup.string().trim().required("Image is Required"),
});

export default function ModifyProductImage({
  type,
  UpdateData,
  OnClose,
  handleSuccess,
}: GlobalModifyModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const FileRef: any = useRef(null);
  const { state } = useLocation();
  const { values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues: {
        img_path: "",
        img_alt: "",
        // thumb_path: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateProductImage(values);
        } else {
          handleUpdateProductImage(values);
        }
      },
    });

  const handleCreateProductImage = (values: ProductImageModalProps) => {
    isLoading(true);

    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      product_id: state?.UpdateData.id,
    });
    CreateProductImagesService(finalObj)
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

  const handleUpdateProductImage = (values: ProductImageModalProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      img_path: typeof values.img_path === "string" ? "" : values?.img_path,
      // thumb_path:
      //   typeof values.thumb_path === "string" ? "" : values?.thumb_path,

      product_image_id: UpdateData?.id,
    });
    UpdateProductImagesService(finalObj)
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
          img_path: UpdateData?.img_path || "",
          img_alt: UpdateData?.img_alt || "",
          // thumb_path: UpdateData?.thumb_path || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <CommonInput
          lable="Alternate Image Name"
          maxLength={INPUT_LENGTHS.ImageAlt}
          placeholder="Enter Alternate Image Name"
          value={values?.img_alt}
          onChange={(data) => {
            setFieldValue("img_alt", data);
          }}
          isRequired={true}
          errorText={errors?.img_alt && touched?.img_alt ? errors?.img_alt : ""}
        />
      </Col>
      <Col xs={24}>
        <CommonFileInput
          lable="Image"
          type="image"
          isRequired={true}
          value={values.img_path}
          fileRef={FileRef}
          OnChange={(event) => {
            setFieldValue("img_path", event);
          }}
          // handleClear={() => {
          //   setFieldValue("img_path", "");
          // }}
          id="img_path"
          imagePath={values.img_path}
          errorText={
            errors?.img_path && touched?.img_path ? errors?.img_path : ""
          }
        />
      </Col>
      {/* <Col xs={24}>
        <CommonFileInput
          lable="Thumb Image"
          type="image"
          id="thumb_path"
          value={values.thumb_path}
          fileRef={ImageRef}
          OnChange={(event) => {
            setFieldValue("thumb_path", event);
          }}
          Clearable={type === "Create"}
          handleClear={() => {
            setFieldValue("thumb_path", "");
            ImageRef.current.value = "";
          }}
          imagePath={values.thumb_path}
        />
      </Col> */}
      <Col xs={24}>
        <CommonButton
          type="submit"
          lable={type ?? "Submit"}
          isright
          handleClickEvent={() => handleSubmit()}
        />
      </Col>
    </Row>
  );
}
