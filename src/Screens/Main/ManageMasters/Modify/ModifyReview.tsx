import toast from "react-hot-toast";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Col, Row } from "antd";

import classes from "../../main.module.css";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import { ReviewProps } from "../../../../@Types/ComponentProps";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  ObjectType,
} from "../../../../Shared/Methods";
import {
  CreateReviewService,
  DeleteReviewFileImage,
  UpdateReviewService,
  ViewReviewService,
} from "../../../../Service/ApiMethods";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonImageBox from "../../../../Components/FormFields/CommonImageBox";
import { Images } from "../../../../Shared/ImageExport";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  ratings: Yup.string().required("Rating is required"),

  content: Yup.string().required("Content is required"),
});
export default function ModifyReview() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef: any = useRef();
  let dispatch = useAppDispatch();

  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        ratings: "",
        content: "",
        file_path: [],
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateReview(values);
        } else if (type === "Update") {
          handleUpdateReview(values);
        }
      },
    });

  // Create Product service
  const handleCreateReview = (values: ReviewProps) => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("ratings", values?.ratings);
    formData.append("title", values?.title);

    formData.append("content", values?.content);
    values?.file_path?.map((file: any) => {
      formData.append("file_path", file?.file_path);
    });

    CreateReviewService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          navigate(-1);
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

  // Update Product service

  const handleUpdateReview = (values: ReviewProps) => {
    isLoading(true);

    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("review_id", state?.UpdateData?.review_id);

    formData.append("ratings", values?.ratings);
    formData.append("title", values?.title);

    formData.append("content", values?.content);
    values?.file_path?.map((file: any) => {
      if (CheckFileType(file?.file_path)) {
        formData.append("file_path", file?.file_path);
      }
    });
    UpdateReviewService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          navigate(-1);
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

  // Updates Datas from state for edit service
  const handleUpdateData = (editDatas: ObjectType) => {
    setValues({
      title: editDatas?.title || "",
      content: editDatas?.content || "",
      file_path: editDatas?.fileList || [],
      ratings: editDatas?.ratings || "",
    });
  };

  const handleDeleteReviewFile = (review_file_id: number) => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("review_file_id", review_file_id);

    DeleteReviewFileImage(formData)
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          setFieldValue(
            "file_path",
            values?.file_path?.filter(
              (ele: any) => ele?.review_file_id !== review_file_id
            )
          );
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const ViewReview = () => {
    isLoading(true);
    let finalObj = { token: token, review_id: state?.UpdateData?.review_id };
    ViewReviewService(ConvertJSONtoFormData(finalObj))
      .then((result) => {
        if (result?.data?.status === 1) {
          handleUpdateData(result?.data?.data);
        } else {
          toast.error(result?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        ViewReview();
      }
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Review`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={() => {
          handleSubmit();
        }}
      />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Ratings"
              maxLength={1}
              placeholder="Enter Ratings"
              value={values.ratings}
              isRequired={true}
              validationType="NUMBER"
              onChange={(data) => {
                if (data <= 5) {
                  setFieldValue("ratings", data);
                }
              }}
              errorText={
                errors.ratings && touched.ratings ? errors.ratings : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonTextArea
              lable="Content"
              maxLength={INPUT_LENGTHS.title}
              placeholder="Enter Content"
              value={values.content}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("content", data);
              }}
              errorText={
                errors.content && touched.content ? errors.content : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonFileInput
              lable="Image"
              type="image"
              fileRef={FileRef}
              OnChange={(event) => {
                setFieldValue("file_path", [
                  ...values?.file_path,
                  { file_path: event },
                ]);
                FileRef.current.value = "";
              }}
              handleClear={() => {
                setFieldValue("file_path", []);
                FileRef.current.value = "";
              }}
              Clearable={type === "Create"}
              imagePath={""}
            />
          </Col>
          <Col xs={24}>
            <div className={classes.reviewerContainer}>
              {values?.file_path?.map((file: any, ind: number) => {
                return (
                  <div>
                    <CommonImageBox
                      source={Images.CLEAR_ICON}
                      alt="reviewer"
                      type="permission"
                      onClick={() => {
                        if (CheckFileType(file?.file_path)) {
                          setFieldValue(
                            "file_path",
                            values?.file_path?.filter(
                              (elem, index) => index !== ind
                            )
                          );
                        } else {
                          FileRef.current.value = "";
                          handleDeleteReviewFile(file?.review_file_id);
                        }
                      }}
                    />
                    <CommonImageBox
                      source={
                        CheckFileType(file?.file_path)
                          ? URL.createObjectURL(file?.file_path)
                          : file?.file_path
                      }
                      type="review"
                      alt="reviewer"
                      showPreview={true}
                    />
                  </div>
                );
              })}
            </div>
          </Col>
          <Col xs={24}>
            <CommonButton
              type="submit"
              lable={type}
              isright
              handleClickEvent={() => handleSubmit()}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
