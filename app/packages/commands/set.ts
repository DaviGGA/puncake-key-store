import MemoryStorage from "../persistence";
import { simpleString } from "../Resp/data-types";

type Set = {
  key: string,
  value: string,
  px: string | undefined,
  expiryTime: string
}

export function set({ key, value, px, expiryTime }: Set) {
  const parsedExpiryTime = px ? parseInt(expiryTime) : 0;
  MemoryStorage.set(key, value, parsedExpiryTime);
  return simpleString("OK");
}

