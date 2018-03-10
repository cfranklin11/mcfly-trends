// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const node: ?HTMLElement = document.getElementById('root')

if (node) {
  ReactDOM.render(<App />, node)
}
