import { Col, Row } from "antd";
import { useEffect, useRef } from "react";
import CommonInput from "../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import { useFormik } from "formik";
import { GalleryImageProps } from "../../@Types/ComponentProps";
import { GlobalModifyModalProps } from "../../@Types/ModalProps";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
} from "../../Shared/Methods";
import { GetToken } from "../../Shared/StoreData";
import {
  CreateGalleryImagesService,
  UpdateGalleryImagesService,
} from "../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../Shared/UpdateLoader";
import { useLocation } from "react-router";
import * as Yup from "yup";
import CommonFileInput from "../../Components/FormFields/CommonFileInput";
import ModalButton from "../../Components/UIComponents/ModalButton";

const validationSchema = Yup.object().shape({
  imgAlt: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Alternate Image is Required"),
  sortOrder: Yup.string().required("Sort Order is Required"),
  uploadImg: Yup.string().required("Image is Required"),
});

export default function CreateGalleryImage({
  type,
  UpdateData,
  OnClose,
  handleSuccess,
}: GlobalModifyModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const Fileref: any = useRef();
  const { state } = useLocation();
  const { values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues: {
        imgAlt: "",
        sortOrder: "",
        uploadImg: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateGalleryImage(values);
        } else {
          handleUpdateGalleryImage(values);
        }
      },
    });
  const handleCreateGalleryImage = (values: GalleryImageProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      galleryId: state?.UpdateData?.galleryId,
    };
    CreateGalleryImagesService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateGalleryImage = (values: GalleryImageProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      uploadImg: CheckFileType(values.uploadImg),
      galleryItemId: UpdateData.galleryItemId,
    };
    UpdateGalleryImagesService(ConvertJSONtoFormData(finalObj))
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
          imgAlt: UpdateData.imgAlt || "",
          sortOrder: UpdateData.sortOrder >= 0 ? UpdateData.sortOrder : "",
          uploadImg: UpdateData.filePath || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <CommonInput
          lable="Sort Order"
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={values?.sortOrder}
          onChange={(data) => {
            setFieldValue("sortOrder", data);
          }}
          isRequired={true}
          validationType={"NUMBER"}
          errorText={
            errors.sortOrder && touched.sortOrder ? errors.sortOrder : ""
          }
        />
      </Col>
      <Col xs={24}>
        <CommonFileInput
          fileRef={Fileref}
          lable="Image"
          value={values?.uploadImg}
          OnChange={(data: any) => {
            setFieldValue("uploadImg", data);
          }}
          // handleClear={() => {
          //   setFieldValue("uploadImg", "");
          //   Fileref.current.value = null;
          // }}
          // Clearable={type === "Create"}
          type="image"
          imagePath={values.uploadImg}
          isRequired={true}
          errorText={
            errors.uploadImg && touched.uploadImg ? errors.uploadImg : ""
          }
        />
      </Col>
      <Col xs={24}>
        <CommonInput
          lable="Alternate Image Name"
          maxLength={INPUT_LENGTHS.ImageAlt}
          placeholder="Enter Alternate Image Name"
          value={values?.imgAlt}
          onChange={(data) => {
            setFieldValue("imgAlt", data);
          }}
          validationType="PREVENT_EMOJI"
          isRequired={true}
          errorText={errors.imgAlt && touched.imgAlt ? errors.imgAlt : ""}
        />
      </Col>

      <ModalButton lable={type} handleSubmit={handleSubmit} />
    </Row>
  );
}
