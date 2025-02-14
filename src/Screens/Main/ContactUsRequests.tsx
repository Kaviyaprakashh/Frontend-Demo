import classes from "./main.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetToken } from "../../Shared/StoreData";
import useLoaderHook from "../../Shared/UpdateLoader";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getTableSNO,
} from "../../Shared/Methods";
import { ListContactUsRequestService } from "../../Service/ApiMethods";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import { ShowBigContent } from "../../Shared/Components";
import ScreenHeader from "../../Components/UIComponents/ScreenHeader";
import GlobalTable from "../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../Components/UIComponents/CommonPagination";

export default function ContactUsRequests() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();

  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;

  const GetContactUsRequestList = (
    page = 1,
    size = 10,
    values?: { user_id: number | null }
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListContactUsRequestService(page, size, finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data);
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
  // Table Options
  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },

    {
      lable: "User",
      render: (text) => text ?? "-",
      key: "name",
      className: classes.NameBox,
    },
    {
      lable: "Email",
      render: (text) => text ?? "-",
      key: "email",
      className: classes.NameBox,
    },

    {
      lable: "Message",
      render: (text) => ShowBigContent(text),
      key: "message",
      showTooltip: true,
    },
    {
      lable: "Subject",
      render: (text) => ShowBigContent(text),
      key: "subject",
      showTooltip: true,
    },
  ];

  useEffect(() => {
    if (token) {
      GetContactUsRequestList(page, size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Screen Header */}
      <ScreenHeader name={`Contact Us Requests`} />

      <div className={classes.bgContainer}>
        {/* Table Container */}
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetContactUsRequestList}
            filters={{}}
          />
        </div>
      </div>
    </>
  );
}
