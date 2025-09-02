export type StringValue = { value: string, expiryTime: number, type: "string"}
export type ListValue = {list: StringValue[], length: number, type: "list"}

export type id = string
export type Entries = string[]
export type Stream = [id, string[]]
export type StreamValue = {entries: Stream[]} &
  {type: "stream"}

export type Values = StringValue | ListValue | StreamValue