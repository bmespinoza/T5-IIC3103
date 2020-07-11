const express = require('express');
const app = express();
const path = require('path');
var PORT = process.env.PORT || 3000;


//settings
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//routes
app.use(require('./routes/index'));
app.use(require('./routes/episodio'));
app.use(require('./routes/personaje'));
app.use(require('./routes/locacion'));
app.use(require('./routes/busqueda'));

//static files
app.use(express.static(path.join(__dirname, 'public')));



app.listen(app.get('port'), ()=> {
  console.log('Server on port', app.get('port'));
});
