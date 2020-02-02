var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var mongo = require('mongodb').MongoClient;
var socketClient = require('socket.io').listen(4000).sockets;

const localURL = 'mongodb://127.0.0.1/'
const dbname = 'mongochat';

// Socket.IO Stuff
const url = `${localURL}`

mongo.connect(url, (err, client) => {
    if (err) {
        throw err;
    }

    var db = client.db(dbname);


    console.log('Socket IO connection')

    // Connect to Socket.IO
    socketClient.on('connection', (socket) => {
        let chat = db.collection('chats')

        // create func to send status
        const sendStatus = (s) => {
            socket.emit('status', s)
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray((err, result) => {
            if (err) {
                throw err;
            }
            socket.emit('output', result)
        })

        // Handle input events
        socket.on('input', (data) => {
            let { name, message } = data;
            if (name === '' || message === '') {
                sendStatus('please enter a name and message')
            } else {
                // insert message
                chat.insert({ name, message }, () => {
                    socketClient.emit('output', [data])
                })

                //send status object
                sendStatus({
                    message: 'message sent',
                    clear: true
                })
            }
        });

        // handle clear
        socket.on('clear', (data) => {
            // remove all chats from collection
            chat.remove({}, () => {
                socket.emit('cleared')
            })
        })
    })

})










// CRUD Stuff
// app.use(bodyParser.json())
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// Genre = require('./models/genre');
// Book = require('./models/book');

// mongoose.connect(`${localURL}bookstore`)
// var db = mongoose.connection

// app.get('/', (req, res) => {
//     res.send('Use the API! /api/books or /api/genres')
// });

// app.get('/api/genres', (req, res) => {
//     Genre.getGenres((err, genres) => {
//         if (err) {
//             throw err;
//         }
//         res.json(genres)
//     })
// });

// app.post('/api/genres', (req, res) => {
//     var genre = req.body;
//     Genre.addGenre(genre, (err, genre) => {
//         if (err) {
//             throw err;
//         }
//         res.json(genre)
//     })
// });

// app.put('/api/genres/:_id', (req, res) => {
//     var genre = req.body;
//     const id = req.params._id;
//     Genre.updateGenre(id, genre, {}, (err, genre) => {
//         if (err) {
//             throw err;
//         }
//         res.json(genre)
//     })
// });

// app.delete('/api/genres/:_id', (req, res) => {
//     Genre.deleteGenre(req.params._id, (err, genre) => {
//         if (err) {
//             throw err;
//         }
//         res.json(genre)
//     })
// });

// app.get('/api/books', (req, res) => {
//     Book.getBooks((err, books) => {
//         if (err) {
//             throw err;
//         }
//         res.json(books)
//     })
// });

// app.get('/api/books/:_id', (req, res) => {
//     Book.getBookById(req.params._id, (err, book) => {
//         if (err) {
//             throw err;
//         }
//         res.json(book)
//     })
// });

// app.post('/api/books', (req, res) => {
//     var book = req.body;
//     console.log("bb", book)
//     Book.addBook(book, (err, book) => {
//         if (err) {
//             throw err;
//         }
//         res.json(book)
//     })
// })

// app.put('/api/books/:_id', (req, res) => {
//     var book = req.body;
//     const id = req.params._id;
//     Book.updateBook(id, book, {}, (err, book) => {
//         if (err) {
//             throw err;
//         }
//         res.json(book)
//     })
// });

// app.delete('/api/books/:_id', (req, res) => {
//     Book.deleteBook(req.params._id, (err, dbResponse) => {
//         if (err) {
//             throw err
//         }
//         res.json(dbResponse)
//     })
// });

// app.listen(3000, () => {
//     console.log('app running on port 3000')
// })
