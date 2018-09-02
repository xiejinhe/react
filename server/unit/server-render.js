const ejs = require('ejs')
const serialize = require('serialize-javascript')
const ReactDomServer = require('react-dom/server')
const bootstrapper = require('react-async-bootstrapper')
const Helmet = require('react-helmet').default // 为什么写default 因为这个模块是基于 import export 写的代码

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const colors = require('material-ui/colors')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((ret, storeName) => {
    ret[storeName] = stores[storeName].toJson()
    return ret
  }, {})
}

module.exports = (bundle, template, req, res) => {
  console.log('===================================', bundle)
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const sheetsRegistry = new SheetsRegistry()
    const jss = create(preset())
    jss.options.createGenerateClassName = createGenerateClassName
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        account: colors.lightBlue,
        type: 'light'
      }
    })
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)

    bootstrapper(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      console.log(stores.appState.count)
      const helmet = Helmet.rewind()
      const state = getStoreState(stores)
      const content = ReactDomServer.renderToString(app)
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
      // res.send(template.replace('<!-- app -->', content))
    }).catch(reject)
  })
}
