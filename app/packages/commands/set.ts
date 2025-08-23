import MemoryStorage from "../persistence";
import { simpleString } from "../Resp/data-types";

type Set = {
  key: string,
  value: string,
  px: string | undefined
}

export function set({ key, value, px }: Set) {
  const expiryTime = px ? parseInt(px) : 0;
  MemoryStorage.set(key, value, expiryTime);
  return simpleString("OK");
}

