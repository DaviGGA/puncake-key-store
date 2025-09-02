import { bulkString } from "../../common/Resp/data-types";

type Echo = {
  value: string
}

export function echo({ value }: Echo) {
  return bulkString(value);
}