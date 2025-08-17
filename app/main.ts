import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket: net.Socket) => {

  socket.on("data", data => {
    const parsedCommand = data
      .toString()
      .split("\n")
      .filter(Boolean);

    console.log("PARSED", parsedCommand)

    parsedCommand.forEach(command => {
      if (command === "PING") socket.write("+PONG\r\n");
    })
  })

});

server.listen(6379, "127.0.0.1");


