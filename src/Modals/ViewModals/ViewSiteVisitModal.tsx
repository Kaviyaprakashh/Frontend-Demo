import { viewModalProps } from "../../@Types/ModalProps";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import classes from "../Modal.module.css";
import { ShowViewData } from "../../Shared/Components";
import { useEffect, useState } from "react";
import { ViewSiteVisitService } from "../../Service/ApiMethods";
import {
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
} from "../../Shared/Methods";
import { GetLoader, GetToken } from "../../Shared/StoreData";
import useLoaderHook from "../../Shared/UpdateLoader";
import toast from "react-hot-toast";
import dayjs from "dayjs";
export default function ViewSiteVisitModal({ UpdateData }: viewModalProps) {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [VisitRecord, setVisitRecord] = useState<any>({});

  const getViewSiteVisit = () => {
    isLoading(true);
    let finalObj = {
      token: token,
      visit_record_id: UpdateData,
    };

    ViewSiteVisitService(ConvertJSONtoFormData(finalObj))
      .then((res) => {
        if (res?.data?.status === 1) {
          setVisitRecord(res?.data?.data);
        } else {
          toast.error(res?.data?.data);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      getViewSiteVisit();
    }
  }, []);
  return (
    <div className={classes.viewModalContainer}>
      <div className={classes.viewMainBlock}>
        {ShowViewData(
          "Date",
          ConvertDatetime(VisitRecord.created_at, "DATE_TIME")
        )}

        {ShowViewData(
          "Visitor Type",
          VisitRecord.visitor_type === 5
            ? VisitRecord.name
            : VisitRecord.visitor_type_name
        )}
        {ShowViewData("Visitor Name", VisitRecord.visitor_name)}
        {ShowViewData("Address", VisitRecord.geolocation)}
        <div className={classes.bannerImageContainer}>
          <span>Site Images</span>
          <div className={classes.BannerImageContainer}>
            {VisitRecord?.fileList?.map((file: any) => {
              return (
                <div>
                  <CommonImageBox
                    source={file.file_path}
                    alt="Web Image Path"
                    type="view"
                    showPreview={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
