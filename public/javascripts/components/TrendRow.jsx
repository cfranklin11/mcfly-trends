// @flow
import React from 'react'
import type { Node } from 'react'

import type { Trend } from '../types'

type Props = {
  trend: Trend
}

function TrendRow ({ trend }: Props): Node {
  const { formattedTime } = trend
  const monthYear = formattedTime.split(' ')
  return (
    <tr key={formattedTime}>
      <td>{monthYear[1]}</td>
      <td>{monthYear[0]}</td>
      {/* eslint-disable react/no-array-index-key */}
      {trend.value.map((value, idx) => (<td key={idx}>{value}</td>))}
      {/* eslint-enable react/no-array-index-key */}
    </tr>
  )
}

export default TrendRow
