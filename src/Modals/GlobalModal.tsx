import { Modal } from "antd";
import classes from "./Modal.module.css";
import { GlobalModalProps } from "../@Types/CommonComponentTypes";
import { Images } from "../Shared/ImageExport";

export default function GlobalModal({
  Visible = false,
  children,
  size = "md",
  title,
  OnClose,
}: GlobalModalProps) {
  return (
    <Modal
      open={Visible}
      width={size}
      style={{ borderRadius: "0px", padding: "0px" }}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
      footer={null}
      classNames={{
        header: classes.NotDisplayheader,
        content: !title ? classes.nocontent : "",
      }}
      destroyOnClose={true}
      closeIcon={null}
    >
      <>
        {title && (
          <div className={classes.modalheaderblock}>
            <h3 className={classes.modalhead}>{title}</h3>
            <img
              src={Images.CLOSE_ICON}
              alt="closeicon"
              className={classes.modalClose}
              onClick={OnClose}
            />
          </div>
        )}
        {children}
      </>
    </Modal>
  );
}
