import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import classes from "../../main.module.css";
import { getCatchMsg, getPermissionData } from "../../../../Shared/Methods";
import {
  CreateTaxService,
  StateDropdownService,
  TaxRateDropdownService,
  UpdateTaxService,
} from "../../../../Service/ApiMethods";
import { TaxProps } from "../../../../@Types/ComponentProps";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import CommonSelect from "../../../../Components/FormFields/CommonSelect";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { DropdownTypes } from "../../../../@Types/ApiDataTypes";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import CommonAlter from "../../../../Components/UIComponents/CommonAlter";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  description: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Description is required"),
  tax_rate: Yup.array()
    .of(
      Yup.object().shape({
        // state_id: Yup.string().required("State is required"),
        name: Yup.string()
          .trim("Please remove leading and trailing spaces")
          .strict(true)
          .required("Name is required"),
        rate: Yup.string().required("Tax rate is required"),
        tax_type: Yup.string().required("Tax type is required"),
      })
    )
    .test("unique-names", "Tax names must be unique", function (value: any) {
      const names = value.map((v: any) => v.name);
      const uniqueNames = new Set(names);
      return names.length === uniqueNames.size;
    }),
});
export default function ModifyTax() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  let dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [stateList, setStateList] = useState<DropdownTypes[]>([]);
  const [TaxList, setTaxList] = useState<DropdownTypes[]>([]);
  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
        tax_rate: [
          {
            state_id: null,
            name: "",
            rate: "",
            tax_type: 1,
          },
          {
            state_id: 35,
            name: "",
            rate: "",
            tax_type: 2,
          },
          {
            state_id: 35,
            name: "",
            rate: "",
            tax_type: 3,
          },
        ],
      },
      validationSchema,
      onSubmit(values) {
        if (type === "Create") {
          handleCreateTax(values);
        } else if (type === "Update") {
          handleUpdateTax(values);
        }
      },
    });

  const handleCreateTax = (values: TaxProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      tax_rate: values?.tax_rate,
    };
    CreateTaxService(finalObj)
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
  const handleUpdateTax = (values: TaxProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
      tax_class_id: state?.UpdateData?.id,
      tax_rate: values?.tax_rate,
    };
    UpdateTaxService(finalObj)
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
  const getErrors = (index: number, key: string) => {
    // @ts-ignore
    if (errors?.["tax_rate"]?.[index]?.[key] && touched["tax_rate"]) {
      // @ts-ignore
      return errors?.["tax_rate"]?.[index]?.[key];
    } else return "";
  };

  const TableOptions: TableOptionsType[] = [
    {
      lable: "Type",
      key: "type",
      className: classes.tableSmallbox,
      render: (text: any, _, index) => (
        <CommonSelect
          disabled={true}
          options={TaxList}
          isRequired={true}
          value={TaxList[index]?.label}
          placeholder="Enter Type"
          errorText={getErrors(index, "type")}
        />
      ),
    },
    {
      lable: "Name",
      key: "name",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          disabled={type === "View"}
          maxLength={INPUT_LENGTHS.Name}
          placeholder="Enter Name"
          value={text}
          onChange={(data) => {
            setFieldValue(
              "tax_rate",
              values?.tax_rate?.map((ele, ind) =>
                ind === index ? { ...ele, name: data } : ele
              )
            );
          }}
          errorText={getErrors(index, "name")}
        />
      ),
    },
    {
      lable: "State",
      key: "state_id",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonSelect
          options={stateList}
          disabled={true}
          value={index === 0 ? "Other States" : text}
          placeholder="Select State"
          // onChange={(data) => {
          //   setFieldValue(
          //     "tax_rate",
          //     values?.tax_rate?.map((ele, ind) =>
          //       ind === index ? { ...ele, state_id: data } : ele
          //     )
          //   );
          // }}
          errorText={getErrors(index, "state_id")}
        />
      ),
    },
    {
      lable: "Percent (%)",
      key: "rate",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          disabled={type === "View"}
          maxLength={INPUT_LENGTHS.percentage}
          placeholder="Enter Percent"
          value={text}
          validationType={"AMOUNT"}
          onChange={(data) => {
            if (data <= 100) {
              setFieldValue(
                "tax_rate",
                values?.tax_rate?.map((ele, ind) =>
                  ind === index ? { ...ele, rate: data } : ele
                )
              );
            }
          }}
          errorText={getErrors(index, "rate")}
        />
      ),
    },
  ];
  const getStateDropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    StateDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response.data.data?.map((ele: any) => {
            return { label: ele?.name, value: ele?.id };
          });
          setStateList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  const getTaxRateDropdown = () => {
    let formData: any = new FormData();
    formData.append("token", token);
    TaxRateDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          setTaxList(
            response.data.data?.map((ele: any) => ({
              label: ele?.name,
              value: ele?.id,
            }))
          );
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      });
  };

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        setValues({
          title: state?.UpdateData?.title || "",
          description: state?.UpdateData?.description || "",
          tax_rate:
            state?.UpdateData?.tax_rate?.map((ele: any) => {
              return {
                state_id: ele?.state_id || null,
                name: ele?.name || "",
                rate: ele?.rate || "",
                tax_type: ele?.tax_type || "",
                description: ele?.description || "",
                tax_rate_id: ele?.id,
              };
            }) || "",
        });
      }
      if (state?.filters) {
        dispatch(UpdateTableFilters(state.filters));
      }
      getStateDropdown();
      getTaxRateDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`${state?.type} Tax`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={
          type === "View"
            ? false
            : () => {
                handleSubmit();
              }
        }
      />
      <div className={classes.bgContainer}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <CommonInput
              lable="Title"
              maxLength={INPUT_LENGTHS.title}
              placeholder="Enter Title"
              disabled={type === "View" ? true : false}
              value={values.title}
              isRequired={true}
              onChange={(data) => {
                setFieldValue("title", data);
              }}
              errorText={errors.title && touched.title ? errors.title : ""}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <CommonTextArea
              maxLength={INPUT_LENGTHS.description}
              isRequired={true}
              placeholder="Enter Description"
              value={values.description}
              disabled={type === "View"}
              onChange={(data) => {
                setFieldValue("description", data);
              }}
              validationType="PREVENT_SPECIAL_CHAR"
              lable="Description"
              errorText={
                errors.description && touched.description
                  ? errors.description
                  : ""
              }
            />
          </Col>

          <Col xs={24}>
            <p className={"Label"}>
              Tax Rates <span className="requiredIcon">*</span>
            </p>
            <GlobalTable
              total={3}
              Options={TableOptions}
              items={values?.tax_rate}
            />

            {errors?.tax_rate &&
              typeof errors?.tax_rate === "string" &&
              touched.tax_rate && (
                <CommonAlter
                  msg={errors.tax_rate}
                  showIcon
                  style={{ marginTop: "10px" }}
                  type="error"
                />
              )}
          </Col>

          {type !== "View" && (
            <Col xs={24}>
              <CommonButton
                type="submit"
                lable={type}
                isright
                handleClickEvent={() => handleSubmit()}
              />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}
