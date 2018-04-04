// @flow
import React, { Component } from 'react'
import type { Node } from 'react'

import type { Data } from '../types'

type State = {
  keyword: string,
  geo: string,
  startMonth: string,
  endMonth: string,
  isSubmitting: bool,
  errors: Array<string>,
}

type Props = {
  handleData: (data: Data) => void,
}

class Form extends Component<Props, State> {
  state = {
    keyword: '',
    geo: '',
    startMonth: '',
    endMonth: '',
    isSubmitting: false,
    errors: [],
  }

  handleKeyPress = (event: SyntheticInputEvent<HTMLInputElement>): void => {
    this.setState({ keyword: event.currentTarget.value })
  }

  handleSelect = (event: SyntheticInputEvent<HTMLSelectElement>): void => {
    this.setState({ geo: event.currentTarget.value })
  }

  handleMonthChange = (label: string) => {
    return (event: SyntheticInputEvent<HTMLInputElement>): void => {
      this.setState({ [label]: event.currentTarget.value })
    }
  }

  handleFormSubmit = (event: SyntheticInputEvent<HTMLFormElement>): void => {
    const { keyword, geo, startMonth, endMonth, errors } = this.state

    event.preventDefault()
    this.setState({ isSubmitting: true })

    const params = {
      keyword: keyword.split(/,\s+?/),
      geo,
      startMonth: startMonth === '' ? '' : new Date(startMonth),
      endMonth: endMonth === '' ? '' : new Date(endMonth),
    }

    fetch('/data', {
      body: JSON.stringify(params),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response: Response) => {
        this.setState({ isSubmitting: false })

        if (!response.ok) {
          throw Error(`${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .then((data) => {
        this.props.handleData(data)
      })
      .catch((error) => {
        this.setState({ errors: errors.concat(error.message) })
      })
  }

  render (): Node {
    const { keyword, geo, isSubmitting, startMonth, endMonth, errors } = this.state

    return (
      <div className="row">
        {errors.length > 0 && (
          <p>{errors.join(' and ')}</p>
        )}
        <div className="container well col-sm-4 col-sm-offset-4">
          <form id="form" onSubmit={this.handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="keyword">Search Terms (separated by commas)</label>
              <input
                type="text"
                name="keyword"
                id="keyword"
                className="form-control"
                value={keyword}
                onChange={this.handleKeyPress}
              />
            </div>

            <div className="form-group">
              <label htmlFor="select">Location</label>
              <select
                name="geo"
                form="form"
                id="geo"
                className="form-control"
                onChange={this.handleSelect}
                value={geo}
              >
                <option value="">Worldwide</option>
                <option value="AU">Australia</option>
                <option value="NZ">New Zealand</option>
              </select>
            </div>

            <div className="form-group col-lg-6" id="start-div">
              <label htmlFor="startMonth">Start Date (optional)</label>
              <input
                type="month"
                name="startMonth"
                id="startMonth"
                className="form-control"
                value={startMonth}
                onChange={this.handleMonthChange('startMonth')}
              />
            </div>

            <div className="form-group col-lg-6" id="end-div">
              <label htmlFor="end">End Date (optional)</label>
              <input
                type="month"
                name="end"
                id="end"
                className="form-control"
                value={endMonth}
                onChange={this.handleMonthChange('endMonth')}
              />
            </div>

            <button
              id="search-submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={keyword.length === 0 || isSubmitting}
              onClick={this.handleFormSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Form
