import express from 'express'
import cors from 'cors'
import * as React from 'react'
import ReactDOM from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import serialize from 'serialize-javascript'
import App from '../shared/App'
import routes from '../shared/routes'
import webpack from 'webpack';
import webpackConfig from '../../webpack.config';
const compiler = webpack(webpackConfig);
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express()

app.use(cors())
app.use(express.static('dist'))

app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true, 
    publicPath: '../../dist',
    stats: 'minimal',
    historyApiFallback: true
  }));
  
  app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res, next) => {
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve()

  promise.then((data) => {
    const markup = ReactDOM.renderToString(
      <StaticRouter location={req.url} context={{ data }}>
        <App />
      </StaticRouter>
    )

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RRv5</title>
          <script src="/bundle.js" defer></script>
          <link href="/main.css" rel="stylesheet">
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
  }).catch(next)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})