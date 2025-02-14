import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import { GetToken } from "../../../Shared/StoreData";
import useLoaderHook from "../../../Shared/UpdateLoader";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
} from "../../../Shared/Methods";
import { DataListTypes } from "../../../@Types/ComponentProps";
import { ListGalleryItemsService } from "../../../Service/ApiMethods";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import CommonVideoBox from "../../../Components/FormFields/CommonVideoBox";
import Nodata from "../../../Components/ErrorElements/Nodata";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";
import { GetstatusWithColor, ShowViewData } from "../../../Shared/Components";
import CommonPopover from "../../../Components/UIComponents/CommonPopover";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function ViewGallery() {
  const { state } = useLocation();
  const { UpdateData } = state || {};
  let dispatch = useAppDispatch();
  const { isLoading } = useLoaderHook();
  const token = GetToken();
  let navigate = useNavigate();
  const [imageDataList, setImageDataList] = useState<DataListTypes>({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const [videoDataList, setVideoDataList] = useState<DataListTypes>({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });

  const getListGalleryItems = (page = 1, size = 10, type: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      fileType: type,
      galleryId: state.UpdateData.galleryId,
    };
    ListGalleryItemsService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          if (type === 1) {
            setImageDataList(response.data.data);
          } else {
            setVideoDataList(response.data.data);
          }
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        getCatchMsg(error);
      })
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      // For videos Type =>1
      getListGalleryItems(1, 10, 1);
      // For Images Type =>2
      getListGalleryItems(1, 10, 2);
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className={classes.MainViewContainer}>
      <ScreenHeader
        name={`${state?.type} Gallery`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      <div className={classes.bgContainer}>
        <div className={classes.viewMainBlock}>
          {ShowViewData("Title", UpdateData.title)}
          <p>
            <span>Status</span>:{GetstatusWithColor(UpdateData.status)}
          </p>
          {ShowViewData("SEO URL", UpdateData.seoUrl)}
          {ShowViewData("Sort Order", UpdateData.sortOrder)}
          {ShowViewData("Meta Title", UpdateData.metaTitle)}
          {ShowViewData("Meta Keywords", UpdateData.metaKeywords)}
          {ShowViewData("Meta Description", UpdateData.metaDescription)}
        </div>
      </div>
      <div className={classes.bgContainer}>
        <h3 className={classes.subHeader}>Images</h3>
        <Row gutter={[20, 20]} align={"middle"}>
          {imageDataList.total > 0 ? (
            imageDataList.items.map((data: any, index) => {
              return (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={index}>
                  <div className={classes.ImageContainer} key={index}>
                    <CommonImageBox
                      source={data.filePath}
                      alt={"Uploaded Images"}
                      type="gallery"
                      showPreview={true}
                    />
                  </div>
                </Col>
              );
            })
          ) : (
            <Nodata msg="No Images Found" />
          )}
        </Row>
      </div>
      <div className={classes.bgContainer}>
        <h3 className={classes.subHeader}>Videos</h3>
        <Row gutter={[20, 20]} align={"middle"}>
          {videoDataList.total > 0 ? (
            videoDataList.items.map((data: any, index) => {
              return (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={index}>
                  <div className={classes.ImageContainer}>
                    <CommonVideoBox
                      source={data.filePath}
                      alt={"Uploaded Images"}
                      type="view"
                    />
                    <p className={classes.viewcontent}>
                      Sort Order : <span>{data?.sortOrder}</span>
                    </p>
                    <CommonPopover content={data?.filePath}>
                      <p className={classes.fileLink}>{data?.filePath}</p>
                    </CommonPopover>
                  </div>
                </Col>
              );
            })
          ) : (
            <Nodata msg="No Videos Found" />
          )}
        </Row>
      </div>
    </div>
  );
}
