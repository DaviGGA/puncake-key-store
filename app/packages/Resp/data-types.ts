export function bulkString(value: string) {
  return value.length !== 0 ?
    `$${value.length}\r\n${value}\r\n` :
    "$-1\r\n"
}

export function simpleString(value: string) {
  return `+${value}\r\n`
}