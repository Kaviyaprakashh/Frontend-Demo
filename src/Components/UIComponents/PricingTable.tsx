import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import classes from "./uicomponents.module.css";
import CommonInput from "../FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import CommonImageBox from "../FormFields/CommonImageBox";
import { Images } from "../../Shared/ImageExport";
import CommonPopover from "./CommonPopover";
import { useState } from "react";
import ProductPricing from "./ProductPricing";
import { useModifyProductContext } from "../../Shared/Context";

export default function PricingTable() {
  const [expandRow, setExpandRow] = useState(null);
  const { errors, values, setFieldValue, touched, setFieldTouched } =
    useModifyProductContext();

  const getErrors = (index: number, key: string) => {
    if (errors?.product_variants?.[index]?.[key] && touched?.product_variants) {
      return errors?.product_variants?.[index]?.[key];
    } else return "";
  };

  const ProductVarientTableOptions: TableOptionsType[] = [
    {
      title: "#",
      key: "",
      className: classes.tableXSbox,
      render: (text: any, _, index) => index + 1,
    },
    {
      title: "Size",

      key: "size",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter size"
            value={text}
            validationType={"PREVENT_EMOJI"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].size`, data);
            }}
            errorText={getErrors(index, "size")}
          />
        </>
      ),
    },
    {
      title: "MRP Price (₹)",
      key: "actual_price",

      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].actual_price`, data);
            }}
            errorText={getErrors(index, "actual_price")}
          />
        </>
      ),
    },
    {
      title: "Offer Price (₹)",
      key: "price",
      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Price"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].price`, data);
            }}
            errorText={getErrors(index, "price")}
          />
        </>
      ),
    },

    {
      title: "Weight",
      key: "weight",

      className: classes.tableMDbox,
      render: (text: any, _, index) => (
        <>
          <CommonInput
            maxLength={INPUT_LENGTHS.Price}
            placeholder="Enter Weight"
            value={text}
            validationType={"AMOUNT"}
            onChange={(data) => {
              setFieldValue(`product_variants[${index}].weight`, data);
            }}
            errorText={getErrors(index, "weight")}
          />
        </>
      ),
    },
    {
      key: "9",
      render(data, obj, ind) {
        return (
          <CommonImageBox
            source={Images.PriceTagIcon}
            alt="Pricing Tag"
            type="tableIcon"
            onClick={() => {
              setFieldTouched(`product_variants?.[${expandRow}]`, true);

              if (expandRow !== null && expandRow == ind) {
                if (!errors?.product_variants?.[expandRow]?.product_pricing) {
                  setExpandRow(null);
                } else {
                  setFieldTouched(`product_variants[${expandRow}]`, true);
                }
              } else if (expandRow === null) {
                setExpandRow(ind == expandRow ? null : ind);
              } else if (
                !errors?.product_variants?.[expandRow || 0] &&
                expandRow !== null
              ) {
                setExpandRow(ind);
                setFieldTouched(`product_variants[${expandRow}]`, true);
              } else {
              }
            }}
          />
        );
      },
    },
    {
      title: (
        <CommonImageBox
          source={Images.ADD_ICON}
          alt="add icon"
          type="tableIcon"
        />
      ),
      className: classes.tableXSbox,
      key: "6",
      render: (text: any, data, index) =>
        values?.product_variants?.length === 1 ? (
          ""
        ) : (
          <>
            <CommonImageBox
              source={Images.CANCEL_ICON}
              alt="add icon"
              type="tableIcon"
              onClick={() => {
                if (data?.price_mapping_id) {
                  //   handleDeleteProductPriceClass(data.price_mapping_id);
                } else {
                  setFieldValue(
                    "product_variants",
                    values.product_variants.filter(
                      (elem: any, ind: number) => ind !== index
                    )
                  );
                  setExpandRow(index !== expandRow ? expandRow : null);
                }
              }}
            />
          </>
        ),
    },
  ];

  return (
    <div className={classes.tablecontainer}>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Size</th>
            <th>MRP Price (₹)</th>
            <th>Offer Price (₹)</th>
            <th>Weight</th>
            <th>Pricing Tags</th>
            <th>
              <CommonImageBox
                source={Images.ADD_ICON}
                alt="add icon"
                type="tableIcon"
                onClick={() => {
                  if (!errors?.product_variants) {
                    setFieldValue("product_variants", [
                      {
                        size: "",
                        price: "",
                        weight: "",
                        actual_price: "",
                        product_pricing: [],
                      },
                      ...values.product_variants,
                    ]);
                    setExpandRow(null);
                  } else {
                    setFieldTouched(`product_variants[${expandRow}]`, true);
                  }
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {values?.product_variants?.map((data: any, index: number) => {
            return (
              <>
                <tr key={index}>
                  {ProductVarientTableOptions.map(
                    (ele: TableOptionsType, ind) => {
                      return ele?.showTooltip && data[ele.key] ? (
                        <CommonPopover
                          key={ind}
                          title={ProductVarientTableOptions[ind]?.lable || ""}
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
                    }
                  )}
                </tr>

                {expandRow === index && (
                  <tr>
                    <td
                      colSpan={20}
                      style={{ border: " 1px solid var(--COLOR_GRAY)" }}
                    >
                      <ProductPricing ExpandedRow={expandRow} />
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
