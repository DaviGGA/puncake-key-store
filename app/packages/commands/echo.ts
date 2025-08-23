import { bulkString } from "../Resp/data-types";

type Echo = {
  value: string
}

export function echo({ value }: Echo) {
  return bulkString(value);
}