import MemoryStorage from "../persistence";
import { integer } from "../Resp/data-types";

type Llen = { key: string }

export function llen({ key }: Llen) {
  return integer(MemoryStorage.llen(key));
}
