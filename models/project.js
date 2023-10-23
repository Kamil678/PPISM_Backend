const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Project', projectSchema)