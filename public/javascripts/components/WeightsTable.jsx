// @flow
import React from 'react'
import WeightRow from './WeightRow'

type Props = {
  keyword: Array<string>,
  weightsMatrix: Array<Array<number>>,
  totalWeight: number,
  displayPercent: (Array<number>, number) => number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec']

export default function WeightsTable (
  { keyword, weightsMatrix, totalWeight, displayPercent }: Props,
) {
  return (
    <table id="table1" className="table table-bordered table-condensed">
      <thead>
        <tr>
          <th colSpan="14" className="text-center">
            <h4>Search Volume Weights by Search Term & Month</h4>
            <button id="reset" className="btn btn-default btn-md">Reset Months</button>
            <h5>(Click on months to remove/add them)</h5>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Search Term</th>
          {MONTHS.map((month) => {
            return (
              <th key={month}>
                {month}
                <span className="glyphicon glyphicon-ok-sign" aria-hidden="true" />
              </th>
            )
          })}
          <th className="included">Weight by Term</th>
        </tr>

        {weightsMatrix.map((row, idx) => {
          const kw = keyword[idx] || 'Monthly Weight'

          return (
            <WeightRow
              key={kw}
              keyword={kw}
              percents={displayPercent(row, totalWeight)}
            />
          )
        })}
      </tbody>
    </table>
  )
}
