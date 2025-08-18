import db from "../persistence";
import { bulkString } from "../Resp/data-types";

export function get(key: string) {
  const result = db.get(key);
  const value = result?.value ?? "";
  return bulkString(value);
}