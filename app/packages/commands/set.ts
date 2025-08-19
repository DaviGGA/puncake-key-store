import MemoryStorage from "../persistence";
import { simpleString } from "../Resp/data-types";

export function set(key: string, value: string, expiryTime: number) {
  MemoryStorage.set(key, value, expiryTime);
  return simpleString("OK");
}