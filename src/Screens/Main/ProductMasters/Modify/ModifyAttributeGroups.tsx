import { useLocation, useNavigate } from "react-router";
import * as Yup from "yup";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import { useFormik } from "formik";
import { AttributeGroupsProps } from "../../../../@Types/ComponentProps";
import { ConvertJSONtoFormData, getCatchMsg } from "../../../../Shared/Methods";
import {
  CreateAttrubuteGroupsService,
  RemoveAttrubuteService,
  UpdateAttrubuteGroupsService,
} from "../../../../Service/ApiMethods";
import toast from "react-hot-toast";
import { useEffect } from "react";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import classes from "../../main.module.css";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { Col, Row } from "antd";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import { Images } from "../../../../Shared/ImageExport";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim("Please remove leading and trailing spaces")
    .strict(true)
    .required("Title is required"),
  sort_order: Yup.string().required("Sort Order is required"),
  attribute_list: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .trim("Please remove leading and trailing spaces")
        .strict(true)
        .required("Title is required"),
      sort_order: Yup.string().required("Sort Order is required"),
    })
  ),
});
export default function ModifyAttributeGroups() {
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  let dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      title: "",
      sort_order: "",
      attribute_list: [],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit(values) {
      if (type === "Create") {
        handleCreateAttributeGroups(values);
      } else if (type === "Update") {
        handleUpdateAttributeGroups(values);
      }
    },
  });

  const handleCreateAttributeGroups = (values: AttributeGroupsProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateAttrubuteGroupsService(finalObj)
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
  const handleUpdateAttributeGroups = (values: AttributeGroupsProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,

      attribute_group_id: state?.UpdateData?.attribute_group_id,
    };
    UpdateAttrubuteGroupsService(finalObj)
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
    if (errors?.[main_key]?.[index]?.[key] && touched[main_key]) {
      // @ts-ignore
      return errors?.[main_key]?.[index]?.[key];
    } else return "";
  };
  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Title",
      key: "title",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.title}
          placeholder="Enter Title"
          value={text}
          onChange={(data) => {
            setFieldValue(`attribute_list[${index}].title`, data);
          }}
          errorText={getErrors(index, "title", "attribute_list")}
        />
      ),
    },
    {
      lable: "Sort Order",
      key: "sort_order",
      className: classes.tableSmallbox,
      render: (text: any, current, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={text}
          validationType="NUMBER"
          onChange={(data) => {
            setFieldValue(`attribute_list[${index}].sort_order`, data);
          }}
          errorText={getErrors(index, "sort_order", "attribute_list")}
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
            if (!errors?.attribute_list) {
              setFieldValue("attribute_list", [
                {
                  title: "",
                  sort_order: "",
                },
                ...values.attribute_list,
              ]);
            } else {
              setFieldTouched("attribute_list", true);
            }
          }}
        />
      ),
      key: "",
      className: "contant2_width",
      render: (text: any, data, index) => (
        <>
          <img
            src={Images.CANCEL_ICON}
            alt="Cancel Icon"
            className={classes.TableIcons}
            onClick={() => {
              if (data.attribute_id) {
                RemoveAttribute(data.attribute_id);
              } else {
                setFieldValue(
                  "attribute_list",
                  values.attribute_list.filter((elem, ind) => ind !== index)
                );
              }
            }}
          />
        </>
      ),
    },
  ];

  const RemoveAttribute = (id: number) => {
    isLoading(true);
    let finalObj = {
      token,
      attribute_id: id,
    };
    RemoveAttrubuteService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data?.status === 1) {
          toast.success(response.data.msg);
          setFieldValue(
            "attribute_list",
            values.attribute_list.filter(
              (elem: any) => elem.attribute_id !== id
            )
          );
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      if (state?.UpdateData) {
        setValues({
          title: state?.UpdateData?.title || "",
          sort_order:
            state?.UpdateData.sort_order >= 0
              ? state?.UpdateData.sort_order
              : "",
          attribute_list: state?.UpdateData?.attribute
            ? state?.UpdateData?.attribute?.map((ele: any) => ({
                sort_order: ele.sort_order >= 0 ? ele.sort_order : "",
                title: ele?.title || "",
                attribute_id: ele?.id,
              }))
            : "",
        });
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
        name={`${state?.type} Attribute Group`}
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
              validationType={"NUMBER"}
              maxLength={INPUT_LENGTHS.sortOrder}
              placeholder="Enter Sort Order"
              value={values.sort_order}
              onChange={(data) => {
                setFieldValue("sort_order", data);
              }}
              isRequired={true}
              errorText={
                errors.sort_order && touched.sort_order ? errors.sort_order : ""
              }
            />
          </Col>
          <Col xs={24}>
            <GlobalTable
              Options={TableOptions}
              items={values?.attribute_list}
              total={values?.attribute_list.length}
              ismodify={true}
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
