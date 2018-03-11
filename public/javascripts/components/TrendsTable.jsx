// @flow
import React from 'react'
import type { Trend } from '../types'
import TrendRow from './TrendRow'

type Props = {
  keyword: Array<string>,
  trends: Array<Trend>,
}

function TrendsTable ({ keyword, trends }: Props) {
  if (trends.length === 0) {
    return null
  }

  return (
    <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
      <table id="table2" className="table table-bordered table-condensed">
        <thead>
          <tr>
            <th className="text-center" colSpan={keyword.length + 2}>
              <h4>Raw Google Trends Data</h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Year</th>
            <th>Month</th>
            {keyword.map(kw => (<th key={kw}>{kw}</th>))}
          </tr>

          {trends.map((trend) => {
            return (<TrendRow key={trend.formattedTime} trend={trend} />)
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrendsTable
