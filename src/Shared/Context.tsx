import { createContext, useContext } from "react";
import { ProductVariantsProps } from "../@Types/GlobalTypes";

export const ModifyProductContext = createContext<ProductVariantsProps>(
  {} as ProductVariantsProps
);

export const useModifyProductContext = () => useContext(ModifyProductContext);
