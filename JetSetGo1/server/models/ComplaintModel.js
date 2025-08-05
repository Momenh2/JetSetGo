// ComplaintModel.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    adminResponse: {type: String}
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
