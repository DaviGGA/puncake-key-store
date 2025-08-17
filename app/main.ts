import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket: net.Socket) => {
  socket.on("data", data => {
    const command = data.toString();

    if (command === "PING") {
      socket.write("+PONG\r\n");
      return;
    }

    socket.write("Oops!");

  })

});

server.listen(6379, "127.0.0.1");

const client = net.connect({port: 6379}, () => {
  const command = prompt("");
  client.write(command!);
})

client.on("data", data => {
  console.log(data.toString("utf-8"));
})

