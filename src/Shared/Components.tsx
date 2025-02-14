import classes from "./shared.module.css";
export const GetstatusWithColor = (status: number) => {
  return (
    <span style={{ color: status === 1 ? "green" : "red" }}>
      {status === 1 ? "Active" : "Inactive"}
    </span>
  );
};

export const ShowBigContent = (data: string) => {
  return data ? <p className={classes.descriptionBox}>{data}</p> : "-";
};

export const ShowViewData = (title: string, value: any) => {
  return (
    <p>
      <span>{title}</span>:<span>{value || "-"}</span>
    </p>
  );
};
