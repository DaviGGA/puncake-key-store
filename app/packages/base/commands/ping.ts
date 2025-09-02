import { simpleString } from "../../common/Resp/data-types";

export function ping() {
  return simpleString("PONG");
}