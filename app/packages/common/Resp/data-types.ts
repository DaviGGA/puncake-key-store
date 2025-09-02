export function bulkString(value: string) {
  return value.length !== 0 ?
    `$${value.length}\r\n${value}\r\n` :
    "$-1\r\n"
}

export function simpleString(value: string) {
  return `+${value}\r\n`
}

export function integer(value: string | number) {
  return `:${value}\r\n`
}

export function array(values: (string | string[])[]): string {
  return `*${values.length}\r\n${values.map(toBulkOrArray).join("")}`
}

export function nullArray() {
  return "*-1\r\n"
}

function toBulkOrArray(value: string | string[]) {
  return typeof value === "string" ?
    bulkString(value) : array(value)
}

export function simpleError(message: string) {
  return `-ERR ${message}\r\n`
}