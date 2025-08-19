import MemoryStorage from "../persistence";
import { bulkString } from "../Resp/data-types";

export function get(key: string) {
  return bulkString(MemoryStorage.get(key) ?? "");
}