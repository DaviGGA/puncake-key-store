import * as net from "net";
import { Resp } from "./packages/Resp"
import { ping } from "./packages/commands/ping";
import { echo } from "./packages/commands/echo";
import { get } from "./packages/commands/get";
import { set } from "./packages/commands/set";
import { rpush } from "./packages/commands/rpush";
import { lrange } from "./packages/commands/lrange";
import { lpush } from "./packages/commands/lpush";

const server = net.createServer((socket: net.Socket) => {

  socket.on("data", data => {
    const parsedInput = Resp(data.toString());

    for (let i = 0; i < parsedInput.length; i++) {
      const input = parsedInput[i];

      if (input === "PING") {
        socket.write(ping());
        continue 
      }

      if(input === "ECHO") {
        const echoValue = parsedInput[i + 1];
        socket.write(echo(echoValue));
        i++;
        continue;
      }

      if (input === "GET") {
        const key = parsedInput[i + 1];
        const value = get(key);
        socket.write(value);
        i++;
        continue; 
      }

      if (input === "SET") {
        const key = parsedInput[i + 1];
        const value = parsedInput[i + 2];
        const hasPX = parsedInput[i + 3] === "px";
        const expiryTime = hasPX ? 
          parseInt(parsedInput[i + 4]) : 0;

        const setResult = set(key, value, expiryTime);
        socket.write(setResult);
        
        i += hasPX ? 3 : 1

        continue; 
      }

      if (input === "RPUSH") {
        const key = parsedInput[i + 1];
        const value = parsedInput.slice(i + 2);
        socket.write(rpush(key, value));
        i += 2;
      }

      if (input === "LPUSH") {
        const key = parsedInput[i + 1];
        const value = parsedInput.slice(i + 2);
        socket.write(lpush(key, value));
        i += 2;
      }

      if (input === "LRANGE") {
        const key = parsedInput[i + 1];
        const start = parseInt(parsedInput[i + 2]);
        const end = parseInt(parsedInput[i + 3]);
        socket.write(lrange(key, start, end));
        i += 3;
      }




    }

  })

});


server.listen(6379, "127.0.0.1");


