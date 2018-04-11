// @flow
import React, { Fragment } from 'react'
import type { Node } from 'react'

type Props = {
  keyword: string,
  percents: Array<string>
}

function WeightRow ({ keyword, percents }: Props): Node {
  return (
    <Fragment>
      <tr>
        <th>{keyword}</th>
        {/* eslint-disable react/no-array-index-key */}
        {percents.map((percent, idx) => (<td key={idx}>{percent}%</td>))}
        {/* eslint-enable react/no-array-index-key */}
      </tr>
    </Fragment>
  )
}

export default WeightRow
