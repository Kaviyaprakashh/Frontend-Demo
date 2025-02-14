import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Col, Row } from "antd";
import toast from "react-hot-toast";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
} from "../../../../Shared/Methods";
import {
  CategoryDropdownService,
  CreateHomepageProductsService,
  ProductDropdownService,
  RemoveHomepageMappedProductService,
  UpdateHomepageProductsService,
  ViewHomepageProductsService,
} from "../../../../Service/ApiMethods";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import classes from "../../main.module.css";
import { HomepageProductsProps } from "../../../../@Types/ComponentProps";
import CommonSelect from "../../../../Components/FormFields/CommonSelect";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import { Images } from "../../../../Shared/ImageExport";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { OptionTypes } from "../../../../@Types/GlobalTypes";
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  imgAlt: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Alternate Image Name Order is required"),
  categoryId: Yup.string().required("Category Order is required"),
  pageSortOrder: Yup.string().required("Sort Order is required"),
  newProducts: Yup.array().of(
    Yup.object().shape({
      productId: Yup.string().required("Product is required"),
      sortOrder: Yup.string().required("Sort Order is required"),
    })
  ),
});
export default function ModifyHomepageProducts() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef: any = useRef();
  let dispatch = useAppDispatch();
  const [CategoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);

  const {
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      imgPath: "",
      title: "",
      imgAlt: "",
      pageSortOrder: "",
      categoryId: null,
      categoryName: "",
      newProducts: [
        {
          productId: null,
          sortOrder: "",
        },
      ],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit(values) {
      if (values?.newProducts?.length === 0) {
        toast.error("Please Select atleast one product");
      } else if (type === "Create") {
        handleCreateHomepageProducts(values);
      } else if (type === "Update") {
        handleUpdateHomepageProducts(values);
      }
    },
  });

  const handleCreateHomepageProducts = (values: HomepageProductsProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      categoryName: "",
      newProducts:
        values?.newProducts.length > 0
          ? JSON.stringify(values?.newProducts)
          : "",
    };
    CreateHomepageProductsService(ConvertJSONtoFormData(finalObj))
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
  const handleUpdateHomepageProducts = (values: HomepageProductsProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      categoryName: "",

      newProducts:
        values?.newProducts.length > 0
          ? JSON.stringify(values?.newProducts)
          : "",
      imgPath: CheckFileType(values?.imgPath),
      homepageProductsId: state?.UpdateData?.homepageProductsId,
    };

    UpdateHomepageProductsService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          let IDs = state?.UpdateData?.productList?.map(
            (ele: any) => ele?.homepageProductMapId
          );
          if (
            values?.categoryId !== state?.UpdateData?.categoryId &&
            IDs?.length > 0
          ) {
            RemoveMappedProduct(IDs, true);
          } else {
            navigate(-1);
          }
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

  const getErrors = (index: number, key: string, main_key: string) => {
    // @ts-ignore
    if (errors[main_key]?.[index]?.[key] && touched[main_key]) {
      // @ts-ignore
      return errors[main_key]?.[index]?.[key];
    } else return "";
  };
  const getProductList = (productId: any) => {
    let array = values?.newProducts?.map((ele: any) => ele.productId);
    return productList?.filter((ele: OptionTypes) => {
      if (!array.includes(ele.value) || ele.value === productId) {
        return ele;
      }
    });
  };

  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Product",
      key: "productId",
      className: "contant1_width",
      render: (text: any, data, index) => (
        <CommonSelect
          options={getProductList(text)}
          isRequired={true}
          value={text}
          placeholder="Select Product"
          optionName={data?.productName ?? ""}
          onChange={(data) => {
            setFieldValue(`newProducts[${index}].productId`, data);
          }}
          errorText={getErrors(index, "productId", "newProducts")}
        />
      ),
    },
    {
      lable: "Sort Order",
      key: "sortOrder",
      className: "contant2_width",
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={text}
          validationType={"NUMBER"}
          onChange={(data) => {
            setFieldValue(`newProducts[${index}].sortOrder`, data);
          }}
          errorText={getErrors(index, "sortOrder", "newProducts")}
        />
      ),
    },
    {
      lable: (
        <img
          src={Images.ADD_ICON}
          alt="add icon"
          className={classes.TableIcons}
          onClick={() => {
            if (!errors?.newProducts) {
              setFieldValue("newProducts", [
                {
                  productId: null,
                  sortOrder: "",
                },
                ...values.newProducts,
              ]);
            } else {
              setFieldTouched("newProducts", true);
            }
          }}
        />
      ),
      key: "",
      className: "contant2_width",
      render: (text: any, data, index) =>
        values?.newProducts?.length > 1 ? (
          <>
            <img
              src={Images.CANCEL_ICON}
              alt="add icon"
              className={classes.TableIcons}
              onClick={() => {
                if (data?.homepageProductMapId) {
                  RemoveMappedProduct(data?.homepageProductMapId);
                  setFieldValue(
                    "newProducts",
                    values.newProducts?.filter((elem, ind) => ind !== index)
                  );
                } else {
                  setFieldValue(
                    "newProducts",
                    values.newProducts?.filter((elem, ind) => ind !== index)
                  );
                }
              }}
            />
          </>
        ) : (
          ""
        ),
    },
  ];

  const RemoveMappedProduct = (id: any, back = false) => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("homepageProductMapId", id);
    RemoveHomepageMappedProductService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          if (back) {
            navigate(-1);
          }
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const getCategoryDropdown = () => {
    let finalObj = { token: token, type: 1 };

    CategoryDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.name, value: ele?.id };
          });
          setCategoryList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const getProductDropdown = (category_id: any) => {
    isLoading(true);
    let finalObj = { token: token, category_id };
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
      })
      .finally(() => isLoading(false));
  };

  const getViewHomepageProduct = (id: number) => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("homepageProductsId", id);
    ViewHomepageProductsService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          handleSetValues(response.data?.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const handleSetValues = (data: any) => {
    setValues({
      title: data?.title || "",
      imgAlt: data?.img_alt || "",
      pageSortOrder: data.sort_order >= 0 ? data.sort_order : "",
      categoryId: data?.categoryId || "",
      categoryName: data?.categoryName || "",
      newProducts:
        data?.productList?.map((ele: any) => ({
          homepageProductMapId: ele?.homepageProductMapId,
          productId: ele?.productId,
          sortOrder: ele.sortOrder >= 0 ? ele.sortOrder : "",
          productName: ele?.productName,
        })) || "",
      imgPath: data?.img_path || "",
    });
  };
  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        getViewHomepageProduct(state?.UpdateData?.homepageProductsId);
      }
      if (state?.UpdateData?.categoryId) {
        getProductDropdown(state?.UpdateData?.categoryId);
      }
      getCategoryDropdown();
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Homepage Product`}
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
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.pageSortOrder}
              isRequired={true}
              validationType={"NUMBER"}
              onChange={(data) => {
                setFieldValue("pageSortOrder", data);
              }}
              errorText={
                errors.pageSortOrder && touched.pageSortOrder
                  ? errors.pageSortOrder
                  : ""
              }
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonSelect
              lable="Category"
              options={CategoryList}
              placeholder="Enter Category"
              value={values?.categoryId}
              optionName={values?.categoryName}
              isRequired={true}
              onChange={(data, options) => {
                setValues((pre) => ({
                  ...pre,
                  categoryName: options?.label,
                  categoryId: data,
                }));
                getProductDropdown(data);
                if (data === state?.UpdateData?.categoryId) {
                  setFieldValue(
                    "newProducts",
                    state?.UpdateData?.productList?.map((ele: any) => ({
                      homepageProductMapId: ele?.homepageProductMapId,
                      productId: ele?.productId,
                      sortOrder: ele.sortOrder >= 0 ? ele.sortOrder : "",
                      productName: ele?.productName,
                    })) || ""
                  );
                } else {
                  setFieldValue("newProducts", [
                    {
                      productId: null,
                      sortOrder: "",
                    },
                  ]);
                }
              }}
              errorText={
                errors.categoryId && touched.categoryId ? errors.categoryId : ""
              }
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
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <CommonInput
              lable="Alternate Image Name"
              maxLength={INPUT_LENGTHS.ImageAlt}
              placeholder="Enter Alternate Image Name"
              value={values.imgAlt}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("imgAlt", data);
              }}
              errorText={errors.imgAlt && touched.imgAlt ? errors.imgAlt : ""}
            />
          </Col>
          {values?.categoryId && (
            <Col xs={24}>
              <p className="Label">Products</p>
              <GlobalTable
                total={values?.newProducts.length}
                Options={TableOptions}
                items={values?.newProducts}
                ismodify={true}
              />
            </Col>
          )}
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
