var express     = require('express')
var app         = express();
var bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({ exrended: true }));
app.use(bodyParser.json());

var port = 8080;

var router =  express.Router();

var nextId = 2;
var books = [];
books[nextId] = {id:1, "title":"Don Quixote"};
nextId++;

function add_new_book(bookObject) {
  var book = Object.assign({id: nextId }, bookObject);
  books[nextId] = book;
  nextId++;
  return book;
}

function validate_book(inputBook) {
  var title = inputBook.title;
  if (title === undefined) {
    return { status: "ERROR", description: "'title' field should be defined and can't be empty" };
  }
  console.log(title);
  return true;
}

router.route('/books')
  .get(function(req, res){
    console.log(books.size);
    console.log(books);
    res.json({ books: Array.from(books.values()) });
  })
  .post(function(req, res){
    var id = req.params.book_id;
    var bookObject = req.body;
    var result = validate_book(bookObject);
    if (result === true) {
      var book = add_new_book(bookObject);
      console.log('Create a new book entry: ' + id + ' body: ' + bookObject);
      res.json(book);
    } else {
      res.status(500).json(result);
    }
  });

router.route('/books/:book_id')
  .get(function(req, res){
    //try to find a book with id = :book_id
    var id = req.params.book_id;
  });

router.route('/books/bulk_load')
  .post(function(req, res){
    //parse a list of books
    console.log('Saving ' + req.body.stringify() + ' book');
    res.json({status: 'OK'});
  });

app.use('/api', router);

app.listen(port);
console.log('Server started at port 8080');
