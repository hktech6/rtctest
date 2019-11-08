// Routes
module.exports = (app,partials) => {
  require('./home')(app,partials)
  require('./whitebord')(app,partials)
  require('./rooms')(app,partials)
  require('./broadcast')(app,partials)
  require('./data')(app)
//  require('./blog')(app,partials)
//  require('./contact')(app,partials)
//  require('./search')(app,partials)
//  require('./faqs')(app,partials)
//  require('./page')(app,partials)
}

