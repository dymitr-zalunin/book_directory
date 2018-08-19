var express     = require('express')
var app         = express();
var bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({ exrended: true }));
app.use(bodyParser.json());

var port = 8080;


var router =  express.Router();


router.get('/', function(req, res){
  res.json({ books: [{"title": "Kariera Nikodema Dyzmy"}]});
});


app.use('/api', router);

app.listen(port);
console.log('Server started at port 8080');
