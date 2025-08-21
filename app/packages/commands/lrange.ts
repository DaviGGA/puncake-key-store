import MemoryStorage from "../persistence";
import { array } from "../Resp/data-types";

export function lrange(key: string, start: number, end: number) {
  return array(MemoryStorage.lrange(key, start, end));
}