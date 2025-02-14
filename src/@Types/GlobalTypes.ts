export type OptionsType = {
  [key: string]: any;
};
export type OnChangeEventType = React.ChangeEvent<HTMLInputElement>;
export type OnKeyDownEventType = React.KeyboardEvent<HTMLInputElement>;
export type OptionTypes = {
  label: string;
  value: number;
};

export type ModifyTypes = "Create" | "Update" | "Delete" | undefined;

export type PermissionType = {
  id: number;
  name: string;
  key: string;
  permission?: any[];
};

export type ProductVariantsProps = {
  errors: any;
  touched: any;
  values: any;
  setFieldValue: any;
  priceNameList: any[];
  setFieldTouched: any;
  setValues: any;
};
