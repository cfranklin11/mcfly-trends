// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import '../stylesheets/index.scss'

const node: ?HTMLElement = document.getElementById('root')

if (node) {
  ReactDOM.render(<App />, node)
}
