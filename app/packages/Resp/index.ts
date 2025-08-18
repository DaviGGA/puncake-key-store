// function Resp(command: string) {
//   const commands: string[] = [];

//   const splittedCommands = command.split("\r\n");

//   splittedCommands.forEach(splittedComand => {

//   })

// }

// function commandType(value: string) {
//   switch (value.at(0)) {
//     case "*":
//       const arraySize = parseInt(value.slice(1));
//   }
// }

// //*1\r\n$4\r\nPING\r\n
// // *2\r\n*2\r\n:1\r\n:2\r\n+OK\r\n
// function ArrayResp(vales: string[]) {

// }

// function getArraySize(command: string) {
//   const asteriskPos = command.indexOf("*");
//   const carriagePos = command.indexOf("\r\n");
//   return parseInt(command.slice(asteriskPos + 1, carriagePos))
// }

// function getStringSizeAndPos(command: string, startPos: number = 0) {
//   const dollarSignPos = command.indexOf("$", startPos);
//   const carriagePos = command.indexOf("\r\n", dollarSignPos);
//   return {
//     size: parseInt(command.slice(dollarSignPos + 1, carriagePos)),
//     pos: carriagePos + 2
//   }
// }

// //console.log(ArrayResp("*1\r\n$4\r\nPING\r\n"))
// ArrayResp("*2\r\n$3\r\nSET\r\n$5\r\nmykey\r\n");
// console.log("*2\r\n*2\r\n:1\r\n:2\r\n+OK\r\n".split("\r\n"));
// function bulkString(command: string) {

// }


