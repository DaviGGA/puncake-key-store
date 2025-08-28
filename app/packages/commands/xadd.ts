import MemoryStorage from "../persistence";
import { bulkString, simpleError } from "../Resp/data-types";

type XAdd = {
  key: string,
  id: string,
  entriesArray: string[]
}

export type Entries = Record<string, string>

export function xAdd({ key, id , entriesArray }: XAdd) {
  if (id === "0-0")
    return simpleError("ERR The ID specified in XADD must be greater than 0-0")


  const topStream = MemoryStorage.getTopStream(key);

  if(topStream) {
    const error = validateId(id, topStream.id);
    if (error) return simpleError(error);
  }

  let entries: Entries = {};

  for (let i = 0; i < entriesArray.length; i+= 2) {
    entries[entriesArray[i]] = entriesArray[i + 1];
  }

  MemoryStorage.xadd(key, id, entries);

  return bulkString(id);
}

type DecomposedId = {
  millisecondsTime: number,
  sequenceNumber: number
}

function decomposeId(id: string): DecomposedId {
  const splittedId = id.split("-");
  return {
    millisecondsTime: parseInt(splittedId[0]),
    sequenceNumber: parseInt(splittedId[1])
  }
}

function validateId(id: string, lastId: string) {
  const decomposedId = decomposeId(id);
  const decomposedTopId = decomposeId(lastId);

  const timeIsEqualOrSmaller = 
    decomposedId.millisecondsTime <= decomposedTopId.millisecondsTime
  
  const sequenceIsEqualOrSmaller =
    decomposedId.sequenceNumber <= decomposedTopId.sequenceNumber

  const timeIsEqual =
    decomposedId.millisecondsTime == decomposedTopId.millisecondsTime
  
  const errorCondition = timeIsEqual ?
    sequenceIsEqualOrSmaller : timeIsEqualOrSmaller

  if (errorCondition) 
    return "ERR The ID specified in XADD is equal or smaller than the target stream top item"
}

