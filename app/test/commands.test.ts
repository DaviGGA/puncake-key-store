import { describe, test, expect, beforeEach} from "bun:test";
import { ping } from "../packages/commands/ping";
import { bulkString, simpleString } from "../packages/Resp/data-types";
import { set } from "../packages/commands/set";
import { get } from "../packages/commands/get";
import MemoryStorage from "../packages/persistence";
import { echo } from "../packages/commands/echo";

beforeEach(() => MemoryStorage.flush())

describe("PING", () => {

  test("Ping command", () => {
    const result = ping();
    expect(result).toBe(simpleString("PONG"))
  })


})

describe("SET", () => {

  test("Given a SET foo bar,when GET foo should return bar", () => {
    const setResult = set("foo", "bar", 0);
    expect(setResult).toBe(simpleString("OK"));
    const getResult = get("foo");
    expect(getResult).toBe(bulkString("bar"));
  })

  test("Given a SET foo px 1000, when getting foo should return bar", () => {
    const setResult = set("foo", "bar", 0);
    expect(setResult).toBe(simpleString("OK"));
    const getResult = get("foo");
    expect(getResult).toBe(bulkString("bar"));
  })

  test("Given a SET foo px 500, when getting foo after 1000ms should return nil", async () => {
    const setResult = set("foo", "bar", 5);
    expect(setResult).toBe(simpleString("OK"));
    
    await new Promise(r => setTimeout(r, 10));
    
    const getResult = get("foo");
    expect(getResult).toBe(bulkString(""));
  })


})

describe("GET", () => {

  test("Given a GET foo, when foo does not exist should return nil", () => {
    const getResult = get("foo");
    expect(getResult).toBe(bulkString(""))
  })
})

describe("ECHO", () => {

  test("Given a ECHO foo, should return foo", () => {
    const fooResult = echo("foo");
    expect(fooResult).toBe(bulkString("foo"))
  })
})