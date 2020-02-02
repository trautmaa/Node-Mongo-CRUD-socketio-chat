var mongoose = require('mongoose')
var genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
})
var Genre = module.exports = mongoose.model('Genre', genreSchema)

// Get genres
module.exports.getGenres = (callback, limit) => {
    Genre.find(callback).limit(limit)
}

// Add genre
module.exports.addGenre = (genre, callback) => {
    Genre.create(genre, callback)
}

// Update genre
module.exports.updateGenre = (id, genre, options, callback) => {
    var query = { _id: id };
    var update = {
        name: genre.name
    }
    Genre.findOneAndUpdate(query, update, options, callback)
}

// Delete genre
module.exports.deleteGenre = (id, callback) => {
    Genre.deleteOne({ '_id': id }, callback)
}