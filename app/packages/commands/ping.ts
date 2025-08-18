import { simpleString } from "../Resp/data-types";

export function ping() {
  return simpleString("PONG");
}