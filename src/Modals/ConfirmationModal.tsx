import classes from "./Modal.module.css";
import { ConfirmationType } from "../@Types/ModalTypes";
import { Images } from "../Shared/ImageExport";
import CommonButton from "../Components/Buttons/CommonButton";

export default function ConfirmationModal({
  type = "delete",
  title,
  msg,
  name,
  OkButton,
  cancelButton,
  onClickOkButton,
  onClickcancelButton,
}: ConfirmationType) {
  return (
    <div className={classes.confirmationContainer}>
      <div className={classes.confirmTopContainer}>
        {type === "logout" ? (
          <img src={Images.LOGOUT_ICON} alt="logo" />
        ) : type === "confirmation" ? (
          <img src={Images.ConfirmationSaveIcon} alt="logo" />
        ) : (
          <img src={Images.TRASH_ICON} alt="logo" />
        )}
        <div>
          <h3>{title}</h3>
          <p>
            {type === "confirmation" || type === "categorydelete" ? (
              msg
            ) : type === "delete" ? (
              <>
                Are you sure want to delete this
                <span className={classes.deleteDataName}>&nbsp;{name}?</span>
              </>
            ) : (
              msg
            )}
          </p>
        </div>
      </div>
      <div className={classes.confirmBottomContainer}>
        <CommonButton
          lable={cancelButton ?? ""}
          type="reset"
          styles={{
            padding: "10px",
            minWidth: "150px",
          }}
          handleClickEvent={() => onClickcancelButton?.()}
        />
        <CommonButton
          lable={OkButton ?? ""}
          handleClickEvent={() => onClickOkButton?.()}
          type="modalOk"
          styles={{
            padding: "10px",
            minWidth: "150px",
          }}
        />
      </div>
    </div>
  );
}
