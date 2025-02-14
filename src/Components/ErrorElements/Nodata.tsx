import classes from "./Errorelement.module.css";
import { Images } from "../../Shared/ImageExport";

export default function Nodata({ msg }: { msg?: string }) {
  return (
    <div className={classes.NodataBlock}>
      <img src={Images.NO_DATA_ICON} alt="no Data" />
      <p>{msg ?? "No Data Found"}</p>
    </div>
  );
}
