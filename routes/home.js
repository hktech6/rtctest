// home.js
module.exports = (app,partials) => {
    
  app.get('/', async (req, res) => {
      console.log("sdfsf");
    try {     
      return res.render('index.html', {
        partials
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
}
