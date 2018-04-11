export type Trend = {
  formattedTime: string,
  value: Array<number>,
}

export type Data = {
  trends: Array<Trend>,
  keyword: Array<string>,
}
