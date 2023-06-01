import { IUserInfo } from "./types";

export const logOut = (): void => {
  localStorage.setItem("accessToken", "");
  localStorage.setItem("currentUser", "");
  window.location.pathname = "/";
};

export const getCurrentUser = (): IUserInfo => {
  const currentUser: IUserInfo = JSON.parse(
    localStorage.getItem("currentUser") || ""
  );
  return currentUser;
};
