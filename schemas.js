const mongoose = require('./index')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    about: String,
    accountpicurl: String,
    registered: Date,
    secretid: String,
    tagsid: [String],
    projectsid:[String]
})

const projectSchema = new Schema({
    name: String,
    discription: String,
    secretmessage: String,
    authorid: String,
    participantsid: [String],
    published: Boolean,
    publisheddate: Date,
    created: Date,
    tagsrequiredid: [String]
})

const tagSchema = new Schema({
    name: String,
    childtagsid: [String],
    parenttagid: [String]
})

const responseSchema = new Schema({
    userid: String,
    projectid: String,
    userresponse: Boolean,
    authorresponse: Boolean,
    userresponsed: Date,
    authorresonded: Date
})

const User = mongoose.model('User', userSchema)
const Project = mongoose.model('Project', projectSchema)
const Tag = mongoose.model('Tag', tagSchema)
const Response = mongoose.model('Response', responseSchema)

module.exports = {User, Project, Tag, Response}