import { echo } from "./commands/echo";
import { get } from "./commands/get";
import { set } from "./commands/set";
import { ping } from "./commands/ping";

const Base = {
  echo,
  get,
  set,
  ping
}

export default Base;