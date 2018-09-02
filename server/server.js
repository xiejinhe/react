const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
// const ReactSSR = require('react-dom/server')
const serverRender = require('./unit/server-render')
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
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(
    path.join(__dirname, '../dist/server.ejs'),
    'utf8'
  )
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res, next) {
    /* const appString = ReactSSR.renderToString(serverEntry)
    console.log(appString)
    res.send(template.replace('<!-- app -->', appString)) */
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./unit/dev-static')
  devStatic(app)
}

app.use(function (error, req, res, next) {
  console.log('22222222222222')
  res.status(500).send(error)
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
