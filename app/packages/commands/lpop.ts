import MemoryStorage from "../persistence";
import { array, bulkString } from "../Resp/data-types";

export function lpop(key: string, quantity: number) {
  const lpopResult = MemoryStorage.lpop(key, quantity);
  switch (lpopResult.length) {
    case 0: return bulkString("");
    case 1: return bulkString(lpopResult[0]);
    default: return array(lpopResult);
  }
}