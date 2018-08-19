var express     = require('express')
var app         = express();
var bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({ exrended: true }));
app.use(bodyParser.json());

var port = 8080;

var router =  express.Router();

var nextId = 1;
var books = new Map();

add_new_book({title: "Don Quixote"});

function add_new_book(bookObject) {
  var book = Object.assign({id: nextId }, bookObject);
  books.set(nextId, book);
  nextId++;
  return book;
}

function delete_book(id) {
  console.log('Delete '+id);
  console.log('Delete '+(typeof id));
  if (!books.has(id)) {
    return null;
  }
  console.log('Delete '+(typeof id));
  var book = books.get(id);
  books.delete(id);
  return book;
}

function get_book(id) {
  return books.has(id) ? books.get(idx) : null;
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
    var result = Array.from(books.values());
    res.json({ books: result });
  })
  .post(function(req, res){
    var bookObject = req.body;
    var result = validate_book(bookObject);
    if (result === true) {
      var book = add_new_book(bookObject);
      console.log('Create a new book entry: ' + bookObject);
      res.json(book);
    } else {
      res.status(500).json(result);
    }
  });

router.route('/books/:book_id')
  .get(function(req, res){
    //try to find a book with id = :book_id
    var id = req.params.book_id;
    console.log(id);
    var book = null;
    var status = 200;
    if (id !== undefined) {
      book = get_book(id);
    }
    if (book === null) {
      res.status(404).json({});
    } else {
      res.json(book);
    }
  })
  .delete(function(req, res){
    var id = parseInt(req.params.book_id);
    var book = null;
    if (id !== undefined) {
      book = delete_book(id);
    }
    if (book === null) {
      res.status(404).json({});
    } else {
      res.json(book);
    }
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
