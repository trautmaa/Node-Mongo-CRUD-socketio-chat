var mongoose = require('mongoose')
var bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    create_date: {
        type: Date,
        default: Date.now
    }
})
var Book = module.exports = mongoose.model('Book', bookSchema)

// Get books
module.exports.getBooks = (callback, limit) => {
    Book.find(callback).limit(limit)
}

// Get book
module.exports.getBookById = (id, callback) => {
    Book.findById(id, callback)
}

// Add book
module.exports.addBook = (book, callback) => {
    Book.create(book, callback)
}

// Update Book
module.exports.updateBook = (id, book, options, callback) => {
    var query = { _id: id };
    var update = {
        title: book.title,
        genre: book.genre,
        description: book.description
    }
    Book.findOneAndUpdate(query, update, options, callback)
}

// Delete Book
module.exports.deleteBook = (id, callback) => {
    Book.deleteOne({ '_id': id }, callback)
}