import MemoryStorage from "../persistence";
import { array, bulkString } from "../common/Resp/data-types";

type Lpop = {
  key: string,
  quantity: string | undefined
}

export function lpop({key, quantity}: Lpop) {
  const parsedQuantity = quantity ? parseInt(quantity) : 1
  const lpopResult = MemoryStorage.lpop(key, parsedQuantity);
  switch (lpopResult.length) {
    case 0: return bulkString("");
    case 1: return bulkString(lpopResult[0]);
    default: return array(lpopResult);
  }
}

