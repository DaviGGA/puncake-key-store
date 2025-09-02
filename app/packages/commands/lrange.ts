import MemoryStorage from "../persistence";
import { array } from "../common/Resp/data-types";

type Lrange = {
  key: string,
  start: string,
  end: string
}

export function lrange({ key, start, end }: Lrange) {
  return array(
    MemoryStorage.lrange(
      key, 
      parseInt(start), 
      parseInt(end)
    )
  );
}
