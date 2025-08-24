import { bulkString } from "../Resp/data-types";

type XAdd = {
  key: string,
  id: string,
  entriesArray: string[]
}

export type Entries = Record<string, string>

export function xAdd({ key, id , entriesArray }: XAdd) {
  let entries: Entries = {};

  for (let i = 0; i < entriesArray.length; i+= 2) {
    entries[entriesArray[i]] = entriesArray[i + 1];
  }

  return bulkString(id);
}


