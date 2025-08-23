import { describe, test, expect} from "bun:test";
import { Resp } from "../packages/Resp";

describe("RESP", () => {
  
  test("PING should return [\"PING\"]", () => {
    expect(Resp("*1\r\n$4\r\nPING\r\n")[0]).toEqual(["PING"]);
  })

  test("ECHO hello shoul return [\"ECHO\", \"hello\"]", () => {
    expect(Resp("*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n")[0]).toEqual(["ECHO", "hello"])
  })

  test("GET foo should return [\"GET\", \"foo\"]", () => {
    expect(Resp("*2\r\n$3\r\nGET\r\n$3\r\nfoo\r\n")[0]).toEqual(["GET", "foo"]);
  });

  test("SET foo bar should return [\"SET\", \"foo\", \"bar\"]", () => {
    expect(Resp("*3\r\n$3\r\nSET\r\n$3\r\nfoo\r\n$3\r\nbar\r\n")[0]).toEqual(["SET", "foo", "bar"]);
  });

  test('SET foo bar PX 100 should return ["SET", "foo", "bar", "PX", "100"]', () => {
    expect(Resp("*5\r\n$3\r\nSET\r\n$3\r\nfoo\r\n$3\r\nbar\r\n$2\r\nPX\r\n$3\r\n100\r\n")[0]).toEqual([
      "SET",
      "foo",
      "bar",
      "PX",
      "100",
    ]);
  })

  test('LRANGE foo 0 2 should return ["LRANGE", "foo", "0", "2"]', () => {
    expect(Resp("*4\r\n$6\r\nLRANGE\r\n$3\r\nfoo\r\n$1\r\n0\r\n$1\r\n2\r\n")[0]).toEqual([
      "LRANGE",
      "foo",
      "0",
      "2"
    ]);
  });

  test('3 PINGS in the same tcp should return [["PING", "PING"]]', () => {
    expect(Resp("*1\r\n$4\r\nPING\r\n*1\r\n$4\r\nPING\r\n*1\r\n$4\r\nPING\r\n")).toEqual([
      ["PING"], ["PING"], ["PING"]
    ])
  })


});

