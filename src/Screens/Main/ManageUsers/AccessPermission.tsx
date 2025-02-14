import { useLocation, useNavigate } from "react-router";
import { useFormik } from "formik";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import classes from "../main.module.css";
import {
  CMSTabAccess,
  ContactUsTabTabAccess,
  DashboardTabAccess,
  MastersTabAccess,
  OrdersTabAccess,
  PerMissionData,
  ProductMastersTabAccess,
  ReturnRequestTabTabAccess,
  RewardTabAccess,
  UserTabAccess,
} from "../../../Shared/Constants";
import { AccessPermissionObject } from "../../../@Types/accesspermission";
import {
  ConvertJSONtoFormData,
  EncryptData,
  getCatchMsg,
  ObjectType,
} from "../../../Shared/Methods";
import CommonCheckBox from "../../../Components/FormFields/CommonCheckBox";
import { PermissionType } from "../../../@Types/GlobalTypes";
import { useEffect, useState } from "react";
import { GetCopyAccessPermission, GetToken } from "../../../Shared/StoreData";
import {
  EditAccessPermissionService,
  ViewAccessPermissionService,
} from "../../../Service/ApiMethods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { UpdateCopyAccessPermission } from "../../../Store/Rudux/Reducer/AccessReducer";
import { setSessionStorageData } from "../../../Store/Storage";
import { Col, Row } from "antd";

