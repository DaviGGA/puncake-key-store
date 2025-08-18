import { bulkString } from "../Resp";

export function echo(value: string) {
  return bulkString(value);
}