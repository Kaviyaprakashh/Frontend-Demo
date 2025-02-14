import {
  GlobalTableTypes,
  TableOptionsType,
} from "../../@Types/CommonComponentTypes";
import Nodata from "../ErrorElements/Nodata";
import CommonPopover from "./CommonPopover";
import classes from "./uicomponents.module.css";
export default function GlobalTable({
  Options,
  items,
  total,
  ismodify = false,
  extraColumns,
  maxHeight,
}: GlobalTableTypes) {
  return (
    <>
      <div
        className={classes.tablecontainer}
        style={{ maxHeight: maxHeight ?? "" }}
      >
        <table>
          <thead className={maxHeight ? classes.Stickythead : ""}>
            <tr className={classes.tableHead}>
              {Options?.map((data, index) => {
                return (
                  <th key={index} className={data.className}>
                    {data.lable}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {total ? (
              <>
                {items?.map((data, index) => {
                  return (
                    <tr key={index}>
                      {Options.map((ele: TableOptionsType, ind) => {
                        return ele?.showTooltip && data[ele.key] ? (
                          <CommonPopover
                            key={ind}
                            title={Options[ind]?.lable || ""}
                            content={data[ele.key] || ""}
                          >
                            <td key={ind} className={ele.className ?? ""}>
                              {ele.render(data[ele.key], data, index)}
                            </td>
                          </CommonPopover>
                        ) : (
                          <td key={ind} className={ele.className ?? ""}>
                            {ele.render(data[ele.key], data, index)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {/* FOR SHOWING TOTAL AND GRAND TOTAL IN PRODUCT LIST IN ORDER */}
                {extraColumns?.map((ele, index) => {
                  return (
                    <tr key={index}>
                      <td colSpan={Options.length - 2}></td>
                      <td
                        className={classes.Tabletitle}
                        style={{
                          color: ele?.title === "Grand Total" ? "green" : "",
                        }}
                      >
                        {ele?.title}
                      </td>
                      <td
                        className={classes.amountBox}
                        style={{
                          color: ele?.title === "Grand Total" ? "green" : "",
                        }}
                      >
                        {ele?.value ? parseFloat(ele?.value).toFixed(2) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={11}>{!ismodify ? <Nodata /> : ""}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
