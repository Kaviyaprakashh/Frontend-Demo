import { getCookie, setCookie } from "./Cookie";

// Cookies

export const getCookieData = (key: string) => {
  return getCookie(key);
};

export const setCookieData = (key: string, value: any, exdays = 30) => {
  return setCookie(key, value, exdays);
};

// Session
export const setSessionStorageData = (key: string, value: any) => {
  return sessionStorage.setItem(key, value);
};

export const getSessionStorageData = (key: string) => {
  return sessionStorage.getItem(key);
};

export const removeSessionStorageData = (key: string) => {
  return sessionStorage.removeItem(key);
};

// LocalStorage
