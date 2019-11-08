
const path = require('path');
var fs = require('fs');
module.exports = (app, partials) => {
   
    app.get('/broadcast', async (req, res) => {
console.log(partials.header);
        try {
      return res.render('broadcast.html', {
        partials
      })  
 
        } catch (error) {
            console.log(error)
            return res.status(500).send({"status": "error", "message": "Yikes, something went wrong!"})
        }
    })
}
