import { Images } from "../../Shared/ImageExport";
import CommonImageBox from "../FormFields/CommonImageBox";
import classes from "./Errorelement.module.css";
export default function DeniedAccessPermissionScreen() {
  return (
    <div className={classes.NodataBlock}>
      <img
        src={Images.NoAccessIcon}
        alt="No Access"
        style={{ width: 300, height: 300 }}
      />
      <h3 className={classes.permmisionText}>
        Sorry, but you don't have permission to access this site. Please contact
        the admin for further assistance.
      </h3>
    </div>
  );
}
