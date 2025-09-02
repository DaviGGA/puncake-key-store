import BaseMemoryStorage from "../access";
import { simpleString } from "../../common/Resp/data-types";

type Set = {
  key: string,
  value: string,
  px: string | undefined,
  expiryTime: string
}

export function set({ key, value, px, expiryTime }: Set) {
  const parsedExpiryTime = px ? parseInt(expiryTime) : 0;
  BaseMemoryStorage.set(key, value, parsedExpiryTime);
  return simpleString("OK");
}

