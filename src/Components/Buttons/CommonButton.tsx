import { CommonButtonTypes } from "../../@Types/CommonComponentTypes";
import classes from "./Buttons.module.css";
export default function CommonButton({
  lable,
  handleClickEvent,
  type,
  styles,
  isright = false,
}: CommonButtonTypes) {
  const getClassName = () => {
    if (type === "submit") {
      return classes.submitBTN;
    } else if (type === "reset") {
      return classes.resetBTN;
    } else if (type === "add") {
      return classes.modalOkBTN;
    } else if (type === "update") {
      return classes.updateBTN;
    } else if (type === "modalOk") {
      return classes.modalOkBTN;
    } else if (type === "modalCancel") {
      return classes.modalCancelBTN;
    } else if (type === "back") {
      return classes.BackBtn;
    } else if (type === "delete") {
      return classes.DeleteBtn;
    } else if (type === "download") {
      return classes.downloadBtn;
    } else if (type === "export") {
      return classes.exportBtn;
    } else if (type === "edit") {
      return classes.editBtn;
    }
  };
  return (
    <button
      type="button"
      className={`${getClassName()} ${
        type === "auth" ? classes.AuthButton : classes.MainButton
      }`}
      onClick={() => handleClickEvent?.()}
      onDoubleClick={(event) => event.preventDefault()}
      style={{
        ...styles,
        float: isright ? "right" : "",
        marginTop: isright ? "10px" : "",
      }}
    >
      {lable}
    </button>
  );
}
