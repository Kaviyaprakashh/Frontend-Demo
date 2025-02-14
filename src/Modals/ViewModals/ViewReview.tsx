import { viewModalProps } from "../../@Types/ModalProps";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import classes from "../Modal.module.css";
import { ShowViewData } from "../../Shared/Components";
export default function ViewReview({ UpdateData }: viewModalProps) {
  return (
    <div className={classes.viewModalContainer}>
      <div className={classes.viewMainBlock}>
        {ShowViewData("Title", UpdateData.title)}

        <div className={classes.bannerImageContainer}>
          <span>Images</span>
          <div className={classes.BannerImageContainer}>
            {UpdateData?.fileList?.map((file: any) => {
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
        {ShowViewData("Rating", UpdateData.ratings)}
        {ShowViewData("Content", UpdateData.content)}
      </div>
    </div>
  );
}
