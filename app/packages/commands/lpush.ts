import MemoryStorage from "../persistence";
import { integer } from "../common/Resp/data-types";

type Rpush = {
  key: string,
  value: string[],
}

export function lpush({ key, value }: Rpush) {
  return integer(MemoryStorage.lpush(key, value));
}