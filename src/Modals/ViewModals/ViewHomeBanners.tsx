import { viewModalProps } from "../../@Types/ModalProps";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import classes from "../Modal.module.css";
import { ConvertDatetime } from "../../Shared/Methods";
import { GetstatusWithColor, ShowViewData } from "../../Shared/Components";
export default function ViewHomeBanners({ UpdateData }: viewModalProps) {
  return (
    <div className={classes.viewModalContainer}>
      <div className={classes.viewMainBlock}>
        {ShowViewData("Title", UpdateData.title)}

        <div className={classes.bannerImageContainer}>
          <span>Images</span>
          <div className={classes.BannerImageContainer}>
            {UpdateData.webImgPath ? (
              <div>
                <span>Web Image</span>
                <CommonImageBox
                  source={UpdateData.webImgPath}
                  alt="Web Image Path"
                  type="view"
                  showPreview={true}
                />
              </div>
            ) : (
              ""
            )}
            {UpdateData.mobImgPath ? (
              <div>
                <span>Mobile Image</span>
                <CommonImageBox
                  source={UpdateData.mobImgPath}
                  alt="Mobile Image Path"
                  type="view"
                  showPreview={true}
                />
              </div>
            ) : (
              ""
            )}
            {UpdateData.mobWebImgPath ? (
              <div>
                <span>Mobile Web Image</span>
                <CommonImageBox
                  source={UpdateData.mobWebImgPath}
                  alt="Mobile Web Image Path"
                  type="view"
                  showPreview={true}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {ShowViewData("Product URL", UpdateData.url)}

        <p>
          <span>Status</span>:{GetstatusWithColor(UpdateData.status)}
        </p>
        <p>
          <span>Date Time</span>:
          <span>
            {UpdateData.created_at
              ? ConvertDatetime(UpdateData.created_at, "DATE_TIME")
              : "-"}
          </span>
        </p>
        {ShowViewData("Description", UpdateData.description)}
      </div>
    </div>
  );
}
