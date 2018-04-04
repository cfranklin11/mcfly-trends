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

function Nav ({ keyword, scrollFunc, downloadCsv } :Props): Node {
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  const keywordStringStart = keyword.length > 1 ? `${keyword.slice(0, -1).join(', ')}` : keyword[0]
  const keywordStringEnd = keyword.length > 1 ? ` and ${keyword[keyword.length - 1]}` : ''

  return (
    <div>
      <h3>
        {`Here's your trends data for ${keywordStringStart}${keywordStringEnd}`}
      </h3>
      <h3>{message}</h3>
      <div id="nav-bar">
        <Sticky>
          {({ style }) => {
            return (
              <nav className="navbar navbar-default" style={style}>
                <div className="col-sm-6 col-sm-offset-3">
                  <button
                    id="csv"
                    className="btn btn-lg navbar-btn btn-success"
                    onClick={downloadCsv}
                  >
                    Download CSV
                  </button>
                  <button
                    id="top"
                    className="btn btn-lg navbar-btn btn-primary"
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
    </div>
  )
}

export default Nav
