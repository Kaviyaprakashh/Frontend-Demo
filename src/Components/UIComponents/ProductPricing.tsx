import CommonImageBox from "../FormFields/CommonImageBox";
import classes from "./uicomponents.module.css";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import CommonSelect from "../FormFields/CommonSelect";
import { useModifyProductContext } from "../../Shared/Context";
import CommonInput from "../FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../Shared/Constants";
import { Images } from "../../Shared/ImageExport";
import CommonAlter from "./CommonAlter";
import Nodata from "../ErrorElements/Nodata";

export type ProductPricingProps = {
  ExpandedRow: number;
};

export default function ProductPricing({ ExpandedRow }: ProductPricingProps) {
  const {
    priceNameList,
    values,
    setFieldValue,
    setFieldTouched,
    errors,
    touched,
  } = useModifyProductContext();

  const getErrors = (index: number, key: string) => {
    const errorPath =
      errors?.product_variants?.[ExpandedRow]?.product_pricing?.[index]?.[key];
    const isTouched = touched?.product_variants?.[ExpandedRow];
    return isTouched && errorPath ? errorPath : "";
  };

  const handleDeleteRow = (index: number, priceMappingId?: number) => {
    const updatedPricing = values.product_variants?.[
      ExpandedRow
    ]?.product_pricing.filter((_: any, ind: number) => ind !== index);
    setFieldValue(
      `product_variants[${ExpandedRow}].product_pricing`,
      updatedPricing
    );
  };

  const addNewPricingRow = () => {
    if (!errors?.product_variants?.[ExpandedRow]?.product_pricing) {
      const newRow = { price_name_id: null, price: "", actual_price: "" };
      setFieldValue(`product_variants[${ExpandedRow}].product_pricing`, [
        newRow,
        ...values?.product_variants?.[ExpandedRow]?.product_pricing,
      ]);
    } else {
      setFieldTouched(`product_variants[${ExpandedRow}].product_pricing`, true);
    }
  };

  const PricingTableOptions: TableOptionsType[] = [
    {
      lable: "#",
      key: "",
      className: classes.tableXSbox,
      render: (_, __, index) => index + 1,
    },
    {
      lable: "Price Name",
      key: "price_name_id",
      className: classes.tableMDbox,
      render: (value, _, index) => (
        <CommonSelect
          placeholder="Select Price Name"
          options={priceNameList}
          value={value}
          onChange={(data) =>
            setFieldValue(
              `product_variants[${ExpandedRow}].product_pricing[${index}].price_name_id`,
              data
            )
          }
          errorText={getErrors(index, "price_name_id")}
        />
      ),
    },
    {
      lable: "MRP Price (₹)",
      key: "actual_price",
      className: classes.tableInputBox,
      render: (value, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.Price}
          placeholder="Enter MRP Price"
          value={value}
          validationType="AMOUNT"
          onChange={(data) =>
            setFieldValue(
              `product_variants[${ExpandedRow}].product_pricing[${index}].actual_price`,
              data
            )
          }
          errorText={getErrors(index, "actual_price")}
        />
      ),
    },
    {
      lable: "Offer Price (₹)",
      key: "price",
      className: classes.tableInputBox,
      render: (value, _, index) => (
        <CommonInput
          maxLength={INPUT_LENGTHS.Price}
          placeholder="Enter Price"
          value={value}
          validationType="AMOUNT"
          onChange={(data) =>
            setFieldValue(
              `product_variants[${ExpandedRow}].product_pricing[${index}].price`,
              data
            )
          }
          errorText={getErrors(index, "price")}
        />
      ),
    },
    {
      lable: (
        <CommonImageBox
          source={Images.AddPriceIcon}
          alt="Add row"
          type="tableIcon"
          onClick={addNewPricingRow}
        />
      ),
      key: "",
      className: classes.tableXSbox,
      render: (_, row, index) => (
        <CommonImageBox
          source={Images.RemoveIcon}
          alt="Remove row"
          type="tableIcon"
          onClick={() => handleDeleteRow(index, row?.price_mapping_id)}
        />
      ),
    },
  ];

  return (
    <div className={classes.subTable}>
      <p className={"Label"}>Pricing Tags</p>
      {errors?.product_variants?.[ExpandedRow || 0]?.product_pricing &&
        typeof errors?.product_variants?.[ExpandedRow || 0]?.product_pricing ===
          "string" &&
        touched?.product_variants && (
          <CommonAlter
            msg={
              errors?.product_variants?.[ExpandedRow || 0]?.product_pricing ||
              ""
            }
            showIcon
            style={{ margin: "10px 10px" }}
            type="error"
          />
        )}
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            {PricingTableOptions.map((col, index) => (
              <th key={index}>{col.lable}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values?.product_variants?.[ExpandedRow]?.product_pricing?.length ===
            0 && (
            <tr>
              <td colSpan={5}>
                <Nodata msg="No Pricing Tags are found,Add Tags" />
              </td>
            </tr>
          )}
          {values?.product_variants?.[ExpandedRow]?.product_pricing?.map(
            (row: any, index: number) => (
              <tr key={index}>
                {PricingTableOptions.map((col, colIndex) => (
                  <td key={colIndex} className={col.className ?? ""}>
                    {col.render(row[col.key], row, index)}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
