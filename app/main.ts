import * as net from "net";
import { Resp } from "./packages/Resp"
import { ping } from "./packages/commands/ping";
import { echo } from "./packages/commands/echo";
import { get } from "./packages/commands/get";
import { set } from "./packages/commands/set";
import { rpush } from "./packages/commands/rpush";
import { lrange } from "./packages/commands/lrange";
import { lpush } from "./packages/commands/lpush";
import { llen } from "./packages/commands/llen";
import { lpop } from "./packages/commands/lpop";
import { blpop, blpopListeners } from "./packages/commands/blpop";
import { eventEmitter } from "./packages/persistence/events";

let socketId = 1;

const server = net.createServer((socket: net.Socket & {socketId?: number}) => {

  socket.socketId = socketId
  socketId++;

  socket.on("data", data => {
    const commands = Resp(data.toString());

    commands.forEach(command => {
      const commandName = command[0];

      if (commandName === "PING") 
        return socket.write(ping());

      if (commandName === "ECHO") 
        return socket.write(echo({ value: command[1] }));

      if (commandName === "GET")
        return socket.write(get({ key: command[1] }));

      if (commandName === "SET") {
        console.log("SET", command)
        return socket.write(set({
          key: command[1],
          value: command[2],
          px: command[3],
          expiryTime: command[4]
        }))
      }

      if (commandName === "RPUSH") {
        const [_, key, ...value] = command;
        return socket.write(rpush({ key, value }));
      }

      if (commandName === "LPUSH") {
        const [_, key, ...value] = command;
        return socket.write(lpush({ key, value }));
      }

      if (commandName === "LRANGE") {
        const [_, key, start, end] = command;
        return socket.write(lrange({ key, start, end }))
      }
      
      if (commandName === "LLEN") 
        return socket.write(llen({ key: command[1] }))

      if (commandName === "LPOP") {
        const[_, key, quantity] = command;
        return socket.write(lpop({ key, quantity }));
      }
      
      if (commandName === "BLPOP") {
        const[_, key, timeout] = command;
        blpop({ key, timeout, socketId: socket.socketId!})
        .then(res => socket.write(res));
        return
      } 
    })
  })

  socket.on("close", () => {
    const socketBlpopListener = blpopListeners.get(socket.socketId!);
    if(!socketBlpopListener) return;
    eventEmitter.off("ELEMENT_ADDED", socketBlpopListener);
  })
});


server.listen(6379, "127.0.0.1");


