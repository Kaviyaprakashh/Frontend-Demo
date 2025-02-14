import { viewModalProps } from "../../@Types/ModalProps";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import classes from "../Modal.module.css";
import { GetstatusWithColor, ShowViewData } from "../../Shared/Components";
export default function ViewHomesalesProducts({ UpdateData }: viewModalProps) {
  return (
    <div className={classes.viewModalContainer}>
      <div className={classes.viewMainBlock}>
        {ShowViewData("Title", UpdateData.title)}
        <p>
          <span>Status</span>:{GetstatusWithColor(UpdateData.status)}
        </p>

        {ShowViewData("Product Name", UpdateData.productName)}

        {ShowViewData("Sort Order", UpdateData.sortOrder)}

        <p>
          <span>Image</span>:
          {UpdateData.img_path ? (
            <CommonImageBox
              source={UpdateData.img_path}
              alt="Web Image Path"
              type="view"
              showPreview={true}
            />
          ) : (
            "  -"
          )}
        </p>
        {ShowViewData("Alternate Image Name", UpdateData.img_alt)}
      </div>
    </div>
  );
}
