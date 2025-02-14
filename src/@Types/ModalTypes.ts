export type ConfirmationType = {
  title?: string;
  msg?: string | React.ReactNode;
  OkButton?: string;
  cancelButton?: string;
  onClickOkButton?: () => void;
  onClickcancelButton?: () => void;
  type?: "logout" | "confirmation" | "categorydelete" | "delete";
  name?: string;
};
