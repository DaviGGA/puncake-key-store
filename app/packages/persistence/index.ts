type DbValue = { value: string, expiryTime: number}

const db: Map<string, DbValue> = new Map();

function set(key: string, value: string, expiryTime: number) {
  db.set(key, {value, expiryTime: expiryTime && Date.now() + expiryTime})
}

function get(key: string) {
  const result = db.get(key);

  if(!result) return undefined;
  if(result.expiryTime == 0) return result.value;

  return result.expiryTime >= Date.now() ?
    result.value : undefined
}

const MemoryStorage = { set, get }

export default MemoryStorage;