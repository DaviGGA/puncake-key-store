import MemoryStorage from "../persistence";
import { eventEmitter } from "../persistence/events";
import { array, bulkString } from "../Resp/data-types";

type Blpop = {
  key: string,
  timeout: string,
  socketId: number
}

type Seconds = number;
const toMiliseconds = (s: Seconds) => s * 1000;

export const blpopListeners: Map<number, any> = new Map();

export async function blpop({key, timeout, socketId}: Blpop): Promise<string> {
  const parsedTimeout = toMiliseconds(parseInt(timeout));

  console.log("TIMEOUT", parsedTimeout);

  const lpopResult = MemoryStorage.lpop(key, 1);

  if (lpopResult.length > 0) 
    return getResult(key, lpopResult);

  const resultPromise: Promise<string> = new Promise(resolve => {
    function onElementAdded(addedKey: string) {
      console.log("chamando")
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

  const timeoutPromise: Promise<string> = new Promise(resolve => {
    setTimeout(() => {
      const listener = blpopListeners.get(socketId);
      if(!listener) return;
      blpopListeners.delete(socketId);
      eventEmitter.off("ELEMENT_ADDED", listener); 
      resolve(bulkString(""))
    }, parsedTimeout)
  })

return Promise.race([resultPromise, timeoutPromise])

}

function getResult (key:string, result: string[]) {
  return array([key, result[0]])
}

