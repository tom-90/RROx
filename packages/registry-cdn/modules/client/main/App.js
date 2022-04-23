/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { fontSans, fontMono } from '../utils/style.js';

import { GitHubIcon } from './Icons.js';

const buildId = process.env.BUILD_ID;

const globalStyles = css`
  html {
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html,
  body,
  #root {
    margin: 0;
  }

  body {
    ${fontSans}
    font-size: 16px;
    line-height: 1.5;
    overflow-wrap: break-word;
    background: white;
    color: black;
  }

  code {
    ${fontMono}
    font-size: 1rem;
    padding: 0 3px;
    background-color: #eee;
  }

  dd,
  ul {
    margin-left: 0;
    padding-left: 25px;
  }
`;

function Link(props) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      css={{
        color: '#0076ff',
        textDecoration: 'none',
        ':hover': { textDecoration: 'underline' }
      }}
    />
  );
}

export default function App() {
  return (
    <Fragment>
      <Global styles={globalStyles} />

      <div css={{ maxWidth: 740, margin: '0 auto' }}>
        <div css={{ padding: '0 20px' }}>
          <header>
            <h1
              css={{
                textAlign: 'center',
                fontSize: '4.5em',
                letterSpacing: '0.05em',
                '@media (min-width: 700px)': {
                  marginTop: '1.5em'
                }
              }}
            >
              RROx CDN
            </h1>

            <p>
              CDN for the{' '}
              <Link href="https://registry.rrox.tom90.nl/">RROx plugin registry</Link>, based on <Link href="https://unpkg.com/">unpkg</Link>.
            </p>
          </header>
        </div>
      </div>

      <footer
        css={{
          marginTop: '5rem',
          background: 'black',
          color: '#aaa',
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <div
          css={{
            maxWidth: 740,
            padding: '10px 20px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p>
            <span>Build: {buildId}</span>
          </p>
          <p>
            <span>&copy; {new Date().getFullYear()} RROX</span>
          </p>
          <p css={{ fontSize: '1.5rem' }}>
            <a
              href="https://github.com/tom-90/RROx"
              css={{
                color: '#aaa',
                display: 'inline-block',
                marginLeft: '1rem',
                ':hover': { color: 'white' }
              }}
            >
              <GitHubIcon />
            </a>
          </p>
        </div>
      </footer>
    </Fragment>
  );
}

if (process.env.NODE_ENV !== 'production') {
  App.propTypes = {
    location: PropTypes.object,
    children: PropTypes.node
  };
}
