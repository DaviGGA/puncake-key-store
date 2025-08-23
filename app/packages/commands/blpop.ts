import MemoryStorage from "../persistence";
import { eventEmitter } from "../persistence/events";
import { array, bulkString } from "../Resp/data-types";

type Blpop = {
  key: string,
  timeout: string,
  socketId: number
}

export const blpopListeners: Map<number, any> = new Map();

export async function blpop({key, timeout, socketId}: Blpop): Promise<string> {
  //const parsedTimeout = parseInt(timeout);

  const lpopResult = MemoryStorage.lpop(key, 1);

  if (lpopResult.length > 0) 
    return getResult(key, lpopResult);

return new Promise(resolve => {
  function onElementAdded(addedKey: string) {
    if (addedKey != key) return;

    const lpopResult = MemoryStorage.lpop(key, 1);
    if (lpopResult.length === 0) return;

    blpopListeners.delete(socketId);
    eventEmitter.off("ELEMENT_ADDED", wrappedFn);
    
    resolve(getResult(key, lpopResult));
  }

  const wrappedFn = (addedKey: string) => onElementAdded(addedKey);

  blpopListeners.set(socketId, wrappedFn);

  eventEmitter.on("ELEMENT_ADDED", wrappedFn);
});

}

function getResult (key:string, result: string[]) {
  return array([key, result[0]])
}

