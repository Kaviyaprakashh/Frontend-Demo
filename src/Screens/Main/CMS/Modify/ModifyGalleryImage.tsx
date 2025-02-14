import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { GetToken } from "../../../../Shared/StoreData";
import useLoaderHook from "../../../../Shared/UpdateLoader";
import { HomepageProductsFilterProps } from "../../../../@Types/FiltersTypes";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../../Shared/Methods";
import {
  DeletGalleryItems,
  ListGalleryItemsService,
} from "../../../../Service/ApiMethods";
import { TableOptionsType } from "../../../../@Types/CommonComponentTypes";
import classes from "../../main.module.css";
import GlobalModal from "../../../../Modals/GlobalModal";
import ConfirmationModal from "../../../../Modals/ConfirmationModal";
import ScreenHeader from "../../../../Components/UIComponents/ScreenHeader";
import GlobalTable from "../../../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../../../Components/UIComponents/CommonPagination";
import CreateGalleryImage from "../../../../Modals/ModifyModals/CreateGalleryImage";
import CommonImageBox from "../../../../Components/FormFields/CommonImageBox";
import { useAppDispatch } from "../../../../Store/Rudux/Config/Hooks";
import { UpdateTableFilters } from "../../../../Store/Rudux/Reducer/MainReducer";
import TableActionBlock from "../../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../../Shared/Components";
import { AccessPermissionObject } from "../../../../@Types/accesspermission";

export default function ModifyGalleryImage() {
  const navigate = useNavigate();
  const token = GetToken();
  let dispatch = useAppDispatch();
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [modifyModal, setModifyModal] = useState({
    show: false,
    data: null,
    type: "",
  });

  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { state } = useLocation();
  const { items, page, size, total } = DataList;

  const GetListGalleryImages = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      fileType: 1,
      galleryId: state?.UpdateData?.galleryId,
    });
    ListGalleryItemsService(page, size, finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        isLoading(false);
      });
  };

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },
    {
      lable: "Image",
      render: (text) =>
        text ? (
          <CommonImageBox
            source={text}
            type={"table"}
            alt="Category Image"
            showPreview={true}
          />
        ) : (
          "-"
        ),
      key: "filePath",
    },
    {
      lable: "Alternate Image Name",
      render: (text) => ShowBigContent(text),
      key: "imgAlt",
      showTooltip: true,
    },

    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
      className: classes.NameBox,
    },

    {
      lable: "Action",
      render: (_, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.cms?.gallery?.gallery_image}
            onClickEditIcon={() => {
              setModifyModal({
                show: true,
                data: data,
                type: "Update",
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.galleryItemId,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleDeleteGalleryItems = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      galleryItemId: id,
    };

    DeletGalleryItems(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListGalleryImages(page, size);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      GetListGalleryImages(1, 10);
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      {modifyModal.show && (
        <GlobalModal
          Visible={modifyModal.show}
          OnClose={() => setModifyModal({ show: false, data: null, type: "" })}
          size={600}
          title={`${modifyModal.type} Image`}
        >
          <CreateGalleryImage
            type={modifyModal.type}
            OnClose={() =>
              setModifyModal({ show: false, data: null, type: "" })
            }
            UpdateData={modifyModal.data}
            handleSuccess={() => {
              GetListGalleryImages(1, 10);
            }}
          />
        </GlobalModal>
      )}

      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Gallery Image"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleDeleteGalleryItems(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Gallery Images"
        permissionData={permissons?.cms?.gallery?.gallery_image}
        OnClickAdd={() => {
          setModifyModal({ show: true, data: null, type: "Create" });
        }}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      <div className={classes.bgContainer}>
        <div className={classes.UserviewBlock} style={{ padding: "0px" }}>
          <p>
            <span> Title</span>:<span>{state?.UpdateData?.title}</span>
          </p>
        </div>
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListGalleryImages}
            filters={{}}
          />
        </div>
      </div>
    </>
  );
}
