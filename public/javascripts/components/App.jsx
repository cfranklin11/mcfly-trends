// @flow
import React, { Component } from 'react'
import Form from './Form'
import TrendsTable from './TrendsTable'
import WeightsTable from './WeightsTable'

import type { Data, Trend } from '../types'

type Props = {}

type State = {
  hasData: bool,
  trends: Array<Trend>,
  keyword: Array<string>,
  weightsMatrix: Array<Array<number>>,
  currentWeightsMatrix: Array<Array<number>>,
  currentTotalWeight: number
}

const MONTH_REGEXES = [/Jan/, /Feb/, /Mar/, /Apr/, /May/, /Jun/, /Jul/, /Aug/,
  /Sep/, /Oct/, /Nov/, /Dec/]

class App extends Component<Props, State> {
  state = { hasData: false, trends: [], keyword: [], weightsMatrix: [] }

  handleData = (data: Data) => {
    const { trends, keyword } = data
    const weightsMatrix = this.calculateWeights(this.calculateKeywordWeights(keyword, trends))
    const currentTotalWeight = weightsMatrix[weightsMatrix.length - 1].slice(-1)[0]

    this.setState({
      trends,
      keyword,
      weightsMatrix,
      currentTotalWeight,
      currentWeightsMatrix: weightsMatrix,
      hasData: true,
    })
  }

  calculateKeywordWeights = (keyword: Array<string>, trends: Array<Trend>) => {
    return keyword.map((_kw, idx) => {
      return MONTH_REGEXES.map((monthRegex) => {
        return trends
          .filter(trend => monthRegex.test(trend.formattedTime))
          // Getting trend weight that corresponds with this keyword and summing
          .reduce((keywordMonthWeight, trend) => keywordMonthWeight + trend.value[idx], 0)
      })
    })
  }

  calculateWeights = (keywordWeights: Array<Array<number>>) => {
    return keywordWeights
      // Concat extra row with total weight per month
      .concat([MONTH_REGEXES.map((_monthRegex, idx) => {
        return keywordWeights.reduce((monthlySum, monthlyWeights) => {
          return monthlySum + monthlyWeights[idx]
        }, 0)
      })])
      .map((monthlyWeights) => {
        // Concat extra column with total weight per keyword
        return monthlyWeights.concat(monthlyWeights.reduce((weightSum, weight) => {
          return weightSum + weight
        }, 0))
      })
  }

  scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  displayPercent = (row: Array<number>, totalWeight: number) => {
    return row.map(weight => ((weight / totalWeight) * 100).toFixed(2))
  }

  downloadCsv = () => {

  }

  render () {
    const { trends, keyword, hasData, currentWeightsMatrix, currentTotalWeight } = this.state

    return (
      <div id="outer-div">
        <Form handleData={this.handleData} />

        {hasData && (
          <div className="container" id="data-div">
            <div className="row text-center" id="nav-div">
              <p>Nav Stuff</p>
            </div>
            <main>
              <WeightsTable
                keyword={keyword}
                weightsMatrix={currentWeightsMatrix}
                totalWeight={currentTotalWeight}
                displayPercent={this.displayPercent}
              />
              <TrendsTable trends={trends} keyword={keyword} />
            </main>
          </div>
        )}
      </div>
    )
  }
}

export default App
