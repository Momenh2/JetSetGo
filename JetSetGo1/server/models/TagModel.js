const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferencetag = new Schema({
  tag_name: {
    type: String,
    required: true,
    unique: true 
  },
  description: {
    type:String,
    required:false
},
}, { timestamps: true });

module.exports = mongoose.model("Tag", preferencetag);