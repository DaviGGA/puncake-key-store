import type { StringValue } from "../common/types";
import { db } from "../common/storage";

function set(key: string, value: string, expiryTime: number) {
  db.set(key, createStringValue(value, expiryTime))
}

function get(key: string) {
  const result = db.get(key) as StringValue | undefined;

  if(!result) return undefined;
  if(result.expiryTime == 0) return result.value;

  return result.expiryTime >= Date.now() ?
    result.value : undefined
}

const BaseMemoryStorage = {
  set, get
}

const createStringValue = (value: string, expiryTime: number = 0): StringValue =>
  ({value, expiryTime: expiryTime && Date.now() + expiryTime, type: "string"})

export default BaseMemoryStorage;