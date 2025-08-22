import MemoryStorage from "../persistence";
import { array, bulkString } from "../Resp/data-types";

export function lpop(key: string, quantity: number) {
  const lpopResult = MemoryStorage.lpop(key, quantity);
  console.log("LPOP RESULT", lpopResult);
  console.log("LPOP RESP ARR", array(lpopResult))
  return lpopResult.length !== 0 ?
    array(lpopResult) : bulkString("");
}