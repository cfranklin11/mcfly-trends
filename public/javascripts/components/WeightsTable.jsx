// @flow
import React from 'react'
import type { Node } from 'react'
import classNames from 'classnames'
import WeightRow from './WeightRow'

type ToggleColumn = (number) => () => void
type Props = {
  keyword: Array<string>,
  weightsMatrix: Array<Array<number>>,
  totalWeight: number,
  displayPercent: (Array<number>, number) => Array<string>,
  toggleColumn: ToggleColumn,
  resetWeights: () => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec']

function monthColumn (
  weightsMatrix: Array<Array<number>>,
  toggleColumn: ToggleColumn,
): (string, number) => Node {
  return (month: string, idx: number): Node => {
    const isActiveMonth = weightsMatrix.map(row => row[idx])
      .reduce((sum, item) => sum + item, 0) > 0
    const cellClasses = classNames(
      { activeMonth: isActiveMonth, inactiveMonth: !isActiveMonth },
    )
    const buttonClasses = classNames(
      'btn',
      'toggleButton',
      { 'btn-success': isActiveMonth, 'btn-danger': !isActiveMonth },
    )
    const spanClasses = classNames(
      'glyphicon',
      { 'glyphicon-ok-sign': isActiveMonth, 'glyphicon-remove-sign': !isActiveMonth },
    )
    return (
      <th className={cellClasses} key={month}>
        <button className={buttonClasses} onClick={toggleColumn(idx)}>
          {month}
          <span className={spanClasses} aria-hidden="true" />
        </button>
      </th>
    )
  }
}

function monthsRow (weightsMatrix: Array<Array<number>>, toggleColumn: ToggleColumn) {
  return (<tr>
    <th>Search Term</th>
    {MONTHS.map(monthColumn(weightsMatrix, toggleColumn))}
    <th>Weight by Term</th>
  </tr>)
}

export default function WeightsTable (
  { keyword, weightsMatrix, totalWeight, displayPercent, toggleColumn, resetWeights }: Props,
): Node {
  return (
    <div className="WeightsTable">
      <table className="table table-bordered table-condensed weightsTable">
        <thead>
          <tr>
            <th colSpan="14" className="text-center">
              <h4 className="weightsTitle">Search Volume Weights by Search Term & Month</h4>
              <button className="btn btn-default btn-md resetButton" onClick={resetWeights}>Reset Months</button>
              <h5 className="weightsHeader">(Click on months to remove/add them)</h5>
            </th>
          </tr>
        </thead>
        <tbody>
          {monthsRow(weightsMatrix, toggleColumn)}

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
    </div>
  )
}
