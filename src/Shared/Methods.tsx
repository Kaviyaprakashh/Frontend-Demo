import {
  getSessionStorageData,
  removeSessionStorageData,
} from "../Store/Storage";
import { ENCRYPE_DECRYPT_KEY, REGEX } from "./Constants";
import { UpdateLoader } from "../Store/Rudux/Reducer/AuthReducer";
import toast from "react-hot-toast";
import { getCatchMsgType } from "../@Types/ApiDataTypes";
import dayjs from "dayjs";
import { useAppDispatch } from "../Store/Rudux/Config/Hooks";

export const getUserToken = () => {
  return getUserData()?.token;
};

export const getPermissionData = (name: string) => {
  let loginData: any = getSessionStorageData(name);
  if (!loginData) {
    return null;
  }
  let data = JSON.parse(DecryptData(loginData));
  return data;
};
export const getUserData = () => {
  let loginData: any = getSessionStorageData("EM_LOGIN_DATA");
  if (!loginData) {
    return null;
  }
  let data = JSON.parse(DecryptData(loginData));
  return {
    username: data.first_name,
    img: data?.img_path,
    user_id: data?.user_id,
    token: data.token,
    user_type: data?.user_type,
  };
};
// decrypt login token
export const DecryptData = (encriptText: string) => {
  var CryptoJS = require("crypto-js");
  var bytes = CryptoJS.AES.decrypt(encriptText, ENCRYPE_DECRYPT_KEY);

  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

// Encrypt Login Token

export const EncryptData = (token: string) => {
  var CryptoJS = require("crypto-js");
  var EncryptData = CryptoJS.AES.encrypt(token, ENCRYPE_DECRYPT_KEY).toString();
  return EncryptData;
};

export const DispatchLoader = (status: boolean) => {
  const ChangeLoaderStatus = () => {
    let dispatch = useAppDispatch();
    dispatch(UpdateLoader(status));
  };
  return ChangeLoaderStatus();
};

//SHOW TOAST FOR ERROR MASSEGE FROM API RESPONS

export function getCatchMsg(error: getCatchMsgType) {
  if (error?.response?.data) {
    if (typeof error?.response?.data?.detail === "string") {
      toast.error(error?.response?.data?.detail);
    } else if (error?.response?.data?.detail) {
      if (Array.isArray(error?.response?.data?.detail)) {
        toast.error(error?.response?.data?.detail?.[0]?.msg);
      } else {
        toast.error(error?.response?.data?.detail?.msg);
      }
    }
  } else if (error.response) {
    if (error.response.status === 404) {
      toast.error("The requested resource does not exist or has been deleted");
    } else if (error.response.status === 401) {
      toast.error("Please login to access this resource!");
    } else if (error.response.status === 500) {
      toast.error("Internal Server Error !");
    } else {
      toast.error("An error occurred");
    }
  } else {
    toast.error("Something went wrong!");
  }
}

export const RemoveNonNumeric = (value: any) => {
  return value.replace(/[^0-9]/g, "");
};
export const ValidateAlphanumeric = (value: string) => {
  if (REGEX.AlphaNumeric.test(value) || value === "") {
    return true;
  } else return false;
};

//REMOVES EMOJIS AND RETUEN A STRING
export const removeEmojis = (EventString: any) => {
  const value = EventString.replace(
    /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g,
    ""
  );
  return value;
};
export const validateFax = (EventString: any) => {
  const value = EventString.replace(REGEX.FAX, "");
  return value;
};

// convert json to formData

export type ObjectType = {
  [key: string]: any;
};

export const FilterValidObj = (obj: ObjectType) => {
  const finalObj: ObjectType = {};
  for (const key in obj) {
    const value = obj[key];

    if (value !== undefined && value !== null && value !== "") {
      finalObj[key] = typeof value === "string" ? value.trim() : value;
    }
  }
  return finalObj;
};

export const ConvertJSONtoFormData = (obj: ObjectType, isFilter = true) => {
  const formData = new FormData();
  for (const key in obj) {
    const value = obj[key];
    if (!isFilter || (value !== undefined && value !== null && value !== "")) {
      formData.append(key, typeof value === "string" ? value.trim() : value);
    }
  }

  return formData;
};

// get table list serial number

export const getTableSNO = (page: number, size?: any, index = 0) => {
  return (page - 1) * size + (index + 1);
};

export const getStatrtIndex = (page = 1, size = 0) => {
  return (page - 1) * size + 1;
};
export const getEndIndex = (page = 1, size = 0, length = 0) => {
  let count = (page - 1) * size;

  return count + length;
};

export const ClearStorageData = () => {
  removeSessionStorageData("EM_LOGIN_DATA");
  removeSessionStorageData("EM_USER_ACCESS_PERMISSION");
  removeSessionStorageData("COPIED_PERMISSION");
};
export const getUserHeaderName = (pathname: string) => {
  if (pathname.includes("admin")) {
    return {
      title: "Admin",
      userType: 2,
      pathname: "admin",
      key: "admin",
    };
  } else if (pathname.includes("engineers")) {
    return {
      title: "Engineer",
      userType: 4,
      pathname: "engineers",
      key: "engineer",
    };
  } else if (pathname.includes("sales_engineer")) {
    return {
      title: "Sales Executive",
      userType: 3,
      pathname: "sales_engineer",
      key: "sales_executive",
    };
  } else if (pathname.includes("customers")) {
    return {
      title: "Customer",
      userType: 5,
      pathname: "customers",
      key: "customer",
    };
  } else return { title: "", userType: 0, pathname: "admin", key: "" };
};

export const CheckFileType = (file: any) =>
  typeof file === "string" ? "" : file;

export const Float_Validation = (value: string) =>
  value.match(REGEX.AMOUNT) || value === "" ? true : false;

// Input fields Validation

export const NameValidation = (value: string) => {
  return value.match(REGEX.NAME_REGEX) || value === "" ? true : false;
};

export const SEOValidation = (value: string) => {
  return value.match(REGEX.SeoUrl) || value === "" ? true : false;
};

export const numberValidation = (value: string) => {
  return REGEX.NUMBER_REGEX.test(value) || value === "" ? true : false;
};
export const FloatValidation = (value: string) => {
  return REGEX.FLOAT.test(value) || value === "" ? true : false;
};

export const SpecialCharremoveValidation = (value: string) => {
  return value.match(REGEX.SPECIAL_CHARACTER_REGEX) || value === ""
    ? true
    : false;
};

export const CheckfiltersAvailable = (filters: ObjectType) => {
  for (let key in filters) {
    if (filters[key]) {
      return true;
    }
  }
  return false;
};

export const ConvertDatetime = (
  date: Date,
  type: "DATE" | "DATE_TIME" | "START" | "END" | "YEAR"
) => {
  if (type === "DATE") {
    return dayjs(date).format("YYYY-MM-DD");
  } else if (type === "DATE_TIME") {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  } else if (type === "START") {
    return dayjs(date).format("YYYY-MM-DD 00:00:00");
  } else if (type === "END") {
    return dayjs(date).format("YYYY-MM-DD 23:59:59");
  } else if (type === "YEAR") {
    return dayjs(date).format("YYYY");
  } else return "";
};

export const StringifyObj = (object: ObjectType) => {
  try {
    return JSON.stringify(object);
  } catch {
    return object;
  }
};

export const GetApipage = (status: number, items: any, page: number) => {
  return status === -1 && items.length === 1 && page > 1 ? page - 1 : page;
};

export const getUserTabName = (usertype: any) => {
  return usertype === 2
    ? "Admin"
    : usertype === 4
    ? "Engineer"
    : usertype === 3
    ? "Sales Executive"
    : usertype === 5
    ? "Customer"
    : "User";
};

type Datetypes = "YEAR" | "WEEK" | "MONTH" | "TODAY";
export const StartEndDates = (type: Datetypes) => {
  switch (type) {
    case "TODAY":
      return {
        from_date: ConvertDatetime(new Date(), "START"),
        to_date: ConvertDatetime(new Date(), "END"),
      };

      break;
    case "WEEK":
      const now = new Date();
      const from_date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      const to_date = new Date(
        now.getFullYear(),
        now.getMonth(),
        from_date.getDate() + 7
      );
      return {
        from_date: ConvertDatetime(from_date, "START"),
        to_date: ConvertDatetime(to_date, "END"),
      };

      break;
    case "MONTH":
      return {
        from_date: dayjs(new Date()).format("YYYY-MM-01 00:00:00"),
        to_date: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
      };

      break;
    case "YEAR":
      return {
        from_date: dayjs(new Date()).format("YYYY-01-01 00:00:00"),
        to_date: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
      };
      break;
  }
};

export const CheckAllvalues = (object: ObjectType) => {
  return !JSON.stringify(object).match(/:\s*(?!0\b)\d+/);
};
