import toast from "react-hot-toast";
import { CommonFileType } from "../../@Types/CommonComponentTypes";
import CommonImageBox from "./CommonImageBox";
import classes from "./Formfields.module.css";
import { Images } from "../../Shared/ImageExport";

export default function CommonFileInput({
  fileRef,
  lable,
  isRequired,
  OnChange,
  value,
  errorText,
  imagePath,
  type,
  id,
  Clearable = false,
  handleClear,
}: CommonFileType) {
  const getImage = () => {
    return typeof imagePath === "string"
      ? imagePath
      : imagePath
      ? URL.createObjectURL(imagePath)
      : "";
  };
  return (
    <>
      <div className={classes.container}>
        {lable ? (
          <p className={classes.Label}>
            {lable}
            {isRequired ? <span className={classes.requiredIcon}>*</span> : ""}
            <span className={classes.labeldescription}>
              (Image Size for Best View: 400*300)
            </span>
          </p>
        ) : (
          ""
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {imagePath && (
            <CommonImageBox
              source={getImage()}
              alt="Image Icon"
              type="fileinput"
              showPreview={true}
            />
          )}
          <input
            type="file"
            id={id ?? "fileInput"}
            ref={fileRef}
            onChange={(data: any) => {
              if (type === "image") {
                const allowedExtensions = [
                  "image/png",
                  "image/jpeg",
                  "image/jpg",
                ];
                if (
                  data.target.files[0]?.type &&
                  allowedExtensions.includes(data.target.files[0]?.type)
                ) {
                  OnChange(data.target.files[0]);
                } else if (data?.target.file) {
                  toast.error("Please select a valid image.");
                } else {
                }
              } else {
                OnChange(data.target.files[0]);
              }
            }}
            style={{ display: "none" }}
            // accept="image/*"
            accept=".png, .jpg, .jpeg"
          />
          <div
            className={classes.fileInputContainer}
            style={{ border: errorText ? "var(--BORDER_ERROR)" : "" }}
          >
            <input
              type="text"
              className={classes.filename}
              disabled
              value={
                value
                  ? typeof value === "string"
                    ? value.split("/").pop()
                    : value?.name
                  : "Choose File"
              }
            />
            {Clearable && value && (
              <img
                src={Images.CLEAR_ICON}
                alt=""
                className={classes.CLEAR_ICON}
                onClick={handleClear}
              />
            )}

            <p
              className={classes.fileInputBtn}
              onClick={() => {
                document.getElementById(id ?? "fileInput")?.click();
              }}
            >
              Choose File
            </p>
          </div>
        </div>
        {errorText ? <p className={classes.ErroText}>{errorText}</p> : ""}
      </div>
    </>
  );
}
