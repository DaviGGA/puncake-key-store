import MemoryStorage from "../persistence";
import { integer } from "../common/Resp/data-types";

type Rpush = {
  key: string,
  value: string[],
}

export function rpush({ key, value }: Rpush) {
  return integer(MemoryStorage.rpush(key, value));
}
