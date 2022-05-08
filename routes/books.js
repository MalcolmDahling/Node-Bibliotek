let express = require('express');
let router = express.Router();

let nanoId = require('nanoid');

let books = [
    {id:nanoId.nanoid(), bookName:'book A', author:'gunde', pages:200, rented: false},
    {id:nanoId.nanoid(), bookName:'book B', author:'roffe', pages:300, rented: false},
    {id:nanoId.nanoid(), bookName:'book C', author:'berra', pages:600, rented: true},
];



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

    res.redirect('/books');
});



router.post('/newBook', function(req, res){

    let newBook = {...req.body, id:nanoId.nanoid(), rented:false};
    books.push(newBook);
    
    res.redirect('/books');
});



module.exports = router;