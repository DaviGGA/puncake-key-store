import MemoryStorage from "../persistence";
import { bulkString } from "../Resp/data-types";

type Get = {
  key: string
}

export function get({ key }: Get) {
  return bulkString(MemoryStorage.get(key) ?? "");
}