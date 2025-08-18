import { bulkString } from "../Resp/data-types";

export function echo(value: string) {
  return bulkString(value);
}