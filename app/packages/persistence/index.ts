import type { Entries } from "../commands/xadd";
import { eventEmitter } from "./events";

type StringValue = { value: string, expiryTime: number, type: "string"}
type ListValue = {list: StringValue[], length: number, type: "list"}

type StreamValue = {entries: (Entries &  { id: string })[]} &
  {type: "stream"}

type Values = StringValue | ListValue | StreamValue

const db: Map<string, Values> = new Map();

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

function getType(key: string) {
  const result = db.get(key);
  return result?.type;
}

function rpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if(!result) {
    db.set(key, {
      length: values.length,
      list: values.map(createStringValue),
      type: "list"
    })

    const valuesLength = values.length

    eventEmitter.emit("ELEMENT_ADDED", key);

    return valuesLength;
  }

  values.forEach(value => {
    result.length++;
    result.list.push(createStringValue(value));
  })

  db.set(key, result);

  eventEmitter.emit("ELEMENT_ADDED", key);

  const resultLength = result.length;
  
  return resultLength;
}

function lpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if(!result) {
    db.set(key, {
      length: values.length,
      list: values.reverse().map(createStringValue),
      type: "list"
    })

    const valuesLength = values.length

    eventEmitter.emit("ELEMENT_ADDED", key);

    return valuesLength;
  }

  values.forEach(value => {
    result.length++;
    result.list.unshift(createStringValue(value));
  })

  db.set(key, result);

  const resultLength = result.length;
  
  eventEmitter.emit("ELEMENT_ADDED", key);
  
  return resultLength;
}

function lrange(key: string, start: number, end: number) {
  const result = db.get(key) as ListValue | undefined;

  if (
    !result ||
    start >= result.length ||
    (start > end && end >= 0)
  ) return [];

  const startIndex = getStartIndex(start, result.length)
  const endIndex = getEndIndex(end, result.length);

  return result.list
    .slice(startIndex, endIndex)
    .map(v => v.value);
}

function getStartIndex(start: number, resultLength: number) {
  if (resultLength < Math.abs(start)) return 0;
  return start >= 0 ?
    start : resultLength + start
}

function getEndIndex(end: number, resultLength: number) {
  return end >= 0 ?
    end + 1 : resultLength + end + 1
}

function llen(key: string) {
  const result = db.get(key) as ListValue | undefined;
  return result?.length ?? 0;
}

function lpop(key: string, quantity: number) {
  const result = db.get(key) as ListValue | undefined;

  if (!result || result.length == 0) return [];

  if (quantity >= result.length) {
    const shiftedValues = result.list.slice();
    result.length = 0;
    result.list = [];
    return shiftedValues.map(v => v.value);
  }

  const shiftedValues: StringValue[] = [];

  for (let i = 0; i < quantity; i ++) {
    const shiftedValue = result.list.shift();
    shiftedValues.push(shiftedValue!)
    result.length--;
  }

  return shiftedValues.map(v => v.value);
}

function xadd(key: string, id: string, entries: Entries) {
  const streamValue = db.get(key) as StreamValue | undefined;

  if(!streamValue) {
    db.set(key, {
      type: "stream",
      entries: [{ ...entries, id }]
    })
  }

  streamValue?.entries.push({ ...entries, id })
}


function getTopStream(key: string) {
  const streamValue = db.get(key) as StreamValue | undefined;
  return streamValue ? 
    streamValue.entries[streamValue.entries.length - 1] : null;
}

function flush() {
  db.clear()
}

const createStringValue = (value: string, expiryTime: number = 0): StringValue =>
  ({value, expiryTime: expiryTime && Date.now() + expiryTime, type: "string"})


const MemoryStorage = { 
  set, 
  get, 
  flush, 
  rpush,
  lpush,
  lrange,
  llen,
  lpop,
  xadd,
  getType,
  getTopStream
}

export default MemoryStorage;