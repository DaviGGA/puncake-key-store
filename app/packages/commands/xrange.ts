import MemoryStorage, { type Stream, type StreamValue } from "../persistence"
import { array, nullArray } from "../Resp/data-types";
import { decomposeId } from "./xadd";

type XRange = {
  key: string,
  start: string,
  end: string
}

export function xRange({ key, start, end}: XRange) {
  const streams = MemoryStorage.getStreams(key);

  if(!streams) return nullArray();

  if(streams.entries.length === 0) return nullArray();

  const startIndex = getStartIndex(streams, start);
  const endIndex = getFinishIndex(streams, end);

  const rangeEntries = streams.entries.slice(
    startIndex, 
    endIndex
  ) as string[][]

  return rangeEntries.length > 0 ? 
    array(rangeEntries) : nullArray()
}

function getStartIndex(streams: StreamValue, start: string) {
  return start !== "-" ? 
  streams.entries.findIndex(s => idIsGreaterOrEqual(s[0], start)) : 0
}

function getFinishIndex(streams: StreamValue, end: string) {
  const index = end !== "+" ? 
  streams.entries.findIndex(s => idIsGreaterOrEqual(s[0], end)) : 
  streams.entries.length
  return index !== -1 ? index + 1 : streams.entries.length
}

const idIsGreaterOrEqual = (firstId: string, secondId: string) =>
  compareIds(firstId, secondId) >= 0;

function compareIds(firstId: string, secondId: string) {
  const first = decomposeId(firstId)
  const second = decomposeId(secondId);

  if (first.millisecondsTime < second.millisecondsTime) return -1;
  if (first.millisecondsTime > second.millisecondsTime) return 1;

  if (first.sequenceNumber < second.sequenceNumber) return -1;
  if (first.sequenceNumber > second.sequenceNumber) return 1;

  return 0;
}

