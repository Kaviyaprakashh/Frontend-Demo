import { AddressProps } from "../../../@Types/ComponentProps";
import CommonButton from "../../../Components/Buttons/CommonButton";
import classes from "../main.module.css";

export default function ModifyBankAccount({
  userData,
  handleSuccess,
}: AddressProps) {
  return (
    <div className={classes.bgContainer}>
      <div className={classes.SubheaderBlock}>
        <div style={{ display: "flex", gap: 10 }}>
          <CommonButton
            lable="Submit"
            handleClickEvent={() => {
              // handleSubmit();
            }}
            type="submit"
          />
        </div>
      </div>
    </div>
  );
}
