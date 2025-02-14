export type GlobalModifyModalProps = {
  type?: string;
  UpdateData?: any;
  OnClose: () => void;
  handleSuccess: () => void;
};

export type viewModalProps = {
  OnClose?: () => void;
  UpdateData: any;
  title?: string;
};

export type ChangePasswordProps = {
  currentpassword: string;
  newpassword: string;
  confirm_password: string;
};

export type PasswordModalProps = {
  OnClose: () => void;
  id: number;
  handleSuccess?: () => void;
  isUser?: boolean;
};

export type ProductImageModalProps = {
  img_path?: string;
  img_alt?: string;
  thumb_path?: string;
};

export type ImageCropProps = {
  image: any;
  handleSuccess: (data: any) => void;
  OnClose: () => void;
  fileName?: string;
};
