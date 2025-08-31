import MemoryStorage from "../persistence"
import { array } from "../Resp/data-types";
import { decomposeId } from "./xadd";

type XRange = {
  key: string,
  start: string,
  end: string
}

export function xRange({ key, start, end}: XRange) {
  const streams = MemoryStorage.getStreams(key);

  if(!streams) return "";

  const startIndex = streams.entries
    .findIndex(s => idIsGreaterOrEqual(s[0], start))
  const endIndex = streams.entries
    .findIndex(s => idIsGreaterOrEqual(s[0], end))

  return array(
    streams.entries.slice(
    startIndex, 
    endIndex !== 1 ? endIndex + 1 : streams.entries.length
  ) as string[][])
}

const idIsGreaterOrEqual = (firstId: string, secondId: string) =>
  compareIds(firstId, secondId) >= 0;

const idIsLessOrEqual = (firstId: string, secondId: string) =>
  compareIds(firstId, secondId) <= 0;



function compareIds(firstId: string, secondId: string) {
  const first = decomposeId(firstId)
  const second = decomposeId(secondId);

  if (first.millisecondsTime < second.millisecondsTime) return -1;
  if (first.millisecondsTime > second.millisecondsTime) return 1;

  if (first.sequenceNumber < second.sequenceNumber) return -1;
  if (first.sequenceNumber > second.sequenceNumber) return 1;

  return 0;
}