export default function AccessPermission() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const token = GetToken();
  let dispatch = useAppDispatch();
  const { isLoading } = useLoaderHook();
  const permission = GetCopyAccessPermission();
  const [pageCount, setPastCount] = useState(0);

  const { values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues: { ...PerMissionData },

      onSubmit(values) {
        handleEditAccessPermission(values);
      },
    });

  // Update all permissions

  const UpdateAllPermission = (
    object: ObjectType,
    val: number,
    keyName = "",
    subKeyname = "",
    HeadermenuName = "",
    SubScreenMenu = "",
    SubScreenHeaderManu = ""
  ) => {
    const result = JSON.parse(
      JSON.stringify(object ? object : values, (key, value) =>
        typeof value === "object" && value !== null ? value : val
      )
    );
    //@ts-ignore
    let KeyNameData = { ...values?.[keyName], [subKeyname]: result };

    if (SubScreenMenu) {
      let SubKeyData = {
        //@ts-ignore
        ...values?.[keyName]?.[subKeyname],
        [SubScreenMenu]: result,
      };

      let menuData = {
        //@ts-ignore
        ...values?.[keyName],
        [subKeyname]: {
          //@ts-ignore
          ...SubKeyData,
          [SubScreenHeaderManu]: CheckAllValues(
            //@ts-ignore
            SubKeyData,
            0
          )
            ? 0
            : 1,
        },
      };

      setValues({
        ...values,
        [keyName]: {
          ...menuData,

          [HeadermenuName]: CheckAllValues(
            { ...menuData, [HeadermenuName]: 0 },
            0
          )
            ? 0
            : 1,
        },
      });
    } else if (subKeyname) {
      setValues({
        ...values,
        [keyName]: {
          ...KeyNameData,
          [HeadermenuName]: CheckAllValues(
            { ...KeyNameData, [HeadermenuName]: 0 },
            0
          )
            ? 0
            : 1,
        },
      });
    } else {
      setValues({ ...values, [keyName]: result });
    }
  };

  // check  if all datas are 0 or 1
  const CheckAllValues = (object: ObjectType, value: any) => {
    return !JSON.stringify(object ? object : values).match(
      value === 1 ? /:\s*(?!1\b)\d+/ : /:\s*(?!0\b)\d+/
    );
  };

  const handleChangeOrders = (screen: any, ind: number, tdDATA: any) => {
    let val = tdDATA ? 0 : 1;
    if (screen?.is_menu) {
      setFieldValue("orders", {
        ...values?.orders,
        orders_menu:
          val === 1 || values?.orders?.change_status
            ? 1
            : values?.orders?.orders_menu,
        view: val,
        edit_shipping_price: val,
        edit_weight: val,
        invoice_download: val,
      });
    } else {
      if (ind === 1) {
        if (
          CheckAllValues(
            {
              view: values?.orders?.view,
              edit_shipping_price: values?.orders?.edit_shipping_price,
              edit_weight: values?.orders?.edit_weight,
              invoice_download: values?.orders?.invoice_download,
              [screen?.key]: val,
            },
            0
          )
        ) {
          setFieldValue("orders", {
            ...values?.orders,
            orders_menu: 0,
            view: 0,
            [screen?.key]: val,
          });
        } else {
          setFieldValue("orders", {
            ...values?.orders,
            orders_menu: 1,

            view: 1,
            [screen?.key]: val,
          });
        }
      } else {
        UpdateCurrectPermission(
          val,
          OrdersTabAccess?.main_menu,
          "",
          screen?.key,
          OrdersTabAccess?.header_menu
        );
      }
    }
  };
  // Update Product service

  const handleEditAccessPermission = (values: AccessPermissionObject) => {
    isLoading(true);
    let finalObj = { ...values, token, user_id: state?.id };
    EditAccessPermissionService(finalObj)
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          navigate(-1);
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  const UpdateCurrectPermission = (
    value: number,
    MainmenuName: any,
    SubMenuName = "",
    PermissionName = "",
    headerMenuName = "",
    subTabName = ""
  ) => {
    let SubMenuData = {
      //@ts-ignore
      ...values?.[MainmenuName]?.[SubMenuName],

      [subTabName]: CheckAllValues(
        {
          //@ts-ignore
          ...values?.[MainmenuName]?.[SubMenuName],
          // [subTabName]: 0,
          [PermissionName]: value,
        },
        0
      )
        ? 0
        : 1,
      [PermissionName]: value,
    };

    if (SubMenuName) {
      setValues({
        ...values,
        [MainmenuName]: {
          //@ts-ignore
          ...values?.[MainmenuName],
          //@ts-ignore
          [SubMenuName]: SubMenuData,

          [headerMenuName]: !CheckAllValues(
            {
              //@ts-ignore
              ...values?.[MainmenuName],
              [SubMenuName]: SubMenuData,
              [headerMenuName]: 0,
            },
            0
          )
            ? 1
            : 0,
        },
      });
    } else {
      setValues({
        ...values,
        [MainmenuName]: {
          //@ts-ignore
          ...values?.[MainmenuName],
          [PermissionName]: value,
          [headerMenuName]: !CheckAllValues(
            {
              //@ts-ignore
              ...values?.[MainmenuName],
              [headerMenuName]: MainmenuName === "dashboard" ? 0 : 1,
              [PermissionName]: value,
            },
            0
          )
            ? 1
            : 0,
        },
      });
    }
  };
  const UpdateSubMenuPermission = (
    value: number,
    MainmenuName: any,
    SubMenuName = "",
    PermissionName = "",
    headerMenuName = "",
    subTabName = "",
    subTabmenuName = "",
    SubscreenHeaderMenu = ""
  ) => {
    let subTabmenuData = {
      //@ts-ignore
      ...values?.[MainmenuName]?.[SubMenuName]?.[subTabmenuName],
      [PermissionName]: value,
    };
    let SubMenuData = {
      //@ts-ignore
      ...values?.[MainmenuName]?.[SubMenuName],

      [subTabName]: CheckAllValues(
        {
          //@ts-ignore
          ...values?.[MainmenuName]?.[SubMenuName],
          [subTabmenuName]: {
            ...subTabmenuData,
          },
        },
        0
      )
        ? 0
        : 1,
      [subTabmenuName]: {
        ...subTabmenuData,
        [SubscreenHeaderMenu]: CheckAllValues(subTabmenuData, 0) ? 0 : 1,
      },
    };

    setValues({
      ...values,
      [MainmenuName]: {
        //@ts-ignore
        ...values?.[MainmenuName],
        //@ts-ignore
        [SubMenuName]: SubMenuData,
        [headerMenuName]: !CheckAllValues(
          {
            //@ts-ignore
            ...values?.[MainmenuName],
            [SubMenuName]: SubMenuData,
            [headerMenuName]: 0,
          },
          0
        )
          ? 1
          : 0,
      },
    });
  };

  const ViewAccessPermission = () => {
    isLoading(true);
    let finalObj = {
      token,
      user_id: state?.id,
    };
    ViewAccessPermissionService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response?.data?.status === 1) {
          setValues({ ...response?.data?.access_permissions });
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (token) {
      ViewAccessPermission();
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
  }, [token]);
  return (
    <div>
      <ScreenHeader
        name={`Access Permission`}
        onClickBackBtn={() => {
          navigate(-1);
        }}
        onClickSaveBtn={() => {
          handleSubmit();
        }}
        onClickCopyPermission={() => {
          setSessionStorageData(
            "COPIED_PERMISSION",
            EncryptData(JSON.stringify(values))
          );
          dispatch(UpdateCopyAccessPermission(values));
        }}
      />
      <Row className={classes.bgContainer}>
        {permission && pageCount === 0 && (
          <CommonButton
            lable="Paste Permissions"
            handleClickEvent={() => {
              setValues(permission);
              setPastCount((pre) => pre + 1);
            }}
            type="search"
            styles={{
              float: "right",
              marginBottom: 10,
            }}
          />
        )}

        {/* DASHBOARD */}

        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.dashboard?.dashboard_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.dashboard,
                  //@ts-ignore
                  values?.dashboard?.dashboard_menu === 1 ? 0 : 1,
                  "dashboard"
                );
              }}
            />

            <h3>{DashboardTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {DashboardTabAccess?.permission?.map(
                    (screen: PermissionType, index: number) => {
                      let tdDATA =
                        //@ts-ignore
                        values?.[DashboardTabAccess?.main_menu]?.[screen?.key];
                      return (
                        <td key={index}>
                          <div className={classes.menuBox}>
                            <CommonCheckBox
                              checked={tdDATA ? true : false}
                              onChange={() => {
                                UpdateCurrectPermission(
                                  tdDATA ? 0 : 1,
                                  DashboardTabAccess?.main_menu,
                                  "",
                                  screen?.key,
                                  DashboardTabAccess?.header_menu
                                );
                              }}
                            />
                            <p>{screen.name}</p>
                          </div>
                        </td>
                      );
                    }
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        {/* ORDERS */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.orders?.orders_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.orders,
                  //@ts-ignore
                  values?.orders?.orders_menu === 1 ? 0 : 1,
                  OrdersTabAccess?.main_menu
                );
              }}
            />

            <h3>{OrdersTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                {OrdersTabAccess?.permission?.map(
                  (access: any, ind: number) => {
                    return (
                      <tr>
                        {access?.map((screen: any, index: number) => {
                          let tdDATA =
                            //@ts-ignore
                            values?.[OrdersTabAccess?.main_menu]?.[screen?.key];
                          return (
                            <td key={index}>
                              {screen.name ? (
                                <div className={classes.menuBox}>
                                  <CommonCheckBox
                                    checked={tdDATA ? true : false}
                                    onChange={() => {
                                      handleChangeOrders(screen, ind, tdDATA);
                                    }}
                                  />
                                  <p>{screen.name}</p>
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  }
                )}
                <tr>
                  {/* {OrdersTabAccess?.permission?.map(
                    (screen: PermissionType, index: number) => {
                      let tdDATA =
                      //@ts-ignore
                      values?.[OrdersTabAccess?.main_menu]?.[screen?.key];
                      return (
                        <td key={index}>
                          <div className={classes.menuBox}>
                            <CommonCheckBox
                              checked={tdDATA ? true : false}
                              onChange={() => {
                                UpdateCurrectPermission(
                                  tdDATA ? 0 : 1,
                                  OrdersTabAccess?.main_menu,
                                  "",
                                  screen?.key,
                                  OrdersTabAccess?.header_menu
                                );
                              }}
                            />
                            <p>{screen.name}</p>
                          </div>
                        </td>
                      );
                    }
                  )} */}
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        {/* REWARD REDEMPTION */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.reward_redemption?.reward_redemption_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.reward_redemption,
                  //@ts-ignore
                  values?.reward_redemption?.reward_redemption_menu === 1
                    ? 0
                    : 1,
                  RewardTabAccess?.main_menu
                );
              }}
            />

            <h3>{RewardTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {RewardTabAccess?.permission?.map(
                    (screen: PermissionType, index: number) => {
                      let tdDATA =
                        //@ts-ignore
                        values?.[RewardTabAccess?.main_menu]?.[screen?.key];
                      return (
                        <>
                          <td key={index}>
                            <div className={classes.menuBox}>
                              <CommonCheckBox
                                checked={tdDATA ? true : false}
                                onChange={() => {
                                  UpdateCurrectPermission(
                                    tdDATA ? 0 : 1,
                                    RewardTabAccess?.main_menu,
                                    "",
                                    screen?.key,
                                    RewardTabAccess?.header_menu
                                  );
                                }}
                              />
                              <p>{screen.name}</p>
                            </div>
                          </td>
                        </>
                      );
                    }
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        {/* RETURN REQUEST REDEMPTION */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.return_request?.return_request_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.return_request,
                  //@ts-ignore
                  values?.return_request?.return_request_menu === 1 ? 0 : 1,
                  ReturnRequestTabTabAccess?.main_menu
                );
              }}
            />

            <h3>{ReturnRequestTabTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {ReturnRequestTabTabAccess?.permission?.map(
                    (screen: PermissionType, index: number) => {
                      let tdDATA =
                        //@ts-ignore
                        values?.[ReturnRequestTabTabAccess?.main_menu]?.[
                          screen?.key
                        ];
                      return (
                        <>
                          <td key={index}>
                            <div className={classes.menuBox}>
                              <CommonCheckBox
                                checked={tdDATA ? true : false}
                                onChange={() => {
                                  UpdateCurrectPermission(
                                    tdDATA ? 0 : 1,
                                    ReturnRequestTabTabAccess?.main_menu,
                                    "",
                                    screen?.key,
                                    ReturnRequestTabTabAccess?.header_menu
                                  );
                                }}
                              />
                              <p>{screen.name}</p>
                            </div>
                          </td>
                        </>
                      );
                    }
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        {/* CONTACT US REQUEST REDEMPTION */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              checked={values?.contact_us?.contact_us_menu === 1}
              onChange={() => {
                setFieldValue("contact_us", {
                  contact_us_menu:
                    values?.contact_us?.contact_us_menu === 1 ? 0 : 1,
                });
              }}
            />

            <h3>{ContactUsTabTabAccess.name}</h3>
          </div>
        </Col>
        {/* PRODUCT MASTER */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.product_masters?.product_master_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.product_masters,
                  //@ts-ignore
                  values?.product_masters?.product_master_menu === 1 ? 0 : 1,
                  ProductMastersTabAccess?.main_menu
                );
              }}
            />

            <h3>{ProductMastersTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th>Menu</th>
                  <th>Sub Menu</th>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                {ProductMastersTabAccess?.SubTabs?.map(
                  (tabs: any, tabIndex: number) => {
                    return (
                      <>
                        <tr key={tabIndex}>
                          {tabs?.permission?.map(
                            (screen: any, screenIndex: number) => {
                              let tdDATA =
                                //@ts-ignore
                                values?.[ProductMastersTabAccess?.main_menu]?.[
                                  tabs?.main_menu
                                ]?.[screen?.key];

                              return (
                                <td>
                                  {screen.name ? (
                                    <div className={classes.menuBox}>
                                      <CommonCheckBox
                                        checked={tdDATA ? true : false}
                                        onChange={() => {
                                          if (screen?.is_menu) {
                                            let finalData =
                                              //@ts-ignore
                                              values?.[
                                                ProductMastersTabAccess
                                                  ?.main_menu
                                              ]?.[tabs?.main_menu];

                                            UpdateAllPermission(
                                              finalData,
                                              tdDATA ? 0 : 1,
                                              ProductMastersTabAccess?.main_menu,
                                              tabs?.main_menu,
                                              ProductMastersTabAccess?.header_menu
                                            );
                                          } else {
                                            UpdateCurrectPermission(
                                              tdDATA ? 0 : 1,
                                              ProductMastersTabAccess?.main_menu,
                                              tabs?.main_menu,
                                              screen?.key,
                                              ProductMastersTabAccess?.header_menu,
                                              tabs?.header_menu
                                            );
                                          }
                                        }}
                                      />
                                      <p>{screen.name}</p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                        {tabs?.submenu
                          ? tabs?.submenu?.map(
                              (subScreen: any, subIndex: number) => {
                                return (
                                  <tr key={subIndex}>
                                    <td>{}</td>
                                    {subScreen?.permission?.map(
                                      (screen: any, Screenindex: number) => {
                                        let tdDATA =
                                          //@ts-ignore
                                          values?.[
                                            ProductMastersTabAccess?.main_menu
                                          ]?.[tabs?.main_menu]?.[
                                            subScreen?.main_menu
                                          ]?.[screen?.key];

                                        return (
                                          <td>
                                            {screen.name ? (
                                              <div className={classes.menuBox}>
                                                <CommonCheckBox
                                                  checked={
                                                    tdDATA ? true : false
                                                  }
                                                  onChange={() => {
                                                    if (screen?.is_menu) {
                                                      let finalData =
                                                        //@ts-ignore
                                                        values?.[
                                                          ProductMastersTabAccess
                                                            ?.main_menu
                                                        ]?.[tabs?.main_menu]?.[
                                                          subScreen?.main_menu
                                                        ];

                                                      UpdateAllPermission(
                                                        finalData,
                                                        tdDATA ? 0 : 1,
                                                        ProductMastersTabAccess?.main_menu,
                                                        tabs?.main_menu,
                                                        ProductMastersTabAccess?.header_menu,
                                                        subScreen?.main_menu,
                                                        tabs?.header_menu
                                                      );
                                                    } else {
                                                      UpdateSubMenuPermission(
                                                        tdDATA ? 0 : 1,
                                                        ProductMastersTabAccess?.main_menu,
                                                        tabs?.main_menu,
                                                        screen?.key,
                                                        ProductMastersTabAccess?.header_menu,
                                                        tabs?.header_menu,
                                                        subScreen?.main_menu,
                                                        subScreen?.header_menu
                                                      );
                                                    }
                                                  }}
                                                />
                                                <p>{screen.name}</p>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                        );
                                      }
                                    )}
                                  </tr>
                                );
                              }
                            )
                          : ""}
                      </>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </Col>
        {/* MANAGE MASTERS */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.masters?.masters_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.masters,
                  //@ts-ignore
                  values?.masters?.masters_menu === 1 ? 0 : 1,
                  MastersTabAccess?.main_menu
                );
              }}
            />

            <h3>{MastersTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th>Menu</th>
                  {/* <th>Sub Menu</th> */}
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                {MastersTabAccess?.SubTabs?.map(
                  (tabs: any, tabIndex: number) => {
                    return (
                      <>
                        <tr key={tabIndex}>
                          {tabs?.permission?.map(
                            (screen: any, screenIndex: number) => {
                              let tdDATA =
                                //@ts-ignore
                                values?.[MastersTabAccess?.main_menu]?.[
                                  tabs?.main_menu
                                ]?.[screen?.key];

                              return (
                                <td>
                                  {screen.name ? (
                                    <div className={classes.menuBox}>
                                      <CommonCheckBox
                                        checked={tdDATA ? true : false}
                                        onChange={() => {
                                          if (screen?.is_menu) {
                                            let finalData =
                                              //@ts-ignore
                                              values?.[
                                                MastersTabAccess?.main_menu
                                              ]?.[tabs?.main_menu];

                                            UpdateAllPermission(
                                              finalData,
                                              tdDATA ? 0 : 1,
                                              MastersTabAccess?.main_menu,
                                              tabs?.main_menu,
                                              MastersTabAccess?.header_menu
                                            );
                                          } else {
                                            UpdateCurrectPermission(
                                              tdDATA ? 0 : 1,
                                              MastersTabAccess?.main_menu,
                                              tabs?.main_menu,
                                              screen?.key,
                                              MastersTabAccess?.header_menu,
                                              tabs?.header_menu
                                            );
                                          }
                                        }}
                                      />

                                      <p>{screen.name}</p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      </>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </Col>
        {/* USERS */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.manage_user?.user_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.manage_user,
                  //@ts-ignore
                  values?.manage_user?.user_menu === 1 ? 0 : 1,
                  UserTabAccess?.main_menu
                );
              }}
            />

            <h3>{UserTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th>Menu</th>
                  <th>Sub Menu</th>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                {UserTabAccess?.SubTabs?.map((tabs: any, tabIndex: number) => {
                  return (
                    <>
                      <tr key={tabIndex}>
                        {tabs?.permission?.map(
                          (screen: any, screenIndex: number) => {
                            let tdDATA =
                              //@ts-ignore
                              values?.[UserTabAccess?.main_menu]?.[
                                tabs?.main_menu
                              ]?.[screen?.key];

                            return (
                              <td>
                                {screen.name ? (
                                  <div className={classes.menuBox}>
                                    <CommonCheckBox
                                      checked={tdDATA ? true : false}
                                      onChange={() => {
                                        if (screen?.is_menu) {
                                          let finalData =
                                            //@ts-ignore
                                            values?.[
                                              UserTabAccess?.main_menu
                                            ]?.[tabs?.main_menu];

                                          UpdateAllPermission(
                                            finalData,
                                            tdDATA ? 0 : 1,
                                            UserTabAccess?.main_menu,
                                            tabs?.main_menu,
                                            UserTabAccess?.header_menu
                                          );
                                        } else {
                                          UpdateCurrectPermission(
                                            tdDATA ? 0 : 1,
                                            UserTabAccess?.main_menu,
                                            tabs?.main_menu,
                                            screen?.key,
                                            UserTabAccess?.header_menu,
                                            tabs?.header_menu
                                          );
                                        }
                                      }}
                                    />
                                    <p>{screen.name}</p>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                        )}
                      </tr>
                      {tabs?.submenu
                        ? tabs?.submenu?.map(
                            (subScreen: any, subIndex: number) => {
                              return (
                                <tr key={subIndex}>
                                  <td>{}</td>
                                  {subScreen?.permission?.map(
                                    (screen: any, Screenindex: number) => {
                                      let tdDATA =
                                        //@ts-ignore
                                        values?.[UserTabAccess?.main_menu]?.[
                                          tabs?.main_menu
                                        ]?.[subScreen?.main_menu]?.[
                                          screen?.key
                                        ];

                                      return (
                                        <td>
                                          {screen.name ? (
                                            <div className={classes.menuBox}>
                                              <CommonCheckBox
                                                checked={tdDATA ? true : false}
                                                onChange={() => {
                                                  if (screen?.is_menu) {
                                                    let finalData =
                                                      //@ts-ignore
                                                      values?.[
                                                        UserTabAccess?.main_menu
                                                      ]?.[tabs?.main_menu]?.[
                                                        subScreen?.main_menu
                                                      ];

                                                    UpdateAllPermission(
                                                      finalData,
                                                      tdDATA ? 0 : 1,
                                                      UserTabAccess?.main_menu,
                                                      tabs?.main_menu,
                                                      UserTabAccess?.header_menu,
                                                      subScreen?.main_menu,
                                                      tabs?.header_menu
                                                    );
                                                  } else {
                                                    UpdateSubMenuPermission(
                                                      tdDATA ? 0 : 1,
                                                      UserTabAccess?.main_menu,
                                                      tabs?.main_menu,
                                                      screen?.key,
                                                      UserTabAccess?.header_menu,
                                                      tabs?.header_menu,
                                                      subScreen?.main_menu,
                                                      subScreen?.header_menu
                                                    );
                                                  }
                                                }}
                                              />
                                              <p>{screen.name}</p>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      );
                                    }
                                  )}
                                </tr>
                              );
                            }
                          )
                        : ""}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Col>
        {/* CMS */}
        <Col xs={24} className={classes.permissionContainer}>
          <div className={classes.permissionHeader}>
            <CommonCheckBox
              //@ts-ignore
              checked={values?.cms?.cms_menu === 1}
              onChange={() => {
                UpdateAllPermission(
                  values?.cms,
                  //@ts-ignore
                  values?.cms?.cms_menu === 1 ? 0 : 1,
                  CMSTabAccess?.main_menu
                );
              }}
            />

            <h3>{CMSTabAccess.name}</h3>
          </div>
          <div className={classes.Permissiontablecontainer}>
            <table>
              <thead className={classes.permissionThead}>
                <tr>
                  <th>Menu</th>
                  <th>Sub Menu</th>
                  <th colSpan={10}>Access</th>
                </tr>
              </thead>
              <tbody>
                {CMSTabAccess?.SubTabs?.map((tabs: any, tabIndex: number) => {
                  return (
                    <>
                      <tr key={tabIndex}>
                        {tabs?.permission?.map(
                          (screen: any, screenIndex: number) => {
                            let tdDATA =
                              //@ts-ignore
                              values?.[CMSTabAccess?.main_menu]?.[
                                tabs?.main_menu
                              ]?.[screen?.key];

                            return (
                              <td>
                                {screen.name ? (
                                  <div className={classes.menuBox}>
                                    <CommonCheckBox
                                      checked={tdDATA ? true : false}
                                      onChange={() => {
                                        if (screen?.is_menu) {
                                          let finalData =
                                            //@ts-ignore
                                            values?.[CMSTabAccess?.main_menu]?.[
                                              tabs?.main_menu
                                            ];

                                          UpdateAllPermission(
                                            finalData,
                                            tdDATA ? 0 : 1,
                                            CMSTabAccess?.main_menu,
                                            tabs?.main_menu,
                                            CMSTabAccess?.header_menu
                                          );
                                        } else {
                                          UpdateCurrectPermission(
                                            tdDATA ? 0 : 1,
                                            CMSTabAccess?.main_menu,
                                            tabs?.main_menu,
                                            screen?.key,
                                            CMSTabAccess?.header_menu,
                                            tabs?.header_menu
                                          );
                                        }
                                      }}
                                    />
                                    <p>{screen.name}</p>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                        )}
                      </tr>
                      {tabs?.submenu
                        ? tabs?.submenu?.map(
                            (subScreen: any, subIndex: number) => {
                              return (
                                <tr key={subIndex}>
                                  <td>{}</td>
                                  {subScreen?.permission?.map(
                                    (screen: any, Screenindex: number) => {
                                      let tdDATA =
                                        //@ts-ignore
                                        values?.[CMSTabAccess?.main_menu]?.[
                                          tabs?.main_menu
                                        ]?.[subScreen?.main_menu]?.[
                                          screen?.key
                                        ];

                                      return (
                                        <td>
                                          {screen.name ? (
                                            <div className={classes.menuBox}>
                                              <CommonCheckBox
                                                checked={tdDATA ? true : false}
                                                onChange={() => {
                                                  if (screen?.is_menu) {
                                                    let finalData =
                                                      //@ts-ignore
                                                      values?.[
                                                        CMSTabAccess?.main_menu
                                                      ]?.[tabs?.main_menu]?.[
                                                        subScreen?.main_menu
                                                      ];

                                                    UpdateAllPermission(
                                                      finalData,
                                                      tdDATA ? 0 : 1,
                                                      CMSTabAccess?.main_menu,
                                                      tabs?.main_menu,
                                                      CMSTabAccess?.header_menu,
                                                      subScreen?.main_menu,
                                                      tabs?.header_menu
                                                    );
                                                  } else {
                                                    UpdateSubMenuPermission(
                                                      tdDATA ? 0 : 1,
                                                      CMSTabAccess?.main_menu,
                                                      tabs?.main_menu,
                                                      screen?.key,
                                                      CMSTabAccess?.header_menu,
                                                      tabs?.header_menu,
                                                      subScreen?.main_menu,
                                                      subScreen?.header_menu
                                                    );
                                                  }
                                                }}
                                              />
                                              <p>{screen.name}</p>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      );
                                    }
                                  )}
                                </tr>
                              );
                            }
                          )
                        : ""}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={24}>
          <CommonButton
            type="submit"
            isright
            lable={"Submit"}
            handleClickEvent={() => handleSubmit()}
          />
        </Col>
      </Row>
    </div>
  );
}
