import * as net from "net";
import { Resp } from "./packages/Resp"
import { ping } from "./packages/commands/ping";
import { echo } from "./packages/commands/echo";

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


    }

  })

});

server.listen(6379, "127.0.0.1");


