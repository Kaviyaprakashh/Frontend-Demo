import { useLocation, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";

import useLoaderHook from "../../../../Shared/UpdateLoader";
import { GetToken } from "../../../../Shared/StoreData";
import {
  DataListTypes,
  FaqProps,
  ListFaq,
} from "../../../../@Types/ComponentProps";
import {
  ConvertJSONtoFormData,
  FilterValidObj,
  getCatchMsg,
  getPermissionData,
} from "../../../../Shared/Methods";
import {
  CreateFaqService,
  DeleteFaqService,
  ListFaqService,
  UpdateFaqService,
} from "../../../../Service/ApiMethods";

import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import classes from "../../main.module.css";
import CommonInput from "../../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../../Shared/Constants";
import CommonButton from "../../../../Components/Buttons/CommonButton";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import { Images } from "../../../../Shared/ImageExport";
import CommonTextArea from "../../../../Components/FormFields/CommonTextArea";
import CommonPaginaion from "../../../../Components/UIComponents/CommonPagination";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  sortOrder: Yup.string().required("Sort Order is required"),
  listFaqs: Yup.array().of(
    Yup.object().shape({
      question: Yup.string()
        .trim("Please remove leading and trailing spaces")
        .strict(true)
        .required("Question is required"),
      answer: Yup.string()
        .trim("Please remove leading and trailing spaces")
        .strict(true)
        .required("Answer is required"),

      sortOrder: Yup.string().required("Sort Order is required"),
    })
  ),
});
export default function ModifyFaq() {
  const navigate = useNavigate();
  const { state } = useLocation();
  let dispatch = useAppDispatch();
  const { isLoading } = useLoaderHook();
  const { type } = state || {};
  const token = GetToken();
  const [DataList, setDataList] = useState<DataListTypes>({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { page, size, items, total } = DataList;
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
      sortOrder: "",
      listFaqs: [],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit(values) {
      if (type === "Create") {
        handleCreateFaq(values);
      } else if (type === "Update") {
        handleUpdateFaq(values);
      }
    },
  });

  // Create Faq service
  const handleCreateFaq = (values: FaqProps) => {
    isLoading(true);
    const finalObj = {
      ...values,
      token: token,
    };
    CreateFaqService(finalObj)
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

  // Update Faq service

  const handleUpdateFaq = (values: FaqProps) => {
    isLoading(true);
    const finalObj = FilterValidObj({
      ...values,
      token: token,
      listFaqs: "",
      editFaqs: DataList.items,
      faqCategoryId: state?.UpdateData?.faqCategoryId,
    });
    UpdateFaqService(finalObj)
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
  const TableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: "contant2_width",
      render: (text: any, _, index) => index + 1,
    },
    {
      lable: "Sort Order",
      key: "sortOrder",
      className: classes.tableSmallbox,
      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.sortOrder}
          placeholder="Enter Sort Order"
          value={text}
          validationType={"NUMBER"}
          onChange={(data) => {
            setFieldValue(`listFaqs[${index}].sortOrder`, data);

            if (type === "Update") {
              setDataList((pre) => ({
                ...pre,
                items: values?.listFaqs?.map((ele: ListFaq, ind) =>
                  index === ind ? { ...ele, sortOrder: data } : ele
                ),
              }));
            }
          }}
          errorText={getErrors(index, "sortOrder", "listFaqs")}
        />
      ),
    },
    {
      lable: "Question",
      key: "question",
      className: classes.tableInputBox,

      render: (text: any, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.description}
          placeholder="Enter Question"
          value={text}
          onChange={(data) => {
            setFieldValue(`listFaqs[${index}].question`, data);
            if (type === "Update") {
              setDataList((pre) => ({
                ...pre,
                items: values?.listFaqs?.map((ele: ListFaq, ind) =>
                  index === ind ? { ...ele, question: data } : ele
                ),
              }));
            }
          }}
          errorText={getErrors(index, "question", "listFaqs")}
        />
      ),
    },
    {
      lable: "Answer",
      key: "answer",
      className: classes.tableInputBox,
      render: (text: any, _, index) => (
        <CommonTextArea
          maxLength={INPUT_LENGTHS.description}
          placeholder="Enter Answer"
          value={text}
          onChange={(data) => {
            setFieldValue(`listFaqs[${index}].answer`, data);

            if (type === "Update") {
              setDataList((pre) => ({
                ...pre,
                items: values?.listFaqs?.map((ele: ListFaq, ind) =>
                  index === ind ? { ...ele, answer: data } : ele
                ),
              }));
            }
          }}
          errorText={getErrors(index, "answer", "listFaqs")}
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
            if (!errors?.listFaqs) {
              setFieldValue("listFaqs", [
                {
                  answer: "",
                  sortOrder: "",
                  question: "",
                },
                ...values.listFaqs,
              ]);
              if (type === "Update") {
                setDataList((pre) => ({
                  ...pre,
                  items: [
                    {
                      answer: "",
                      sortOrder: "",
                      question: "",
                    },
                    ...pre.items,
                  ],
                }));
              }
            } else {
              setFieldTouched("listFaqs", true);
            }
          }}
        />
      ),
      key: "",
      className: "contant2_width",
      render: (_, data, index) => (
        <>
          <img
            src={Images.CANCEL_ICON}
            alt="Cancel Icon"
            className={classes.TableIcons}
            onClick={() => {
              if (data.faqId) {
                DeleteFaq(data.faqId);
              } else {
                setFieldValue(
                  "listFaqs",
                  values.listFaqs.filter((_, ind) => ind !== index)
                );
                setDataList((pre) => ({
                  ...pre,
                  items: values.listFaqs.filter((_, ind) => ind !== index),
                }));
              }
            }}
          />
        </>
      ),
    },
  ];

  // Delete Faq Item

  const DeleteFaq = (id: number) => {
    isLoading(true);
    let finalObj = {
      token,
      faqId: id,
    };
    DeleteFaqService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data?.status === 1) {
          toast.success(response.data.msg);
          getListFaq(page, size);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => isLoading(false));
  };

  // Faq Items List

  const getListFaq = (page = 1, size = 10) => {
    isLoading(true);
    let finalObj = {
      token: token,
      faq_category_id: state?.UpdateData?.faqCategoryId,
    };
    ListFaqService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          let items = response.data?.items?.map((ele: any) => ({
            question: ele.question || "",
            answer: ele.answer || "",
            sortOrder: ele.sortOrder >= 0 ? ele.sortOrder : "",
            faqId: ele.faqId || "",
          }));
          setDataList({
            ...response.data,
            items: items,
          });
          setFieldValue("listFaqs", items);
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
    if (state?.UpdateData) {
      getListFaq(1, 10);

      setValues({
        ...values,
        title: state?.UpdateData?.title || "",
        sortOrder:
          state?.UpdateData.sortOrder >= 0 ? state?.UpdateData.sortOrder : "",
      });
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ScreenHeader
        name={`${state?.type} FAQ`}
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
              value={values.sortOrder}
              onChange={(data) => {
                setFieldValue("sortOrder", data);
              }}
              isRequired={true}
              errorText={
                errors.sortOrder && touched.sortOrder ? errors.sortOrder : ""
              }
            />
          </Col>
          <Col xs={24}>
            <GlobalTable
              Options={TableOptions}
              items={type === "Create" ? values?.listFaqs : items}
              total={
                type === "Create"
                  ? values?.listFaqs.length
                  : total || values?.listFaqs.length
              }
            />
          </Col>
          <Col xs={24}>
            <CommonPaginaion
              DataList={DataList}
              filters={{}}
              handleListapi={(page, size) => {
                let findnewItems = values?.listFaqs?.find(
                  (ele: any) => ele?.faqId === undefined
                );
                if (findnewItems) {
                  toast.error(
                    "Please Update Newly added items before change the page or size"
                  );
                } else {
                  getListFaq(page, size);
                }
              }}
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
