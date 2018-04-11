// @flow
import React from 'react'
import type { Node } from 'react'
import { Sticky } from 'react-sticky'

type Props = {
  keyword: Array<string>,
  scrollFunc: () => void,
  downloadCsv: () => void
}

const MESSAGES = ['Enjoy!', 'Rock on!', 'Keep it real!', 'Wango the tango!',
  'Buen provecho!', 'Bon appetit!', 'Bom proveito!', "L'chaim!", 'Cheers!', 'Salud!',
  'Salut!', 'Seize the day!', 'Everyday!', 'Booyah!', 'Hoowah!']

function QueryNav ({ keyword, scrollFunc, downloadCsv } :Props): Node {
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  const keywordStringStart = keyword.length > 1 ? `${keyword.slice(0, -1).join(', ')}` : keyword[0]
  const keywordStringEnd = keyword.length > 1 ? ` and ${keyword[keyword.length - 1]}` : ''

  return (
    <div className="QueryNav">
      <h3>
        {`Here's your trends data for ${keywordStringStart}${keywordStringEnd}`}
      </h3>
      <h3>{message}</h3>
      <Sticky>
        {({ style }) => {
          return (
            <nav className="navbar navbar-default queryNav" style={style}>
              <div className="col-sm-8 col-sm-offset-2 navButtonContainer">
                <button
                  className="btn btn-lg navbar-btn btn-success navButton"
                  onClick={downloadCsv}
                >
                  Download CSV
                </button>
                <button
                  className="btn btn-lg navbar-btn btn-primary navButton"
                  onClick={scrollFunc}
                >
                  Back to Top
                </button>
              </div>
            </nav>
          )
        }}
      </Sticky>
    </div>
  )
}

export default QueryNav
