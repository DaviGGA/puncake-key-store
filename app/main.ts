import * as net from "net";
import { Resp } from "./packages/Resp"

const server = net.createServer((socket: net.Socket) => {

  socket.on("data", data => {
    const parsedCommand = Resp(data.toString());

    if (typeof parsedCommand === "string") {
      if (parsedCommand === "PING") socket.write("+PONG\r\n");
      return;
    }

    parsedCommand.forEach(command => {
      if (command === "PING") socket.write("+PONG\r\n");
    })
  })

});

server.listen(6379, "127.0.0.1");


