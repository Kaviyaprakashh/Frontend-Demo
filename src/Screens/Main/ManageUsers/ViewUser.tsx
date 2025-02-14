import { useLocation, useNavigate } from "react-router";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import { useEffect, useState } from "react";
import { GetToken } from "../../../Shared/StoreData";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { ViewUserService } from "../../../Service/ApiMethods";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getTableSNO,
  getUserTabName,
} from "../../../Shared/Methods";
import toast from "react-hot-toast";
import { Images } from "../../../Shared/ImageExport";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonTooltip from "../../../Components/UIComponents/CommonTooltip";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { GetstatusWithColor, ShowBigContent } from "../../../Shared/Components";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";

export default function ViewUser() {
  const { id } = useLocation()?.state || {};
  let navigate = useNavigate();
  const token = GetToken();
  const { pathname } = useLocation();
  const { isLoading } = useLoaderHook();
  const [errorImage, setErrorImage] = useState(false);

  let dispatch = useAppDispatch();
  const { state } = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const getViewUser = () => {
    isLoading(true);
    let finalObj = { token: token, user_id: id };
    ViewUserService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setUserData(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) =>
        getTableSNO(1, userData.user_address.length, index),
      key: "sno",
    },
    {
      lable: "Address Type",
      render: (text) => text ?? "-",
      key: "address_type_name",
      className: classes.NameBox,
    },

    {
      lable: "Country",
      render: (text) => text ?? "-",
      key: "country",
      className: classes.NameBox,
    },

    {
      lable: "State",
      render: (text) => text ?? "-",
      key: "state",
      className: classes.NameBox,
    },

    {
      lable: "District",
      render: (text) => text ?? "-",
      key: "district",
      className: classes.NameBox,
    },
    {
      lable: "City",
      render: (text) => text ?? "-",
      key: "city",
      className: classes.NameBox,
    },
    {
      lable: "Postal Code",
      render: (text) => text ?? "-",
      key: "postal_code",
      className: classes.NameBox,
    },
    {
      lable: "Address 1",
      render: (text) => ShowBigContent(text),
      key: "address_1",
      showTooltip: true,
    },

    {
      lable: "Address 2",
      render: (text) => ShowBigContent(text),
      key: "address_2",
      showTooltip: true,
    },
  ];

  useEffect(() => {
    if (token && id) {
      getViewUser();
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);
  return (
    <div>
      <ScreenHeader
        name={`View ${getUserTabName(state?.usertype)}`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
      />
      {userData && (
        <div className={classes.prodileContainer}>
          <div className={classes.viewHeader}>
            <div className={classes.ProfileImages}>
              <img
                src={errorImage ? Images.PROFILE_ICON : userData?.img_path}
                alt="User Icon"
                onError={() => {
                  setErrorImage(true);
                }}
              />
              <div className={classes.profileIconsBlock}>
                {userData.email && (
                  <CommonTooltip title={userData.email}>
                    <img src={Images.EMAIL_ICON} alt="Email Icon" />
                  </CommonTooltip>
                )}
                {userData.phone && (
                  <CommonTooltip title={userData.phone}>
                    <img src={Images.PHONE_ICON} alt="Phone Icon" />
                  </CommonTooltip>
                )}
                {state?.usertype !== 5 && (
                  <>
                    {userData.landline && (
                      <CommonTooltip title={userData.landline}>
                        <img src={Images.LANDLINE_ICON} alt="Landline Icon" />
                      </CommonTooltip>
                    )}
                    {userData.fax && (
                      <CommonTooltip title={userData.fax}>
                        <img src={Images.FAX_ICON} alt="Fax Icon" />
                      </CommonTooltip>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={classes.UserviewBlock} style={{ width: "80%" }}>
              <div className={classes.profileHeader}>
                <img src={Images.USER_ICON} alt="Profile Icon" />
                <h3 className={classes.subHeader}>User Details</h3>
              </div>
              {(state?.usertype === 2 || state?.usertype === 3) && (
                <p>
                  <span>Username</span>:<span>{userData?.username || "-"}</span>
                </p>
              )}
              <p>
                <span>First Name</span>:
                <span>{userData?.first_name || "-"}</span>
              </p>
              <p>
                <span>Last Name</span>:<span>{userData?.last_name || "-"}</span>
              </p>
              <p>
                <span>Status</span>:{GetstatusWithColor(userData.status)}
              </p>
              {state?.usertype !== 5 && (
                <>
                  <p>
                    <span>Gst</span>:<span>{userData?.gst || "-"}</span>
                  </p>
                  <p>
                    <span>Pan</span>:<span>{userData?.pan || "-"}</span>
                  </p>
                </>
              )}
              <p>
                <span>Reward Points</span>:
                <span>{userData?.reward_points || "-"}</span>
              </p>
              {state?.usertype === 4 && (
                <p>
                  <span>Executive Name</span>:
                  <span>{userData?.executive_name || "-"}</span>
                </p>
              )}
            </div>
          </div>
          <div className={classes.ViewuserDetails}>
            <div className={classes.UserviewBlock}>
              <div className={classes.profileHeader}>
                <img src={Images.PHONE_ICON} alt="Profile Icon" />
                <h3 className={classes.subHeader}>Contact Details</h3>
              </div>
              <p>
                <span>Email</span>:<span>{userData?.email || "-"}</span>
              </p>
              <p>
                <span>Alternate Email</span>:
                <span>{userData?.email2 || "-"}</span>
              </p>
              {state?.usertype !== 5 && (
                <p>
                  <span>Fax</span>:<span>{userData?.fax || "-"}</span>
                </p>
              )}

              <p>
                <span>Phone Number</span>:<span>{userData?.phone || "-"}</span>
              </p>
              {state?.usertype !== 5 && (
                <p>
                  <span>Landline</span>:<span>{userData?.landline || "-"}</span>
                </p>
              )}
              <p>
                <span>Alternate Phone No</span>:
                <span>{userData?.phone2 || "-"}</span>
              </p>
            </div>
            {pathname !== "/manage_users/view_admin" &&
              userData.user_accounts?.map((ele: any) => {
                return (
                  <div className={classes.UserviewBlock}>
                    <div className={classes.profileHeader}>
                      <img src={Images.BANK_ICON} alt="Profile Icon" />
                      <h3 className={classes.subHeader}>Bank Details</h3>
                    </div>
                    <p>
                      <span>Account Holder Name</span>:
                      <span>{ele?.account_holder_name || "-"}</span>
                    </p>
                    <p>
                      <span>Account Number</span>:
                      <span>{ele?.account_number || "-"}</span>
                    </p>
                    <p>
                      <span>IFSC Code</span>:
                      <span>{ele?.ifsc_code || "-"}</span>
                    </p>
                    <p>
                      <span>Bank</span>:<span>{ele?.bank_name || "-"}</span>
                    </p>
                    <p>
                      <span>Branch</span>:<span>{ele?.bank_branch || "-"}</span>
                    </p>
                  </div>
                );
              })}
          </div>

          {userData.user_address.length > 0 && (
            <div className={classes.bgContainer}>
              <div
                className={classes.profileHeader}
                style={{ marginBottom: "5px" }}
              >
                <img src={Images.ADDRESS_ICON} alt="Profile Icon" />
                <h3 className={classes.subHeader}>User Address</h3>
              </div>
              <GlobalTable
                items={userData.user_address}
                Options={Options}
                total={userData.user_address.length}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
