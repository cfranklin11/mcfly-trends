/* eslint-disable no-console */
// @flow
import React, { Component } from 'react'
import Form from './Form'
import type { Data } from '../types'

type Props = {}

type State = {
  hasData: bool,
}

class App extends Component<Props, State> {
  state = { hasData: false }

  handleData = (data: Data) => {
    console.log(data)
    this.setState({ hasData: true })
  }

  render () {
    return (
      <div id="outer-div">
        <Form handleData={this.handleData} />

        {this.state.hasData && (
          <div className="container" id="data-div">
            <div className="row text-center" id="nav-div">
              <p>Nav Stuff</p>
            </div>
            <main>
              <div id="weights-div">
                <p>Weights Table</p>
              </div>
              <div id="trends-div">
                <p>Trends Table</p>
              </div>
            </main>
          </div>
        )}
      </div>
    )
  }
}

export default App
