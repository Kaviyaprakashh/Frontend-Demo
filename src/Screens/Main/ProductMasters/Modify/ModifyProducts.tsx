import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";

import {
  CheckFileType,
  ConvertJSONtoFormData,
  getCatchMsg,
  ObjectType,
  StringifyObj,
} from "../../../../Shared/Methods";
import {
  AttributeDropdownService,
  BrandDropdownService,
  CategoryDropdownService,
  CreateProductsService,
  DeleteProductAttributeService,
  DeleteProductPriceClassService,
  PriceNameDropdownService,
  ProductDropdownService,
  SupplierDropdownService,
  TaxClassDropdownService,
  UpdateProductsService,
  VehicleDropdownService,
  ViewProductsService,
  WeightMeasureIdDropdownService,
} from "../../../../Service/ApiMethods";
import { ProductsProps } from "../../../../@Types/ComponentProps";
import classes from "../../main.module.css";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import {
  INPUT_LENGTHS,
  PricingType,
  ProductType,
} from "../../../../Shared/Constants";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonFileInput from "../../../../Components/FormFields/CommonFileInput";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import { Images } from "../../../../Shared/ImageExport";
import CommonSelect from "../../../../Components/FormFields/CommonSelect";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonImageBox from "../../../../Components/FormFields/CommonImageBox";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { OptionTypes } from "../../../../@Types/GlobalTypes";
import CommonAlter from "../../../../Components/UIComponents/CommonAlter";
import { ModifyProductContext } from "../../../../Shared/Context";
import PricingTable from "../../../../Components/UIComponents/PricingTable";
import CommonCheckBox from "../../../../Components/FormFields/CommonCheckBox";

