import CommonButton from "../Buttons/CommonButton";
import { SubmitResetTypes } from "../../@Types/CommonComponentTypes";
import classes from "./uicomponents.module.css";
export default function SubmitResetBlock({
  handleClickSubmit,
  handleClickReset,
}: SubmitResetTypes) {
  return (
    <div className={classes.submitresetContainer}>
      <CommonButton
        lable="Search"
        handleClickEvent={() => handleClickSubmit?.()}
        type="submit"
      />
      <CommonButton
        lable="Reset"
        handleClickEvent={() => handleClickReset?.()}
        type="reset"
      />
    </div>
  );
}
