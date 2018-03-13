// @flow
import React, { Component } from 'react'
import { StickyContainer } from 'react-sticky'
import Form from './Form'
import TrendsTable from './TrendsTable'
import WeightsTable from './WeightsTable'
import Nav from './Nav'

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

    if (!this.navRef) {
      return
    }

    this.navRef.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
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
    if (!this.formRef) {
      return
    }

    this.formRef.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  displayPercent = (row: Array<number>, totalWeight: number) => {
    return row.map(weight => ((weight / totalWeight) * 100).toFixed(2))
  }

  transformTrendRow = (trend: Trend) => {
    const monthYear = trend.formattedTime.split(' ')
    return [monthYear[1], monthYear[0]].concat(trend.value)
  }

  downloadCsv = () => {
    const { currentWeightsMatrix, trends, keyword } = this.state
    const weightsTable = [['Search Volume Weights by Search Term & Month\n']]
      .concat(currentWeightsMatrix.map((row, idx) => {
        const term = keyword[idx] || 'Monthly Weight'
        return [term].concat(row)
      }))
    const trendsTable = [['\n\nRaw Google Trends Data']]
      .concat(trends.map((trend) => {
        return this.transformTrendRow(trend)
      }))
    const csvContent = 'data:text/csvcharset=utf-8,'
      .concat(weightsTable.map((row) => {
        return row.join(',')
      }).join('\n'))
      .concat(trendsTable.map((row) => {
        return row.join(',')
      }).join('\n'))

    // Use CSV string to create CSV file, then download it
    const encodedUri = encodeURI(csvContent)
    const linkTag = document.createElement('a')
    linkTag.setAttribute('href', encodedUri)
    linkTag.setAttribute('download', 'monthly-data.csv')

    linkTag.click()
  }

  render () {
    const { trends, keyword, hasData, currentWeightsMatrix, currentTotalWeight } = this.state

    return (
      <div id="outer-div" ref={(el) => { this.formRef = el }}>
        <Form handleData={this.handleData} />

        {hasData && (
          <div className="container" id="data-div">
            <StickyContainer>
              <div className="row text-center" id="nav-div" ref={(el) => { this.navRef = el }}>
                <Nav
                  keyword={keyword}
                  scrollFunc={this.scrollToTop}
                  downloadCsv={this.downloadCsv}
                />
              </div>
              <main className="row">
                <WeightsTable
                  keyword={keyword}
                  weightsMatrix={currentWeightsMatrix}
                  totalWeight={currentTotalWeight}
                  displayPercent={this.displayPercent}
                />
                <TrendsTable trends={trends} keyword={keyword} />
              </main>
            </StickyContainer>
          </div>
        )}
      </div>
    )
  }
}

export default App
