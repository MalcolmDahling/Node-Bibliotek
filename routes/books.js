let express = require('express');
let router = express.Router();

let nanoId = require('nanoid');
let fs = require('fs');



let books = JSON.parse(fs.readFileSync('books.json'));



router.get('/', function(req, res){

    let printBooks = `<div><h2>Böcker:</h2>`;

    books.forEach(book => {
        printBooks += `
            <a href="books/${book.id}">
                ${book.bookName} ${book.rented ? "Utlånad" : "Ledig"}
            </a>
            <br>
        `;
    });

    printBooks += `<a href="books/newBook">Lägg till ny bok</a></div>`;
    
    res.send(printBooks);
});



router.get('/newBook', function(req, res){

    let form = `<h2>Lägg till ny bok</h2>
    
    <form action="newBook" method="post">
        <input type="text" name="bookName" placeholder="Boknamn">
        <br>
        <input type="text" name="author" placeholder="Författare">
        <br>
        <input type="text" name="pages" placeholder="Sidor">
        <br>
        <input type="submit" value="Spara">
    </form>`;

    res.send(form);
});



router.get('/:id', function(req, res){

    for(let i = 0; i < books.length; i++){
        if(books[i].id == req.params.id){
            res.send(`<div>
                <p>Namn: ${books[i].bookName}</p>
                <p>Författare: ${books[i].author}</p>
                <p>Sidor: ${books[i].pages}</p>
                ${books[i].rented ? "Utlånad" : "Ledig"}
                <br><br>

                ${books[i].rented ? `` : `
                    <form action="${books[i].id}/rentBook" method="post">
                        <input type="submit" value="Låna boken">
                    </form>
                `}
                
            </div>`);
        }
    }
});



router.post('/:id/rentBook', function(req, res){

    for(let i = 0; i < books.length; i++){
        if(books[i].id == req.params.id){
            books[i].rented = true;
        }
    }

    fs.readFile('books.json', (err, data) => {
        fs.writeFile('books.json', JSON.stringify(books, null, 4), (err) => {

        });
    });

    res.redirect('/books');
});



router.post('/newBook', function(req, res){

    let newBook = {...req.body, id:nanoId.nanoid(), rented:false};
    books.push(newBook);

    fs.readFile('books.json', (err, data) => {
        if(err){
            console.log(err);
        }

        fs.writeFile('books.json', JSON.stringify(books, null, 4), (err) => {
            if(err){
                console.log(err);
            }
        });

        ;
    });

    res.redirect('/books')
});



module.exports = router;

