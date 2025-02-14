import classes from "./uicomponents.module.css";
import { ConfigProvider, Pagination } from "antd";
import { PaginationSize } from "../../Shared/Constants";
import { getEndIndex, getStatrtIndex } from "../../Shared/Methods";
import CommonSelect from "../FormFields/CommonSelect";

type ListApiProps = {
  page?: number;
  size: number;
  total?: number;
  items?: any[];
};
type PaginationProps = {
  DataList: ListApiProps;
  handleListapi: (page: number, size: number, filters: any) => void;
  filters: any;
};

export default function CommonPaginaion({
  DataList,
  handleListapi,
  filters,
}: PaginationProps) {
  const { items, page, size, total } = DataList;
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: "var(--TableHeader)",
            colorText: "black",
            colorBgTextHover: "var(--TableHeader)",
            borderRadius: 40,
            fontSize: 12,
            lineWidthBold: 0,
            lineWidth: 0,
          },
        },
      }}
    >
      {total ? (
        <div className={classes.paginationdisplay}>
          <div className={classes.itemsstyle}>
            Displaying&nbsp;&nbsp;
            <span>{getStatrtIndex(page, size)}</span>
            &nbsp;-&nbsp;
            <span>{getEndIndex(page, size, items?.length)}</span>&nbsp;of&nbsp;
            <span>{total}&nbsp;</span>
            results.
          </div>
          <div className={classes.paginationandresult}>
            <Pagination
              current={page}
              onChange={(e) => handleListapi(e, size, filters ? filters : null)}
              showSizeChanger={false}
              pageSize={size}
              total={total}
            />
            <CommonSelect
              placeholder="page"
              styles={{ width: 100, height: 30 }}
              value={size}
              onChange={(e) => handleListapi(1, e, filters ? filters : null)}
              options={PaginationSize}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </ConfigProvider>
  );
}
