export type SignInTypes = {
  username: string;
  password: string;
};

interface getCatchMsgDetailMsgType {
  msg: string;
}

interface getCatchMsgDetailType {
  detail: getCatchMsgDetailMsgType;
}
interface getCatchMsgDataType {
  data: getCatchMsgDetailType;
  status: number | string;
}

export type getCatchMsgType = {
  response: getCatchMsgDataType;
  request: string;
};

export type DropdownTypes = {
  label: string;
  value: string;
};
