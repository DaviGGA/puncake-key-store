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
    return simpleError("The ID specified in XADD must be greater than 0-0")

  const topStream = MemoryStorage.getTopStream(key);

  if(topStream) {
    const error = validateId(id, topStream.id);
    if (error) return simpleError(error);
  }

  const newId = id.includes("*") ?
    generateId(id, topStream?.id)  : id

  let entries: Entries = {};

  for (let i = 0; i < entriesArray.length; i+= 2) {
    entries[entriesArray[i]] = entriesArray[i + 1];
  }

  MemoryStorage.xadd(key, newId, entries);

  return bulkString(newId);
}

function generateId(id: string, topId: string | undefined) {
  const isFully = id === "*";

  if (isFully) return "1-1";

  const millisecondsTime = parseInt(id.split("-")[0]);
  
  if(!topId) return `${millisecondsTime}-0`
  
  const decomposedTopId = decomposeId(topId);

  const sequenceNumber = decomposedTopId.millisecondsTime === millisecondsTime ?
    decomposedTopId.sequenceNumber + 1 : 0 

  return `${millisecondsTime}-${sequenceNumber}`
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
    return "The ID specified in XADD is equal or smaller than the target stream top item"
}

