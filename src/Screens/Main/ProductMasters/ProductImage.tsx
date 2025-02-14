import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GetToken } from "../../../Shared/StoreData";
import {
  DeleteProductImagesService,
  ViewProductsService,
} from "../../../Service/ApiMethods";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import GlobalModal from "../../../Modals/GlobalModal";
import CommonImageBox from "../../../Components/FormFields/CommonImageBox";
import ModifyProductImage from "./Modify/ModifyProductImage";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function ProductImage() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const { state } = useLocation();
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [modifyModal, setModifyModal] = useState({
    show: false,
    UpdateData: null,
    type: "",
  });
  const [DataList, setDataList] = useState([]);

  const ViewProductsList = () => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      token,
      product_id: state.UpdateData.id,
    });
    ViewProductsService(finalObj)
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data.data?.product_images);
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
      render: (text, _, index) => (
        <span>{getTableSNO(1, DataList.length, index)}</span>
      ),
      key: "sno",
    },
    {
      lable: "Image",
      render: (text) =>
        text ? (
          <CommonImageBox alt="Product Image" source={text} type="table" />
        ) : (
          "-"
        ),
      key: "img_path",
    },
    // {
    //   lable: "Thumb Image",
    //   render: (text) =>
    //     text ? (
    //       <CommonImageBox alt="Product Image" source={text} type="table" />
    //     ) : (
    //       "-"
    //     ),
    //   key: "thumb_path",
    // },
    {
      lable: "Alternate Image Name",
      render: (text) => text ?? "-",
      key: "img_alt",
    },

    {
      lable: "Action",
      render: (text, data) => {
        return (
          <TableActionBlock
            permissionData={
              permissons?.product_masters?.products?.gallery_crud_action
            }
            onClickEditIcon={() => {
              setModifyModal({
                show: true,
                UpdateData: data,
                type: "Update",
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.id,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeProductStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      product_image_id: id,
      status: status,
    };

    DeleteProductImagesService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          ViewProductsList();
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      ViewProductsList();
      if (state?.filters) {
        dispatch(UpdateTableFilters(state.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {modifyModal.show && (
        <GlobalModal
          size={500}
          Visible={modifyModal.show}
          title={modifyModal.type}
          OnClose={() => {
            setModifyModal({
              show: false,
              UpdateData: null,
              type: "",
            });
          }}
        >
          <ModifyProductImage
            type={modifyModal?.type}
            UpdateData={modifyModal?.UpdateData}
            OnClose={() => {
              setModifyModal({
                show: false,
                UpdateData: null,
                type: "",
              });
            }}
            handleSuccess={() => {
              ViewProductsList();
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
            name="Product Image"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeProductStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Product Image"
        permissionData={
          permissons?.product_masters?.products?.gallery_crud_action
        }
        OnClickAdd={() => {
          setModifyModal({
            show: true,
            UpdateData: null,
            type: "Create",
          });
        }}
        onClickBackBtn={() => navigate(-1)}
      />
      <div className={classes.bgContainer}>
        <div className={classes.UserviewBlock} style={{ padding: "0px" }}>
          <p>
            <span>Product Name</span>:
            <span>{state.UpdateData?.name || "-"}</span>
          </p>
          <p>
            <span>Product Code</span>:
            <span>{state.UpdateData?.product_code || "-"}</span>
          </p>
        </div>
        <div className={classes.tablecontainer}>
          <GlobalTable
            items={DataList}
            Options={Options}
            total={DataList.length}
          />
        </div>
      </div>
    </>
  );
}
