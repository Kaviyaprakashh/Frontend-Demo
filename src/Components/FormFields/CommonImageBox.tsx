import { ImageBoxTypes } from "../../@Types/CommonComponentTypes";
import CommonTooltip from "../UIComponents/CommonTooltip";
import classes from "./Formfields.module.css";
import { Image } from "antd";
export default function CommonImageBox({
  alt,
  source,
  type,
  onClick,
  showPreview = false,
  tooltipData = "",
  fullwidth,
}: ImageBoxTypes) {
  const getStyles = () => {
    if (type === "images") {
      return { className: classes.TableIcons, width: 23, height: 23 };
    } else if (type === "table") {
      return { className: classes.Tableimage, width: 70, height: 70 };
    } else if (type === "view") {
      return { className: classes.ViewImage, width: 100, height: 100 };
    } else if (type === "gallery") {
      return {
        className: classes.GalleryViewImage,
        width: "100%",
        height: 180,
      };
    } else if (type === "fileinput") {
      return { className: classes.Tableimage, width: 60, height: 60 };
    } else if (type === "setting") {
      return { width: 20, className: classes.settingIcon, height: 20 };
    } else if (type === "tableIcon") {
      return { width: 20, className: classes.TableIcons, height: 20 };
    } else if (type === "permission") {
      return { width: 15, className: classes.SmallIcons, height: 15 };
    } else if (type === "review") {
      return { width: 140, className: classes.SmallIcons, height: 100 };
    } else return { className: classes.NormalImg, width: 150, height: 150 };
  };

  return showPreview ? (
    <Image
      preview={showPreview}
      src={source}
      alt={alt}
      className={getStyles().className}
      width={fullwidth ? "100%" : getStyles().width}
      height={getStyles().height}
      fallback={"...Loading"}
      loading="lazy"
    />
  ) : (
    <CommonTooltip title={tooltipData}>
      <img
        src={source}
        alt={alt}
        className={getStyles().className}
        height={getStyles().height}
        width={fullwidth ? "100%" : getStyles().width}
        onClick={() => (onClick ? onClick() : "")}
      />
    </CommonTooltip>
  );
}
