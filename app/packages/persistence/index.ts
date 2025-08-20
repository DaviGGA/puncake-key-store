type DbTypes = "string" | "list"


type StringValue = { value: string, expiryTime: number, type: DbTypes}
type ListValue = {list: StringValue[], length: number}

type Values = StringValue | ListValue

const db: Map<string, Values> = new Map();

function set(key: string, value: string, expiryTime: number) {
  db.set(key, {
    value, 
    expiryTime: expiryTime && Date.now() + expiryTime, 
    type: "string"})
}

function get(key: string) {
  const result = db.get(key) as StringValue | undefined;

  if(!result) return undefined;
  if(result.expiryTime == 0) return result.value;

  return result.expiryTime >= Date.now() ?
    result.value : undefined
}

function rpush(key: string, value: string) {
  const result = db.get(key) as ListValue | undefined;

  if(!result) {
    db.set(key, {
      length: 1,
      list: [{ value, expiryTime: 0, type: "string" }],
      type: "list"
    })

    return 1;
  }

  result.length++;
  result.list.push({ value, expiryTime: 0, type: "string" });

  db.set(key, result);
  return result.length;
}

function flush() {
  db.clear()
}

const MemoryStorage = { set, get, flush, rpush }

export default MemoryStorage;