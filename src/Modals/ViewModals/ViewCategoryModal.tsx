import classes from "../Modal.module.css";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import { viewModalProps } from "../../@Types/ModalProps";

export default function ViewCategoryModal({ UpdateData }: viewModalProps) {
  return (
    <div className="sideBar">
      <div className={`${classes.viewModalContainer}`}>
        <div className={classes.viewMainBlock}>
          <div className={classes.viewHeaderBlock}>
            {UpdateData.img_path && (
              <div className={classes.ImageBox}>
                <CommonImageBox
                  source={UpdateData.img_path}
                  alt="Category Image"
                  type="View"
                  showPreview={true}
                />
              </div>
            )}
            <div>
              <p>
                <span>Category Name</span>:<span>{UpdateData.name || "-"}</span>
              </p>
              <p>
                <span>Parent Category Name</span>:
                <span>{UpdateData.parent_category_name || "-"}</span>
              </p>
              <p>
                <span>Sort Order</span>:
                <span>
                  {UpdateData.sort_order >= 0 ? UpdateData.sort_order : "-"}
                </span>
              </p>
              <p>
                <span>SEO Url</span>:<span>{UpdateData.seo_url || "-"}</span>
              </p>
            </div>
          </div>
          <p>
            <span>Alternate Image Name</span>:
            <span>{UpdateData.img_alt || "-"}</span>
          </p>
          <p>
            <span>Meta Title</span>:<span>{UpdateData.meta_title || "-"}</span>
          </p>
          <p>
            <span>Meta Keywords</span>:
            <span>{UpdateData.meta_keywords || "-"}</span>
          </p>
          <p>
            <span>Meta Description</span>:
            <span>{UpdateData.meta_description || "-"}</span>
          </p>

          <p>
            <span>Description</span>:
            <span>{UpdateData.description || "-"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
