
const path = require('path');
var fs = require('fs');
module.exports = (app, partials) => {
   
    app.get('/rooms', async (req, res) => {

        try {
      return res.render('rooms.html', {
        partials
      })  
 
        } catch (error) {
            console.log(error)
            return res.status(500).send({"status": "error", "message": "Yikes, something went wrong!"})
        }
    })
}
