// @flow
import React, { Component } from 'react'
import Form from './Form'
import TrendsTable from './TrendsTable'
import type { Data, Trend } from '../types'

type Props = {}

type State = {
  hasData: bool,
  trends: Array<Trend>,
  keyword: Array<string>
}

class App extends Component<Props, State> {
  state = { hasData: false, trends: [], keyword: [] }

  handleData = (data: Data) => {
    const { trends, keyword } = data
    this.setState({ trends, keyword, hasData: true })
  }

  render () {
    const { trends, keyword, hasData } = this.state

    return (
      <div id="outer-div">
        <Form handleData={this.handleData} />

        {hasData && (
          <div className="container" id="data-div">
            <div className="row text-center" id="nav-div">
              <p>Nav Stuff</p>
            </div>
            <main>
              <div id="weights-div">
                <p>Weights Table</p>
              </div>
              <TrendsTable trends={trends} keyword={keyword} />
            </main>
          </div>
        )}
      </div>
    )
  }
}

export default App
