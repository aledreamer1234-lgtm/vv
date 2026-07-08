import { useMemo } from "react";
import { detectBrand, type Brand } from "./brand";

export function useBrand(): Brand {
  return useMemo(() => detectBrand(), []);
}
