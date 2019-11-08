var express = require('express');
var hogan = require('hogan-express');
//var https = require('https');
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var fs = require('fs'); 


const app = express()


var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};
    
const server = require('https').createServer(options,app);
const io = require('socket.io')(server);
//io.set('transports', ['websocket']);
io.on('connection', client => {
    
    client.on('new-channel', data => { /* … */
        console.log('A client connected!');
    });
    client.on('disconnect', () => { /* … */
    });
});  
app.use(bodyParser.json())
app.use(compression())
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/node_modules')) 

//app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

app.use((req, res, next) => {
    if (req.url === '/favicon.ico')
        return res.end()
    // Set global variables
    res.locals.year = new Date().getFullYear()
    // Set dev
    if (process.env.NODE_ENV === 'development')
        res.locals.is_dev = true
    next()
})
const partials = {
    header: 'partials/header',
    footer: 'partials/footer'
}
require('./routes')(app, partials)

server.listen(app.get('port'), function () {
    console.log("listening port " + app.get('port'));
});
//const http = http_module.Server(app)
//http.listen(app.get('port'), () => {
//    console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
//})