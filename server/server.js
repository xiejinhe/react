const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const isDev = process.env.NODE_ENV === 'development'
console.log(chalk.yellow(`NODE_ENV= ${process.env.NODE_ENV}`))

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react conde class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use('/api/user', require('./unit/handle-login'))
app.use('/api', require('./unit/proxy'))

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(
    path.join(__dirname, '../dist/index.html'),
    'utf8'
  )
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    console.log(appString)
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./unit/dev-static')
  devStatic(app)
}
