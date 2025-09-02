import MemoryStorage from "../persistence";
import { simpleString } from "../common/Resp/data-types";

type Type = {
  key: string
}

export function type({ key }: Type) {
  const getTypeResult = MemoryStorage.getType(key);
  return simpleString(getTypeResult ?? "none")
}

