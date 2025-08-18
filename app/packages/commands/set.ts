import db from "../persistence";
import { simpleString } from "../Resp/data-types";

export function set(key: string, value: string) {
  db.set(key, { value })
  return simpleString("OK");
}