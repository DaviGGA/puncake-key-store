import { describe, test, expect, beforeEach} from "bun:test";
import { array, bulkString, integer, simpleString } from "../packages/common/Resp/data-types";
import MemoryStorage from "../packages/persistence";
import { rpush } from "../packages/commands/rpush";
import { lrange } from "../packages/commands/lrange";
import Base from "../packages/base";
import { db } from "../packages/common/storage";

beforeEach(() => {
  MemoryStorage.flush()
  db.clear();
})

describe("PING", () => {

  test("Ping command", () => {
    const result = Base.ping();
    expect(result).toBe(simpleString("PONG"))
  })


})

describe("SET", () => {
  test("Given a SET foo bar, when GET foo should return bar", () => {
    expect(Base.set({ key: "foo", value: "bar", px: undefined, expiryTime: "0" })).toBe(simpleString("OK"));
    expect(Base.get({ key: "foo" })).toBe(bulkString("bar"));
  });

  test("Given a SET foo px 5, when getting foo after 10ms should return nil", async () => {
    expect(Base.set({ key: "foo", value: "bar", px: "5", expiryTime: "5" })).toBe(simpleString("OK"));

    await new Promise(r => setTimeout(r, 10));

    expect(Base.get({ key: "foo" })).toBe(bulkString(""));
  });
});

describe("GET", () => {
  test("Given a GET foo, when foo does not exist should return nil", () => {
    expect(Base.get({ key: "foo" })).toBe(bulkString(""));
  });
});

describe("ECHO", () => {
  test("Given a ECHO foo, should return foo", () => {
    expect(Base.echo({ value: "foo" })).toBe(bulkString("foo"));
  });
});

describe("RPUSH LRANGE", () => {
  test("Given RPUSH foo a b should return 2", () => {
    expect(rpush({ key: "foo", value: ["a", "b"] })).toBe(integer(2));
  });

  test("Given RPUSH foo a b, and then RPUSH foo c should return 3", () => {
    rpush({ key: "foo", value: ["a", "b"] });
    expect(rpush({ key: "foo", value: ["c"] })).toBe(integer(3));
  });

  test('Given RPUSH foo a b c d e, when LRANGE 2 4, should return ["c", "d", "e"]', () => {
    rpush({ key: "foo", value: ["a","b","c","d","e"] });
    expect(lrange({ key: "foo", start: "2", end: "4" })).toBe(array(["c", "d", "e"]));
  });

  test("Given LRANGE foo 5 7, when start index >= list length, return []", () => {
    rpush({ key: "foo", value: ["a","b"] });
    expect(lrange({ key: "foo", start: "5", end: "7" })).toBe(array([]));
  });

  test('Given RPUSH foo a b c d e, when LRANGE foo -2 -1, should return ["d", "e"]', () => {
    rpush({ key: "foo", value: ["a","b","c","d","e"] });
    expect(lrange({ key: "foo", start: "-2", end: "-1" })).toBe(array(["d", "e"]));
  });

  test('Given RPUSH foo a b c d e, when LRANGE foo 0 -3, should return ["a", "b", "c"]', () => {
    rpush({ key: "foo", value: ["a","b","c","d","e"] });
    expect(lrange({ key: "foo", start: "0", end: "-3" })).toBe(array(["a", "b", "c"]));
  });

  test('Given RPUSH foo a b c d e, when LRANGE foo -3 -2, should return ["c", "d"]', () => {
    rpush({ key: "foo", value: ["a","b","c","d","e"] });
    expect(lrange({ key: "foo", start: "-3", end: "-2" })).toBe(array(["c", "d"]));
  });
})