import MemoryStorage from "../persistence";
import { integer } from "../Resp/data-types";

export function rpush(key: string, value: string[]) {
  return integer(MemoryStorage.rpush(key, value));
}