export function Resp(command: string) {
  
  switch(command.charAt(0)) {
    case "*":
      return ArrayResp(command)
    default:
      return command;
  }
}

//*1\r\n$4\r\nPING\r\n
function ArrayResp(command: string) {
  const arraySize = getArraySize(command);

  const commands: string[] = new Array(arraySize);

  let foo = getStringSizeAndPos(command);
  
  for (let i = 0; i < arraySize; i++) {
    const { size, pos } = foo;
    const commandString = command.slice(pos, pos + size);
    commands[i] = commandString;
    foo = getStringSizeAndPos(command, pos);
  }

  return commands;
}

function getArraySize(command: string) {
  const asteriskPos = command.indexOf("*");
  const carriagePos = command.indexOf("\r\n");
  return parseInt(command.slice(asteriskPos + 1, carriagePos))
}

function getStringSizeAndPos(command: string, startPos: number = 0) {
  const dollarSignPos = command.indexOf("$", startPos);
  const carriagePos = command.indexOf("\r\n", dollarSignPos);
  return {
    size: parseInt(command.slice(dollarSignPos + 1, carriagePos)),
    pos: carriagePos + 2
  }
}



