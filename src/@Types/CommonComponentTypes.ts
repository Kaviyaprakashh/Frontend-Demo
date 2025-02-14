export type InputBoxTypes = {
  lable?: string;
  value?: any;
  placeholder: string;
  maxLength: number;
  errorText?: string;
  isRequired?: boolean;
  isPassword?: boolean;
  disabled?: boolean;
  styles?: any;
  inputtype?: string;
  onChange?: (data: any) => void;
  onKeyDown?: (data: any) => void;
  onBlur?: (data: any) => void;
  acceptZero?: boolean;
  handleSubmit?: () => void;
  validationType?:
    | "NUMBER"
    | "CHARACTER"
    | "ALPHA_NUMERIC"
    | "AMOUNT"
    | "CHAR_AND_SPACE"
    | "SEO_URL"
    | "PREVENT_EMOJI"
    | "PREVENT_SPECIAL_CHAR"
    | "PREVENT_SPACE"
    | "FLOAT";
};

export type CommonButtonTypes = {
  lable: string | React.ReactNode;
  handleClickEvent?: () => void;
  type?:
    | "submit"
    | "reset"
    | "add"
    | "update"
    | "modalOk"
    | "modalCancel"
    | "back"
    | "delete"
    | "download"
    | "export"
    | "edit"
    | "auth"
    | "search";
  styles?: any;
  isright?: boolean;
};

export type SelectBoxTypes = {
  lable?: string;
  value?: any;
  placeholder: string;
  errorText?: string;
  isRequired?: boolean;
  onChange?: (data: any, val?: any) => void;
  options?: any[];
  mode?: "multiple" | "tags" | undefined;
  allowClear?: boolean;
  disabled?: boolean;
  optionFilterProp?: string;
  onKeyDown?: (data: any) => void;
  onClick?: () => void;
  styles?: any;
  optionName?: string | any;
};

export type DatePickerProps = {
  lable?: string;
  value?: any;
  placeholder: string;
  errorText?: string;
  isRequired?: boolean;
  onChange?: (data: any) => void;
  dateFormat?: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss" | "YYYY";
  formate?: "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss" | "YYYY";
  allowClear?: boolean;
  disabled?: boolean;
  picker?: any;
  styles?: any;
  isFuture?: boolean;
  isPast?: boolean;
  fromtodate?: boolean;
  startDate?: any;
  endDate?: any;
  onKeyDown?: (data: any) => void;
};

export type CheckBoxTypes = {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
};

export type ScreenHeaderTypes = {
  name: string;
  OnClickAdd?: () => void;
  OnClickFilter?: () => void;
  onClickCopyPermission?: () => void;
  onClickBackBtn?: (() => void) | false;
  onClickSaveBtn?: (() => void) | false;
  onClickDownLoadBtn?: (() => void) | false;
  permissionData?: any;
};

export type SubmitResetTypes = {
  handleClickSubmit?: () => void;
  handleClickReset?: () => void;
};

export type GlobalTableTypes = {
  Options: TableOptionsType[];
  items?: any[];
  total: number;
  ismodify?: boolean;
  extraColumns?: any[];
  maxHeight?: number;
  pricingViewId?: number | null;
  priceNameList?: any[];
  productPricingList?: any[];
  ExpandIndex?: number;
};

export type GlobalModalProps = {
  Visible: boolean;
  children: JSX.Element | JSX.Element;
  size?: "lg" | "sm" | "xl" | "md" | number;
  title?: string;
  OnClose?: () => void;
};

export type CommonFileType = {
  fileRef: any;
  lable?: string;
  isRequired?: boolean;
  OnChange: (data: any) => any;
  handleClear?: () => any;
  value?: any;
  errorText?: string;
  imagePath?: string | File;
  type: string;
  id?: string;
  Clearable?: boolean;
};

export type TableOptionsType = {
  lable?: string | any;
  title?: string | any;

  className?: any;
  render: (data?: any, obj?: any, ind?: any) => any;
  key: string;
  dataIndex?: string;

  showTooltip?: boolean;
};

export type CommonSwitchProps = {
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};

export type ImageBoxTypes = {
  source: string;
  alt: string;
  type?:
    | "table"
    | "view"
    | "View"
    | "gallery"
    | "fileinput"
    | "setting"
    | "tableIcon"
    | "permission"
    | "review"
    | "images";
  onClick?: () => void;
  showPreview?: boolean;
  fullwidth?: boolean;
  tooltipData?: string;
};

export type AlterProps = {
  msg: string;
  showIcon?: boolean;
  style?: React.CSSProperties;
  type: "success" | "info" | "warning" | "error" | undefined;
};
