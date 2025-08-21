type DbTypes = "string" | "list"


type StringValue = { value: string, expiryTime: number, type: DbTypes}
type ListValue = {list: StringValue[], length: number}

type Values = StringValue | ListValue

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

function rpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if(!result) {
    db.set(key, {
      length: values.length,
      list: values.map(createStringValue),
      type: "list"
    })

    return values.length;
  }

  values.forEach(value => {
    result.length++;
    result.list.push(createStringValue(value));
  })

  db.set(key, result);
  return result.length;
}

function lrange(key: string, start: number, end: number) {
  const result = db.get(key) as ListValue | undefined;

  if (
    !result ||
    start >= result.length ||
    (start > end && end >= 0)
  ) return [];

  const startIndex = getStartIndex(start, result.length)
  const endIndex = end >= 0 ?
    end + 1 : result.length + end + 1

  return result.list
    .slice(startIndex, endIndex)
    .map(v => v.value);
}

function getStartIndex(start: number, resultLength: number) {
  if (resultLength < Math.abs(start)) return 0;
  return start >= 0 ?
    start : resultLength + start
}

function flush() {
  db.clear()
}

const createStringValue = (value: string, expiryTime: number = 0): StringValue =>
  ({value, expiryTime: expiryTime && Date.now() + expiryTime, type: "string"})

const MemoryStorage = { set, get, flush, rpush, lrange }

export default MemoryStorage;