const validationSchema = Yup.object().shape({
  has_variants: Yup.number().required("Product Type is required"),
  name: Yup.string().trim().required("Name is required"),
  product_code: Yup.string().trim().required("Product Code is required"),
  min_order_qty: Yup.string().trim().required("Min Order Quantity is required"),
  max_order_qty: Yup.string()
    .test(
      "min_order_qty",
      "Max Order Quantity must be greater than Min Order Quantity",
      function (value: any) {
        const { min_order_qty } = this.parent; // Accessing the value of actual_price
        return min_order_qty && value
          ? parseFloat(min_order_qty) < parseFloat(value)
          : true;
      }
    )
    .required("Max Order Quantity is required"),
  meta_title: Yup.string().trim().required("Meta Title is required"),
  seo_url: Yup.string().trim().required("SEO Url is required"),
  brand_id: Yup.string().trim().required("Brand is required"),
  product_supplier_ids: Yup.array().required("Supplier is required"),
  pricing_type: Yup.string().trim().required("Pricing Type is required"),

  model: Yup.string().trim().required("Model is required"),
  actual_price: Yup.string().when("has_variants", {
    is: (val: number) => val === 1,
    then: () => Yup.string().trim().required("MRP Price is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  price: Yup.string().when("has_variants", {
    is: (val: number) => val === 1,
    then: () =>
      Yup.string()
        .test(
          "price",
          "Offer Price must be less than MRP Price",
          function (value: any) {
            const { actual_price } = this.parent; // Accessing the value of actual_price
            return actual_price && value
              ? parseFloat(actual_price) > parseFloat(value)
              : true;
          }
        )
        .required("Offer Price is Required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  weight: Yup.string().when("has_variants", {
    is: (val: number) => val === 1,
    then: () => Yup.string().trim().required("Weight is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  tax_class_id: Yup.string().trim().required("Tax is required"),
  weight_measure_id: Yup.string()
    .trim()
    .required("Weight Measure Id is required"),
  hsn_code: Yup.string().trim().required("HSN Code is required"),
  img_path: Yup.string().trim().required("Image is required"),
  sort_order: Yup.string().trim().required("Sort Order is required"),
  img_alt: Yup.string().trim().required("Alternate Image Text is required"),
  product_attribute: Yup.array()
    .of(
      Yup.object().shape({
        attribute_id: Yup.string().required("Attribute is required"),
        content: Yup.string().required("Content is required"),
      })
    )
    .test(
      "unique-names",
      "Attribute must be unique. Please ensure that each attribute is selected only once.",
      function (value: any) {
        const names = value?.map((v: any) => v.attribute_id);
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
      }
    ),
  product_vehicle: Yup.array()
    .of(
      Yup.object().shape({
        vehicle_id: Yup.string().required("Vehicle is required"),
        value: Yup.string().required("Price is required"),
        min_volume: Yup.string().required("Minimum Volume is required"),
        max_volume: Yup.string()
          .test(
            "price",
            "Maximum Volume must be greater than Minimum Volume",
            function (value: any) {
              const { min_volume } = this.parent; // Accessing the value of min_volume
              return min_volume && value
                ? parseFloat(min_volume) < parseFloat(value)
                : true;
            }
          )
          .required("Maximum Volume is required"),
      })
    )
    .test(
      "unique-names",
      "Vehicle must be unique. Please ensure that each vehicle is selected only once.",
      function (value: any) {
        const names = value.map((v: any) => v.vehicle_id);
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
      }
    ),
  points: Yup.number()
    .min(0.01, "Points Cannot be Zero")
    .required("Points is required"),
  product_category_id: Yup.string().required("Sub Category is required"),
  category_id: Yup.string().required("Category is is required"),

  product_pricing: Yup.array().when("has_variants", {
    is: (val: number) => val === 1,
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            price_name_id: Yup.string().required("Prince Name is required"),
            price: Yup.string()
              .test(
                "price",
                "Offer Price must be less than MRP Price",
                function (value: any) {
                  const { actual_price } = this.parent; // Accessing the value of actual_price
                  return actual_price && value
                    ? parseFloat(actual_price) > parseFloat(value)
                    : true;
                }
              )
              .required("Offer Price is Required"),
            actual_price: Yup.string().trim().required("MRP Price is required"),
          })
        )
        .test(
          "unique-names",
          "Price classes must be unique. Please ensure that each price class is selected only once.",
          function (value: any) {
            const names = value?.map((v: any) => v.price_name_id);
            const uniqueNames = new Set(names);
            return names.length === uniqueNames.size;
          }
        ),
    otherwise: () => Yup.array().notRequired(),
  }),
  product_variants: Yup.array().when("has_variants", {
    is: (val: number) => val === 2,
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            size: Yup.string().required("Size is required"),
            weight: Yup.string().required("Weight is required"),
            actual_price: Yup.string().trim().required("MRP Price is required"),
            price: Yup.string()
              .test(
                "price",
                "Offer Price must be less than MRP Price",
                function (value: any) {
                  const { actual_price } = this.parent; // Accessing the value of actual_price
                  return actual_price && value
                    ? parseFloat(actual_price) > parseFloat(value)
                    : true;
                }
              )
              .required("Offer Price is required"),
            product_pricing: Yup.array()
              .of(
                Yup.object().shape({
                  price_name_id: Yup.string().required(
                    "Pricing Name is required"
                  ),
                  actual_price: Yup.string()
                    .trim()
                    .required("MRP Price is required"),
                  price: Yup.string()
                    .test(
                      "price",
                      "Offer Price must be less than MRP Price",
                      function (value: any) {
                        const { actual_price } = this.parent; // Accessing the value of actual_price
                        return actual_price && value
                          ? parseFloat(actual_price) > parseFloat(value)
                          : true;
                      }
                    )
                    .required("Offer Price is required"),
                })
              )
              .test(
                "unique-names",
                "Price classes must be unique. Please ensure that each price class is selected only once.",
                function (value: any) {
                  const names = value?.map((v: any) => v.price_name_id);
                  const uniqueNames = new Set(names);
                  return names.length === uniqueNames.size;
                }
              ),
          })
        )
        .test(
          "unique-names",
          "Product Sizes must be unique",
          function (value: any) {
            const names = value?.map((v: any) => v.size);
            const uniqueNames = new Set(names);
            return names?.length === uniqueNames.size;
          }
        ),
    otherwise: () => Yup.array().notRequired(),
  }),
});
export default function ModifyProducts() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  let dispatch = useAppDispatch();
  const token = GetToken();
  const navigate = useNavigate();
  const FileRef = useRef(); //Ref For Image
  const [pricingViewId, setpricingViewId] = useState(null);
  // Dropdown Lists
  const [taxList, setTaxList] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const [SubCategoryList, setSubCategoryList] = useState([]);

  const [productList, setProductList] = useState([]);
  const [priceNameList, setPriceNameList] = useState([]);
  const [weightMeasureList, setWeightMeasureList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [multipleList, setMultipleList] = useState({
    relatedProduct: [],
    supplierList: [],
  });
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
      has_variants: null,
      product_assured: 0,
      name: "",
      product_code: "",
      short_description: "",
      min_order_qty: "",
      max_order_qty: "",
      short_description_mob: "",
      description: "",
      description_mob: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      seo_url: "",
      product_tags: "",
      model: "",
      actual_price: "",
      price: "",
      weight: "",
      brand_id: null,
      product_supplier_ids: null,
      // discount: "",
      tax_class_id: null,
      weight_measure_id: null,
      hsn_id: "",
      hsn_code: "",
      img_path: "",
      img_alt: "",
      thumb_path: "",
      sort_order: "",
      product_category_id: null,
      category_id: null,
      related_products_id: "",
      product_variants: [
        {
          size: "",
          price: "",
          weight: "",
          actual_price: "",
          product_pricing: [
            {
              price: "",
              price_name_id: null,
              actual_price: "",
            },
          ],
        },
      ],
      product_vehicle: [
        {
          vehicle_id: null,
          value: "",
          min_volume: "",
          max_volume: "",
        },
      ],
      product_attribute: [],
      product_pricing: [],
      pricing_type: null,
      points: "",
      //Only for Deleted options ,not for api calls

      taxclassName: "",
      unitName: "",
    },
    validateOnMount: true,
    validationSchema,
    onSubmit(values) {
      if (type === "Create") {
        handleCreateProduct(values);
      } else if (type === "Update") {
        handleUpdateProduct(values);
      }
    },
  });

  // Create product service

  const handleCreateProduct = (values: ProductsProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      taxclassName: "",
      unitName: "",
      product_vehicle: values?.product_vehicle
        ? StringifyObj(values?.product_vehicle)
        : "",
      product_attribute: values?.product_attribute
        ? StringifyObj(values?.product_attribute)
        : "",

      category_id: "",
      ...getVariantDatas(),
      img_path: CheckFileType(values?.img_path),
    });

    CreateProductsService(finalObj)
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
  const getVariantDatas = () => {
    if (values?.has_variants === 1) {
      return {
        weight: values?.weight,
        actual_price: values?.actual_price,
        price: values?.price,
        product_variants: [],
        product_pricing: values?.product_pricing
          ? StringifyObj(values?.product_pricing)
          : "",
      };
    } else
      return {
        weight: "",
        actual_price: "",
        price: "",
        product_pricing: "",
        product_variants: StringifyObj(values?.product_variants),
      };
  };
  const handleUpdateProduct = (values: ProductsProps) => {
    isLoading(true);
    const finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      taxclassName: "",
      unitName: "",

      product_id: state?.UpdateData?.id,
      product_vehicle: values?.product_vehicle
        ? StringifyObj(values?.product_vehicle)
        : "",
      product_attribute: values?.product_attribute
        ? StringifyObj(values?.product_attribute)
        : "",
      ...getVariantDatas(),
      img_path: CheckFileType(values?.img_path),
      category_id: "",
    });
    UpdateProductsService(finalObj)
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

  const getErrors = (index: number, key: string, main_key: string) => {
    // @ts-ignore
    if (errors[main_key]?.[index]?.[key] && touched[main_key]) {
      // @ts-ignore
      return errors[main_key]?.[index]?.[key];
    } else return "";
  };

  const AttributeTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: classes.tableXSbox,
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Attribute",
      key: "attribute_id",
      className: classes.tableMDbox,
      render: (text: any, current, index) => (
        <CommonSelect
          placeholder="Select Attribute"
          options={attributeList}
          value={text}
          onChange={(data) => {
            setFieldValue(`product_attribute[${index}].attribute_id`, data);
          }}
          errorText={getErrors(index, "attribute_id", "product_attribute")}
        />
      ),
    },
    {
      lable: "Content",
      key: "content",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.content}
          placeholder="Enter content"
          value={text}
          onChange={(data) => {
            setFieldValue(`product_attribute[${index}].content`, data);
          }}
          errorText={getErrors(index, "content", "product_attribute")}
        />
      ),
    },
    {
      lable: (
        <CommonImageBox
          source={Images.ADD_ICON}
          alt="add icon"
          type="tableIcon"
          onClick={() => {
            if (!errors?.product_attribute) {
              setFieldValue("product_attribute", [
                {
                  attribute_id: null,
                  content: "",
                },
                ...values.product_attribute,
              ]);
            } else {
              setFieldTouched("product_attribute", true);
            }
          }}
        />
      ),
      className: classes.tableXSbox,
      key: "",
      render: (text: any, data, index) => (
        <>
          <CommonImageBox
            source={Images.CANCEL_ICON}
            alt="add icon"
            type="tableIcon"
            onClick={() => {
              if (data?.product_attribute_id) {
                handleDeleteProductAttribute(data.product_attribute_id);
              } else {
                setFieldValue(
                  "product_attribute",
                  values.product_attribute.filter((elem, ind) => ind !== index)
                );
              }
            }}
          />
        </>
      ),
    },
  ];
  const VehicleTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: classes.tableXSbox,
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Vehicle",
      key: "vehicle_id",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <CommonSelect
          placeholder="Select Vehicle"
          options={vehicleList}
          value={text}
          onChange={(data) => {
            setFieldValue(`product_vehicle[${index}].vehicle_id`, data);
          }}
          errorText={getErrors(index, "vehicle_id", "product_vehicle")}
        />
      ),
    },
    {
      lable: "Price (per Km)",
      key: "value",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.Weight}
          placeholder="Enter Price"
          value={text}
          validationType="AMOUNT"
          onChange={(data) => {
            setFieldValue(`product_vehicle[${index}].value`, data);
          }}
          errorText={getErrors(index, "value", "product_vehicle")}
        />
      ),
    },
    {
      lable: "Min Volume",
      key: "min_volume",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.Weight}
          placeholder="Enter Min Volume"
          value={text}
          validationType="AMOUNT"
          onChange={(data) => {
            setFieldValue(`product_vehicle[${index}].min_volume`, data);
          }}
          errorText={getErrors(index, "min_volume", "product_vehicle")}
        />
      ),
    },
    {
      lable: "Max Volume",
      key: "max_volume",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.Weight}
          placeholder="Enter Max Volume"
          value={text}
          validationType="AMOUNT"
          onChange={(data) => {
            setFieldValue(`product_vehicle[${index}].max_volume`, data);
          }}
          errorText={getErrors(index, "max_volume", "product_vehicle")}
        />
      ),
    },
    {
      lable: (
        <CommonImageBox
          source={Images.ADD_ICON}
          alt="add icon"
          type="tableIcon"
          onClick={() => {
            if (!errors?.product_vehicle) {
              setFieldValue("product_vehicle", [
                {
                  vehicle_id: null,
                  value: "",
                  min_volume: "",
                  max_volume: "",
                },
                ...values.product_vehicle,
              ]);
            } else {
              setFieldTouched("product_vehicle", true);
            }
          }}
        />
      ),
      className: classes.tableXSbox,
      key: "",
      render: (text: any, _, index) =>
        values?.product_vehicle?.length > 1 ? (
          <>
            <CommonImageBox
              source={Images.CANCEL_ICON}
              alt="add icon"
              type="tableIcon"
              onClick={() => {
                setFieldValue(
                  "product_vehicle",
                  values.product_vehicle.filter((_, ind) => ind !== index)
                );
              }}
            />
          </>
        ) : (
          ""
        ),
    },
  ];

  const handleDeleteProductAttribute = (id: number) => {
    isLoading(true);
    let finalObj = { token, product_attribute_id: id };
    DeleteProductAttributeService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          ViewProductsList();
          setFieldValue(
            "product_attribute",
            values.product_attribute.filter((elem: any, ind) => elem?.id !== id)
          );
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const handleDeleteProductPriceClass = (id: number) => {
    isLoading(true);
    let finalObj = { token, price_mapping_id: id };
    DeleteProductPriceClassService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          ViewProductsList();
          setFieldValue(
            "product_pricing",
            values.product_pricing.filter(
              (elem: any) => elem?.price_mapping_id !== id
            )
          );
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const PricingTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: classes.tableXSbox,
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Price Name",
      key: "price_name_id",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonSelect
            placeholder="Select Price Name"
            options={priceNameList}
            value={text}
            onChange={(data) => {
              setFieldValue(`product_pricing[${index}].price_name_id`, data);
            }}
            errorText={getErrors(index, "price_name_id", "product_pricing")}
          />
        </>
      ),
    },
    {
      lable: "MRP Price (₹)",
      key: "actual_price",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter MRP Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_pricing[${index}].actual_price`, data);
            }}
            errorText={getErrors(index, "actual_price", "product_pricing")}
          />
        </>
      ),
    },
    {
      lable: "Offer Price (₹)",
      key: "price",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_pricing[${index}].price`, data);
            }}
            errorText={getErrors(index, "price", "product_pricing")}
          />
        </>
      ),
    },
    {
      lable: (
        <CommonImageBox
          source={Images.ADD_ICON}
          alt="add icon"
          type="tableIcon"
          onClick={() => {
            if (!errors?.product_pricing) {
              setFieldValue("product_pricing", [
                {
                  price_name_id: null,
                  price: "",
                  actual_price: "",
                },
                ...values.product_pricing,
              ]);
            } else {
              setFieldTouched("product_pricing", true);
            }
          }}
        />
      ),
      className: classes.tableXSbox,
      key: "",
      render: (text: any, data, index) => (
        <>
          <CommonImageBox
            source={Images.CANCEL_ICON}
            alt="add icon"
            type="tableIcon"
            onClick={() => {
              if (data?.price_mapping_id) {
                handleDeleteProductPriceClass(data.price_mapping_id);
              } else {
                setFieldValue(
                  "product_pricing",
                  values.product_pricing.filter((elem, ind) => ind !== index)
                );
              }
            }}
          />
        </>
      ),
    },
  ];
  const ProductVarientTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: classes.tableXSbox,
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Size",
      key: "size",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter size"
            value={text}
            validationType={"PREVENT_EMOJI"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].size`, data);
            }}
            errorText={getErrors(index, "size", "product_variants")}
          />
        </>
      ),
    },
    {
      lable: "MRP Price (₹)",
      key: "actual_price",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].actual_price`, data);
            }}
            errorText={getErrors(index, "actual_price", "product_variants")}
          />
        </>
      ),
    },
    {
      lable: "Offer Price (₹)",
      key: "price",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].price`, data);
            }}
            errorText={getErrors(index, "price", "product_variants")}
          />
        </>
      ),
    },

    {
      lable: "Weight",
      key: "weight",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Weight"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].weight`, data);
            }}
            errorText={getErrors(index, "weight", "product_variants")}
          />
        </>
      ),
    },
    {
      lable: "Product Pricing",
      key: "prodct_pricing",
      render: (data, obj, ind) => {
        return (
          <CommonImageBox
            alt="priceTag"
            type="tableIcon"
            source={Images.PriceTagIcon}
            onClick={() => {
              setpricingViewId(ind === pricingViewId ? null : ind);
            }}
          />
        );
      },
    },
    {
      lable: (
        <CommonImageBox
          source={Images.ADD_ICON}
          alt="add icon"
          type="tableIcon"
          onClick={() => {
            if (!errors?.product_variants) {
              setFieldValue("product_variants", [
                {
                  size: "",
                  price: "",
                  weight: "",
                  actual_price: "",
                  product_pricing: [
                    {
                      price: "",
                      actual_price: "",
                      price_name_id: null,
                    },
                  ],
                },
                ...values.product_variants,
              ]);
            } else {
              setFieldTouched("product_variants", true);
            }
          }}
        />
      ),
      className: classes.tableXSbox,
      key: "",
      render: (text: any, data, index) =>
        values?.product_variants?.length === 1 ? (
          ""
        ) : (
          <>
            <CommonImageBox
              source={Images.CANCEL_ICON}
              alt="add icon"
              type="tableIcon"
              onClick={() => {
                if (data?.price_mapping_id) {
                  handleDeleteProductPriceClass(data.price_mapping_id);
                } else {
                  setFieldValue(
                    "product_variants",
                    values.product_variants.filter((elem, ind) => ind !== index)
                  );
                }
              }}
            />
          </>
        ),
    },
  ];

  const getTaxDropdown = () => {
    let finalObj = { token: token, type: 1 };

    TaxClassDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.title, value: ele?.id };
          });
          setTaxList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const getAttributeDropdown = () => {
    let finalObj = { token: token };

    AttributeDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return {
              label: ele.title,
              title: ele?.title,
              options: ele?.attribute?.map((data: any) => ({
                label: data?.title,
                value: data?.id,
              })),
            };
          });
          setAttributeList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const getPriceNameDropdown = () => {
    let finalObj = { token: token };

    PriceNameDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.title, value: ele?.id };
          });
          setPriceNameList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const getWeightMeasureDropdown = () => {
    let finalObj = { token: token };

    WeightMeasureIdDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return { label: ele.name, value: ele?.id };
          });
          setWeightMeasureList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const getCategoryDropdown = (parent_id?: number) => {
    let finalObj = { token: token, type: parent_id ? 2 : 1, parent_id };

    CategoryDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return {
              value: ele.id,
              label: ele?.name,
            };
          });
          if (parent_id) {
            setSubCategoryList(finalList);
          } else {
            setCategoryList(finalList);
          }
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };
  const getVehicleDropdown = () => {
    let finalObj = { token: token };
    VehicleDropdownService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => {
            return {
              value: ele.vehicle_id,
              label: ele?.name,
            };
          });
          setVehicleList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const getProductDropdown = () => {
    let finalObj = { token: token, type: 1 };

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

  const handleUpdateData = (editData: any) => {
    setMultipleList({
      relatedProduct: editData?.related_product?.map((ele: ObjectType) => ({
        label: ele?.name,
        value: ele?.product_id,
      })),
      supplierList: editData?.suppliers?.map((ele: ObjectType) => ({
        label: ele?.supplier_name,
        value: ele?.supplier_id,
      })),
    });
    if (editData?.category[0]?.category_id) {
      getCategoryDropdown(editData?.category[0]?.parent_id);
    }
    setValues({
      product_assured: editData?.product_assured || null,
      has_variants: editData?.has_variants || null,
      name: editData?.name || "",
      product_code: editData?.product_code || "",
      brand_id: editData?.brand_id || null,
      product_supplier_ids:
        editData?.suppliers?.map((ele: any) => ele?.supplier_id) || null,
      pricing_type: editData?.pricing_type || null,

      short_description: editData?.short_description || "",
      min_order_qty: editData?.min_order_qty || "",
      max_order_qty: editData?.max_order_qty || "",
      short_description_mob: editData?.short_description_mob || "",
      description: editData?.description || "",
      description_mob: editData?.description_mob || "",
      meta_title: editData?.meta_title || "",
      meta_description: editData?.meta_description || "",
      meta_keywords: editData?.meta_keywords || "",
      seo_url: editData?.seo_url || "",
      product_tags: editData?.product_tags || "",
      model: editData?.model || "",
      actual_price: editData?.actual_price || "",
      price: editData?.price || "",
      weight: editData?.weight || "",
      // discount: editData?.discount || "",
      tax_class_id: editData?.tax_class_id || "",
      weight_measure_id: editData?.weight_measure_id || "",
      hsn_id: editData?.hsn_id || "",
      hsn_code: editData?.hsn_code || "",
      img_path: editData?.img_path || "",
      img_alt: editData?.img_alt || "",
      thumb_path: editData?.thumb_path || "",
      sort_order: editData.sort_order >= 0 ? editData.sort_order : "",
      product_category_id:
        editData?.category?.map((ele: any) => ele?.category_id)[0] || null,
      category_id:
        editData?.category?.map((ele: any) => ele?.parent_id)[0] || null,
      related_products_id:
        editData?.related_product?.map((ele: any) => ele?.product_id) || "",
      product_vehicle:
        editData?.vehicles?.map((ele: any) => ({
          vehicle_id: ele?.vehicle_id,
          min_volume: ele?.min_volume,
          max_volume: ele?.max_volume,
          value: ele?.value,
          product_vehicle_id: ele?.product_vehicle_id,
        })) || "",
      product_attribute:
        editData?.attributes?.map((ele: any) => ({
          attribute_id: ele?.attribute_id,
          content: ele?.content,
          product_attribute_id: ele?.id,
        })) || "",
      product_pricing:
        editData?.price_class?.map((ele: any) => ({
          price_name_id: ele.price_name_id,
          price: ele.price,
          price_mapping_id: ele?.price_mapping_id,
        })) || "",
      product_variants:
        editData?.product_variants_list?.map((ele: any) => ({
          product_variants_id: ele.product_variants_id,
          price: ele.price,
          actual_price: ele?.actual_price,
          size: ele?.size,
          weight: ele?.weight,
          product_pricing:
            ele?.price_class?.map((pricing: any) => ({
              actual_price: pricing?.actual_price,
              price: pricing?.price,
              price_name_id: pricing?.price_name_id,
              price_mapping_id: pricing?.price_mapping_id,
            })) || [],
        })) || "",

      taxclassName: editData?.tax_class_name || "",
      unitName: editData?.weight_measure_name || "",
      points: editData?.points || "",
    });
  };

  const ViewProductsList = () => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      token,
      product_id: state.UpdateData.id,
    });
    ViewProductsService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          handleUpdateData(response.data.data);
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

  const getBrandDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    BrandDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => ({
            label: ele.name,
            value: ele?.brand_id,
          }));

          setBrandList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const getSupplierDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    SupplierDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data?.data?.map((ele: any) => ({
            label: ele.name,
            value: ele?.supplier_id,
          }));

          setSupplierList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        ViewProductsList();
        if (state?.filters) {
          dispatch(UpdateTableFilters(state.filters));
        }
      }
      getVehicleDropdown();
      getAttributeDropdown();
      getPriceNameDropdown();
      getWeightMeasureDropdown();
      getTaxDropdown();
      getCategoryDropdown();
      getProductDropdown();
      getBrandDropdown();
      getSupplierDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <ModifyProductContext.Provider
      value={{
        errors: errors,
        touched: touched,
        values: values,
        setFieldValue: setFieldValue,
        priceNameList: priceNameList,
        setFieldTouched: setFieldTouched,
        setValues: setValues,
      }}
    >
      <div>
        <ScreenHeader
          name={`${state?.type} Product`}
          onClickBackBtn={() => {
            navigate(-1);
          }}
          onClickSaveBtn={() => {
            handleSubmit();
          }}
        />
        <div className={classes.bgContainer}>
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <div className={classes.defaultBlock}>
                <p></p>
                <div>
                  <div>
                    <CommonCheckBox
                      checked={values.product_assured ? true : false}
                      onChange={() => {
                        setFieldValue(
                          "product_assured",
                          values.product_assured ? 0 : 1
                        );
                      }}
                    />
                    <p className="Label">Assured Product?</p>
                  </div>
                </div>
                {errors.product_assured && touched.product_assured ? (
                  <p className="ErroText">{errors.product_assured}</p>
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Product Type"
                options={ProductType}
                placeholder="Select Product Type"
                value={values.has_variants}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("has_variants", data);
                  if (data === 1) {
                    setFieldValue("product_variants", [
                      {
                        size: "",
                        price: "",
                        weight: "",
                        actual_price: "",
                        product_pricing: [],
                      },
                    ]);
                  }
                }}
                disabled={state?.UpdateData ? true : false}
                errorText={
                  errors.has_variants && touched.has_variants
                    ? errors.has_variants
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Name"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Name"
                value={values.name}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("name", data);
                }}
                errorText={errors.name && touched.name ? errors.name : ""}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Product Code"
                maxLength={INPUT_LENGTHS.productCode}
                placeholder="Enter Product Code"
                value={values.product_code}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("product_code", data);
                }}
                errorText={
                  errors.product_code && touched.product_code
                    ? errors.product_code
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Model"
                maxLength={INPUT_LENGTHS.Model}
                placeholder="Enter Model"
                value={values.model}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("model", data);
                }}
                errorText={errors.model && touched.model ? errors.model : ""}
              />
            </Col>
            {values?.has_variants === 1 && (
              <>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                  <CommonInput
                    lable="MRP Price"
                    maxLength={INPUT_LENGTHS.Price}
                    placeholder="Enter MRP Price"
                    value={values.actual_price}
                    isRequired={true}
                    onChange={(data) => {
                      setFieldValue("actual_price", data);
                    }}
                    validationType={"AMOUNT"}
                    errorText={
                      errors.actual_price && touched.actual_price
                        ? errors.actual_price
                        : ""
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                  <CommonInput
                    lable="Offer Price"
                    isRequired
                    maxLength={INPUT_LENGTHS.Price}
                    placeholder="Enter Offer Price"
                    value={values.price}
                    onChange={(data) => {
                      setFieldValue("price", data);
                    }}
                    validationType={"AMOUNT"}
                    errorText={
                      errors.price && touched.price ? errors.price : ""
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                  <CommonInput
                    lable="Weight"
                    maxLength={INPUT_LENGTHS.Weight}
                    placeholder="Enter Weight"
                    value={values.weight}
                    isRequired={true}
                    onChange={(data) => {
                      setFieldValue("weight", data);
                    }}
                    validationType={"AMOUNT"}
                    errorText={
                      errors.weight && touched.weight ? errors.weight : ""
                    }
                  />
                </Col>
              </>
            )}
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Brand"
                options={brandList}
                placeholder="Select Brand"
                value={values.brand_id}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("brand_id", data);
                }}
                errorText={
                  errors.brand_id && touched.brand_id ? errors.brand_id : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Suppliers"
                options={supplierList}
                placeholder="Select Supplier"
                value={values.product_supplier_ids}
                isRequired={true}
                optionName={multipleList?.supplierList}
                onChange={(data, option) => {
                  setFieldValue("product_supplier_ids", data);
                  setMultipleList((pre) => ({
                    ...pre,
                    supplierList: option,
                  }));
                }}
                mode="multiple"
                errorText={
                  errors.product_supplier_ids && touched.product_supplier_ids
                    ? errors.product_supplier_ids
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Pricing Type"
                options={PricingType}
                placeholder="Select Pricing Type"
                value={values.pricing_type}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("pricing_type", data);
                }}
                errorText={
                  errors.pricing_type && touched.pricing_type
                    ? errors.pricing_type
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Points "
                maxLength={INPUT_LENGTHS.Price}
                placeholder="Enter Points"
                value={values.points}
                isRequired={true}
                acceptZero
                onChange={(data) => {
                  setFieldValue("points", data);
                }}
                validationType="AMOUNT"
                errorText={errors.points && touched.points ? errors.points : ""}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Unit"
                options={weightMeasureList}
                placeholder="Select Unit"
                value={values.weight_measure_id}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("weight_measure_id", data);
                }}
                errorText={
                  errors.weight_measure_id && touched.weight_measure_id
                    ? errors.weight_measure_id
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="HSN Code "
                maxLength={INPUT_LENGTHS.HSN_Code}
                placeholder="Enter HSN Code "
                value={values.hsn_code}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("hsn_code", data);
                }}
                errorText={
                  errors.hsn_code && touched.hsn_code ? errors.hsn_code : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Tax Class"
                options={taxList}
                placeholder="Enter Tax Class"
                value={values.tax_class_id}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("tax_class_id", data);
                }}
                errorText={
                  errors.tax_class_id && touched.tax_class_id
                    ? errors.tax_class_id
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Min Quantity "
                maxLength={INPUT_LENGTHS.Quantity}
                placeholder="Enter Min Quantity "
                value={values.min_order_qty}
                isRequired={true}
                onChange={(data) => {
                  if (data > 0 || data === "") {
                    setFieldValue("min_order_qty", data);
                  }
                }}
                validationType={"NUMBER"}
                errorText={
                  errors.min_order_qty && touched.min_order_qty
                    ? errors.min_order_qty
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Max Quantity "
                maxLength={INPUT_LENGTHS.Quantity}
                placeholder="Enter Max Quantity "
                value={values.max_order_qty}
                onChange={(data) => {
                  if (data > 0 || data === "") {
                    setFieldValue("max_order_qty", data);
                  }
                }}
                validationType={"NUMBER"}
                errorText={
                  errors.max_order_qty && touched.max_order_qty
                    ? errors.max_order_qty
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Product Tags "
                maxLength={INPUT_LENGTHS.Tags}
                placeholder="Enter Product Tags "
                value={values.product_tags}
                onChange={(data) => {
                  setFieldValue("product_tags", data);
                }}
                // validationType="PREVENT_SPECIAL_CHAR"
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Category"
                options={CategoryList}
                placeholder="Select Category"
                value={values?.category_id}
                onChange={(data) => {
                  setFieldValue("category_id", data);
                  setValues({
                    ...values,
                    category_id: data,
                    product_category_id: null,
                  });
                  getCategoryDropdown(data);
                }}
                isRequired={true}
                errorText={
                  errors.category_id && touched.category_id
                    ? errors.category_id
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Sub Category"
                options={SubCategoryList}
                disabled={!values?.category_id}
                placeholder="Select Sub Category"
                value={values?.product_category_id}
                onChange={(data) => {
                  setFieldValue("product_category_id", data);
                }}
                // optionName={""}
                isRequired={true}
                errorText={
                  errors.product_category_id && touched.product_category_id
                    ? errors.product_category_id
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonSelect
                lable="Related Products"
                options={productList?.filter((ele: OptionTypes) =>
                  type === "Update" ? ele?.value !== state?.UpdateData?.id : ele
                )}
                placeholder="Select Related Products"
                value={
                  values.related_products_id.length <= 0
                    ? null
                    : values.related_products_id
                }
                onChange={(data, option) => {
                  setFieldValue("related_products_id", data);

                  setMultipleList((pre) => ({
                    ...pre,
                    relatedProduct: option,
                  }));
                }}
                optionName={multipleList?.relatedProduct}
                mode="multiple"
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="SEO URL"
                maxLength={INPUT_LENGTHS.SEO_URL}
                placeholder="Enter SEO URL"
                value={values.seo_url}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("seo_url", data);
                }}
                validationType="SEO_URL"
                errorText={
                  errors.seo_url && touched.seo_url ? errors.seo_url : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonFileInput
                lable="Main Image"
                fileRef={FileRef}
                isRequired={true}
                type="image"
                value={values.img_path}
                OnChange={(event) => {
                  setFieldValue("img_path", event);
                }}
                // handleClear={() => {
                //   setFieldValue("img_path", "");
                // }}
                errorText={
                  errors.img_path && touched.img_path ? errors.img_path : ""
                }
                imagePath={values.img_path}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Alternate Image Name"
                maxLength={INPUT_LENGTHS.ImageAlt}
                isRequired={true}
                placeholder="Enter Alternate Image Name"
                value={values.img_alt}
                onChange={(data) => {
                  setFieldValue("img_alt", data);
                }}
                errorText={
                  errors.img_alt && touched.img_alt ? errors.img_alt : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Short Description (Web)"
                maxLength={INPUT_LENGTHS.showDiscription}
                placeholder="Enter Short Description"
                value={values.short_description}
                onChange={(data) => {
                  setFieldValue("short_description", data);
                }}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Short Description (Mobile)"
                maxLength={INPUT_LENGTHS.showDiscription}
                placeholder="Enter Short Description (Mobile)"
                value={values.short_description_mob}
                onChange={(data) => {
                  setFieldValue("short_description_mob", data);
                }}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Meta Title "
                maxLength={INPUT_LENGTHS.metaTitle}
                placeholder="Enter Meta Title "
                value={values.meta_title}
                isRequired={true}
                onChange={(data) => {
                  setFieldValue("meta_title", data);
                }}
                errorText={
                  errors.meta_title && touched.meta_title
                    ? errors.meta_title
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonInput
                lable="Sort Order"
                validationType={"NUMBER"}
                maxLength={INPUT_LENGTHS.sortOrder}
                placeholder="Enter Sort Order"
                value={values.sort_order}
                onChange={(data) => {
                  setFieldValue("sort_order", data);
                }}
                isRequired={true}
                errorText={
                  errors.sort_order && touched.sort_order
                    ? errors.sort_order
                    : ""
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonTextArea
                maxLength={INPUT_LENGTHS.description}
                placeholder="Enter Description (Web)"
                value={values.description}
                onChange={(data) => {
                  setFieldValue("description", data);
                }}
                validationType="PREVENT_SPECIAL_CHAR"
                lable="Description (Web)"
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonTextArea
                maxLength={INPUT_LENGTHS.description}
                placeholder="Enter Description (Mobile)"
                value={values.description_mob}
                onChange={(data) => {
                  setFieldValue("description_mob", data);
                }}
                validationType="PREVENT_SPECIAL_CHAR"
                lable="Description (Mobile)"
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonTextArea
                lable="Meta Description"
                maxLength={INPUT_LENGTHS.description}
                placeholder="Enter Meta Description"
                value={values.meta_description}
                onChange={(data) => {
                  setFieldValue("meta_description", data);
                }}
                validationType="PREVENT_SPECIAL_CHAR"
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <CommonTextArea
                lable="Meta Keywords"
                maxLength={INPUT_LENGTHS.metaKeywords}
                placeholder="Enter Meta Keywords"
                value={values.meta_keywords}
                validationType="PREVENT_SPECIAL_CHAR"
                onChange={(data) => {
                  setFieldValue("meta_keywords", data);
                }}
              />
            </Col>

            {values?.has_variants === 2 && (
              <Col xs={24}>
                <p className="Label">Product Varients</p>
                {errors?.product_variants &&
                  typeof errors?.product_variants === "string" &&
                  touched?.product_variants && (
                    <CommonAlter
                      msg={errors?.product_variants}
                      showIcon
                      style={{ margin: "10px 10px" }}
                      type="error"
                    />
                  )}
                <PricingTable />
              </Col>
            )}
            <Col xs={24}>
              <p className="Label">Product Vehicle</p>
              <GlobalTable
                Options={VehicleTableOptions}
                items={values?.product_vehicle}
                total={values?.product_vehicle.length}
                ismodify={true}
              />
              {errors?.product_vehicle &&
                typeof errors?.product_vehicle === "string" &&
                touched?.product_vehicle && (
                  <CommonAlter
                    msg={errors?.product_vehicle}
                    showIcon
                    style={{ margin: "10px 10px" }}
                    type="error"
                  />
                )}
            </Col>
            <Col xs={24}>
              <p className="Label">Product Attributes</p>
              <GlobalTable
                Options={AttributeTableOptions}
                items={values?.product_attribute}
                total={values?.product_attribute.length}
                ismodify={true}
              />
              {errors?.product_attribute &&
                typeof errors?.product_attribute === "string" &&
                touched?.product_attribute && (
                  <CommonAlter
                    msg={errors?.product_attribute}
                    showIcon
                    style={{ margin: "10px 10px" }}
                    type="error"
                  />
                )}
            </Col>
            {values?.has_variants === 1 && (
              <Col xs={24}>
                <p className="Label mb-2">Price Tags</p>
                <GlobalTable
                  Options={PricingTableOptions}
                  items={values?.product_pricing}
                  total={values?.product_pricing.length}
                  ismodify={true}
                />
                {/* <p>{error}</p> */}
                {errors?.product_pricing &&
                  typeof errors?.product_pricing === "string" &&
                  touched.product_pricing && (
                    <CommonAlter
                      msg={errors.product_pricing}
                      showIcon
                      style={{ margin: "10px 10px" }}
                      type="error"
                    />
                  )}
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
    </ModifyProductContext.Provider>
  );
}
