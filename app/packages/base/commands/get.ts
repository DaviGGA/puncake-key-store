import BaseMemoryStorage from "../access";
import { bulkString } from "../../common/Resp/data-types";

type Get = {
  key: string
}

export function get({ key }: Get) {
  return bulkString(BaseMemoryStorage.get(key) ?? "");
}