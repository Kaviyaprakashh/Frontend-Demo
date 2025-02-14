import toast from "react-hot-toast";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Col, Row } from "antd";

import classes from "../../main.module.css";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import { HomeSalesProductsProps } from "../../../../@Types/ComponentProps";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
  ObjectType,
} from "../../../../Shared/Methods";
import {
  CreateHomesalesProductService,
  ProductDropdownService,
  UpdateHomesalesProductService,
} from "../../../../Service/ApiMethods";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import CommonSelect from "../../../../Components/FormFields/CommonSelect";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  productId: Yup.string().required("Product is required"),
  imgAlt: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Alternate Image Name is required"),
  sortOrder: Yup.string().required("Sort Order is required"),
  // imgPath: Yup.string().required("Image is required"),
});
export default function ModifyHomeSalesProducts() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef: any = useRef();
  let dispatch = useAppDispatch();
  const [productList, setProductList] = useState([]);
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        sortOrder: "",
        productId: null,
        imgAlt: "",
        imgPath: "",
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateHomeSalesProducts(values);
        } else if (type === "Update") {
          handleUpdateHomeSalesProducts(values);
        }
      },
    });

  // Create Product service
  const handleCreateHomeSalesProducts = (values: HomeSalesProductsProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    CreateHomesalesProductService(finalObj)
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

  const handleUpdateHomeSalesProducts = (values: HomeSalesProductsProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      homepageSalesProductsId: state?.UpdateData?.homepageSalesProductsId,
      imgPath: CheckFileType(values?.imgPath),
    });
    UpdateHomesalesProductService(finalObj)
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

  // product dropdown service
  const getProductDropdown = () => {
    let finalObj = { token: token };
    ProductDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.name, value: ele?.id };
          });
          setProductList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  // Updates Datas from state for edit service
  const handleUpdateData = (editDatas: ObjectType) => {
    setValues({
      title: editDatas?.title || "",
      sortOrder: editDatas.sortOrder >= 0 ? editDatas.sortOrder : "",
      imgAlt: editDatas?.img_alt || "",
      imgPath: editDatas?.img_path || "",
      productId: editDatas?.productId || null,
    });
  };

  useEffect(() => {
    if (token) {
      getProductDropdown();
      if (state?.UpdateData) {
        handleUpdateData(state?.UpdateData);
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
        name={`${state?.type} Homepage Sales Product`}
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
              lable="Sort Order"
              isRequired={true}
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.sortOrder}
              validationType={"NUMBER"}
              onChange={(data) => {
                setFieldValue("sortOrder", data);
              }}
              errorText={
                errors.sortOrder && touched.sortOrder ? errors.sortOrder : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonSelect
              lable="Product"
              options={productList}
              isRequired={true}
              placeholder="Select Product"
              value={values?.productId}
              onChange={(data) => {
                setFieldValue("productId", data);
              }}
              errorText={
                errors.productId && touched.productId ? errors.productId : ""
              }
              optionName={state?.UpdateData?.productName}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonFileInput
              lable="Image"
              type="image"
              value={values.imgPath}
              fileRef={FileRef}
              OnChange={(event) => {
                setFieldValue("imgPath", event);
              }}
              handleClear={() => {
                setFieldValue("imgPath", "");
                FileRef.current.value = "";
              }}
              Clearable={type === "Create"}
              imagePath={values.imgPath}
              // errorText={errors.imgPath && touched.imgPath ? errors.imgPath : ""}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              isRequired={true}
              lable="Alternate Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Image Name"
              value={values.imgAlt}
              onChange={(data) => {
                setFieldValue("imgAlt", data);
              }}
              errorText={errors.imgAlt && touched.imgAlt ? errors.imgAlt : ""}
            />
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
