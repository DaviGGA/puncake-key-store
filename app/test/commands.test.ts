import { describe, test, expect, beforeEach} from "bun:test";
import { ping } from "../packages/commands/ping";
import { array, bulkString, integer, simpleString } from "../packages/Resp/data-types";
import { set } from "../packages/commands/set";
import { get } from "../packages/commands/get";
import MemoryStorage from "../packages/persistence";
import { echo } from "../packages/commands/echo";
import { rpush } from "../packages/commands/rpush";
import { lrange } from "../packages/commands/lrange";

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
    const echoResult = echo("foo");
    expect(echoResult).toBe(bulkString("foo"))
  })
})

describe("RPUSH LRANGE", () => {

  test("Given RPUSH foo a b should return 2", () => {
    expect(rpush("foo", ["a", "b"])).toBe(integer(2));
  })

  test("Given RPUSH foo a b, and then RPUSH foo c should return 3", () => {
    rpush("foo", ["a", "b"]);
    expect(rpush("foo", ["c"])).toBe(integer(3));
  })

  test('Given RPUSH foo a b c d e, when LRANGE 2 4, should return ["c", "d", "e"]', () => {
    rpush("foo", ["a","b", "c", "d", "e"]);
    expect(lrange("foo", 2 ,4)).toBe(array(["c", "d", "e"]));
  })

  test("Given LRANGE foo 5 7, when start index is greater than or equal to the list's length, return []", () => {
     rpush("foo", ["a","b"]);
    expect(lrange("foo", 5, 7)).toBe(array([]))
  })

  test("Given LRANGE foo 0 7, when start index is greater than or equal to the list's length, return []", () => {
    rpush("foo", ["a","b"]);
    expect(lrange("foo", 0, 7)).toBe(array(["a","b"]))
  })

  test("Given LRANGE foo 5 2, when start index is greater than the stop index, return []", () => {
    rpush("foo", ["a","b"]);
    expect(lrange("foo", 5, 2)).toBe(array([]))
  })

  test('Given RPUSH foo a b c d e, when LRANGE foo -2 -1, should return ["d", "e"]', () => { 
    rpush("foo", ["a","b", "c", "d", "e"]);
    expect(lrange("foo", -2, -1)).toBe(array(["d", "e"]));
  });

  test('Given RPUSH foo a b c d e, when LRANGE foo 0 -3, should return ["a", "b", "c"]', () => { 
    rpush("foo", ["a","b", "c", "d", "e"]);
    expect(lrange("foo", 0, -3)).toBe(array(["a", "b", "c"]));
  });

  test('Given RPUSH foo a b c d e, when LRANGE foo -3 -2, should return ["c", "d"]', () => { 
    rpush("foo", ["a","b", "c", "d", "e"]);
    expect(lrange("foo", -3, -2)).toBe(array(["c", "d"]));
  });
})