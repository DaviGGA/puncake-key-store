import MemoryStorage from "../persistence";
import { integer } from "../Resp/data-types";

export function llen(key: string) {
  return integer(MemoryStorage.llen(key));
}