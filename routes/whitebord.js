
const path = require('path');
var fs = require('fs');
module.exports = (app, partials) => {
   
    app.get('/whitebord', async (req, res) => {

        try {
      return res.render('whitebord.html', {
        partials
      })  
 
        } catch (error) {
            console.log(error)
            return res.status(500).send({"status": "error", "message": "Yikes, something went wrong!"})
        }
    })
}
