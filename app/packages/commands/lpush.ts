import MemoryStorage from "../persistence";
import { integer } from "../Resp/data-types";

export function lpush(key: string, value: string[]) {
  return integer(MemoryStorage.lpush(key, value));
}