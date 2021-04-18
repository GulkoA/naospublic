const express = require('express')
const app = express()

//Loading FS controller and secure data file
const fs = require('fs')
const securedata = JSON.parse(fs.readFileSync('securedata.json'))

//Mongoose - db controller
const mongoose = require('mongoose');
mongoose.connect(securedata.databaseurl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => console.log('Connected to the DB successfully!'))
    .catch(err => {console.log('DB error!'); console.log(err)})

module.exports = mongoose
const {User, Project, Tag, Response} = require('./schemas')

//const fetch = require('node-fetch');

console.log('All components imported')

app.listen(80, () => console.log('Server is listening at 80'))
app.use(express.static('public'))
app.use(express.json())

app.post('/api/newuser', (request, response) => {
    try
    {
        User.find({email: request.body.email}, (err, users) => {
            if(err)
                console.log(err)
            else if (users.length != 0)
                response.json({status: 'err', err: 'User with this email already exists!'})
            else
            {
                const newUser = new User({
                    password: request.body.password,
                    email: request.body.email,
                    firstname: request.body.firstname,
                    lastname: request.body.lastname,
                    tagsid: request.body.chosentags,
                    projectsid: [],
                    about: ' Hi! I am ' + request.body.firstname + ', a new Naos user',
                    accountpicurl: 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png',
                    registered: Date.now(),
                    secretid: (Math.floor(Date.now() * Math.random()))
                })
                newUser.save()
                console.log('New user registered!')
                response.json({status: 'suc', userid: newUser._id, secretuserid: newUser.secretid})
            }
        })
    }
    catch(err)
    {
        console.log('/api/newuser Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

app.post('/api/updateuser', (request, response) => {
    try
    {
        User.findById(request.body.userid, (err, base) => {
            if(err)
            {
                console.log(err)
                response.end
            }
            else if (base == undefined || base.length < 1)
            {
                response.json({status: 'err', error: 'User not found!'})
            }
            else if (base.secretid != request.body.secretuserid)
            {
                console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                response.json({status: 'err', error: 'Authorisation error'})
            }
            else
            {
                base.set({
                    password: request.body.password,
                    email: request.body.email,
                    firstname: request.body.firstname,
                    lastname: request.body.lastname,
                    about: request.body.discription,
                    accountpicurl: request.body.accountpicurl,
                    tagsid: request.body.chosentags
                })
                base.save()
                response.json({status: 'suc'})
            }
        })
    }
    catch(err)
    {
        console.log('/api/updateuser Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

app.post('/api/login', (request, response) => {
    try
    {
        User.find({email: request.body.email}, (err, users) => {
            if(err)
            {
                console.log(err)
                response.end
            }
            else if (users == undefined || users.length == 0)
                response.json({status: 'err', err: 'User with this email doesn\'t exist!'})
            else if (users[0].password != request.body.password)
                response.json({status: 'err', err: 'Wrong password!'})
            else
                response.json({status: 'suc', userid: users[0]._id, secretuserid: users[0].secretid})
        })
    }
    catch(err)
    {
        console.log('/api/login Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

app.post('/api/getuserinfoauthorised', (request, response) => {
        User.findById(request.body.userid, (err, base) => {
        try
        {
            if (err)
            {
                console.log(err)
                response.end
            }
            else if (base == undefined || base.length < 1)
            {
                response.json({status: 'err', error: 'User not found!'})
            }
            else if (base.secretid === request.body.secretuserid)
            {
                response.json({
                    status: 'suc',
                    firstname: base.firstname,
                    lastname: base.lastname,
                    email: base.email,
                    discription: base.about,
                    password: base.password,
                    accountpicurl: base.accountpicurl,
                    chosentags: base.tagsid,
                    projectsid: base.projectsid
                })
            }
            else
            {
                console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                response.json({status: 'err', error: 'Authorisation error'})
            }
        }
        catch(err)
        {
            console.log('/api/getuserinfoauthorised Error occured!')
            console.log(err)
            response.json({status: 'err', error: err})
        }
    })
})

app.post('/api/getuserinfo', (request, response) => {
    try
    {
        User.findById(request.body.userid, (err, base) => {

            if (err)
            {
                console.log(err)
                response.end
            }
            else if (base == undefined || base.length < 1)
            {
                response.json({status: 'err', error: 'User not found!'})
            }
            else
            {
                response.json({
                    status: 'suc',
                    firstname: base.firstname,
                    lastname: base.lastname,
                    discription: base.about,
                    accountpicurl: base.accountpicurl,
                    chosentags: base.tagsid,
                    projectsid: base.projectsid
                })
            }
        })
    }
    catch(err)
    {
        console.log('/api/getuserinfo Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})


app.post('/api/newproject', (request, response) => {
    try
    {        
        User.findById(request.body.userid, (err, user) => {
            if (user.secretid === request.body.secretuserid)
            {
                const newProject = new Project({
                    name: request.body.projectname,
                    discription: request.body.discription,
                    secretmessage: request.body.secretmessage,
                    authorid: request.body.userid,
                    tagsrequiredid: request.body.tagsrequiredid,
                    created: Date.now(),
                    published: request.body.publish,
                    publisheddate: Date.now()
                })
                    newProject.save()
                    console.log('New project created!')
                    console.log(newProject)
                    user.projectsid.push(newProject._id)
                    user.save()
                    response.json({status: 'suc', projectid: newProject._id})
            }
            else
            {
                console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                response.json({status: 'err', error: 'Authorisation error'})
            }
        })
    }
    catch(err)
    {
        console.log('/api/newproject Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

app.post('/api/getprojectinfo', (request, response) => {
    try
    {
        Project.findById(request.body.projectid, (err, base) => {
            if (err)
            {
                console.log(err)
                response.json({status: 'err', error: 'Project is not found!'})
            }
            else
            {
            
                User.findById(request.body.userid, (err, user) => {
                        if (err)
                        {
                            console.log(err)
                            response.json({status: 'err', error: 'User not found! Please log in'})
                        }
                        if (user == undefined || user.length < 1)
                        {
                            response.json({status: 'err', error: 'Authorisation error'})
                        }
                        else if (request.body.userid === base.authorid)
                        {
                                if (user.secretid === request.body.secretuserid)
                                {
                                    Response.find({projectid: request.body.projectid, userresponse: true, authorresponse: undefined}, (err, responseBase) => {
                                        responseBase = responseBase.map(resp => resp.userid)
                                        response.json({
                                            status: 'suc',
                                            name: base.name,
                                            discription: base.discription,
                                            secretmessage: base.secretmessage,
                                            authorid: base.authorid,
                                            participantsid: base.participantsid,
                                            author: true,
                                            participant: true,
                                            created: base.created, 
                                            published: base.published,
                                            chosentags: base.tagsrequiredid,
                                            responses: responseBase
                                        })
                                    })
                                }
                                else
                                {
                                    response.json({status: 'err', error: 'Authorisation error'})
                                    console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                                }
                        }
                        else
                        {
                            if (user.secretid === request.body.secretuserid)
                            {
                                let participant = false
                                base.participantsid.forEach(value => {
                                    if (value == request.body.userid)
                                        participant = true
                                })
                                if (participant)
                                {
                                    response.json({
                                        status: 'suc',
                                        name: base.name,
                                        discription: base.discription,
                                        secretmessage: base.secretmessage,
                                        authorid: base.authorid,
                                        participantsid: base.participantsid,
                                        author: false,
                                        participant: true,
                                        created: base.created,
                                        chosentags: base.tagsrequiredid
                                    })
                                }
                                else if (base.published)
                                {
                                    response.json({
                                        status: 'suc',
                                        name: base.name,
                                        discription: base.discription,
                                        authorid: base.authorid,
                                        participantsid: base.participantsid,
                                        author: false,
                                        participant: false,
                                        created: base.created,
                                        chosentags: base.tagsrequiredid
                                    })
                                }
                                else
                                {
                                    response.json({
                                        status: 'err',
                                        error: 'This project is corrently hidden by author. Only participants can view it'
                                    })
                                }
                            }
                            else
                            {
                                response.json({status: 'err', error: 'Authorisation error'})
                                console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                            }
                        }

                })

            }
        })
    }
    catch (err)
    {
        console.log('Error at /api/getprojectinfo')
        console.log(err)
        response.json({status: 'err', error: 'Unexpected error occured!'})
    }
})

app.post('/api/changeprojectpublishstatus', (request, response) => {
    try
    {
        Project.findById(request.body.projectid, (err, base) => {
            if (err)
            {
                console.log(err)
                response.json({status: 'err', error: 'Project is not found!'})
            }
            else
            {
                if (request.body.userid === base.authorid)
                {
                    User.findById(request.body.userid, (err, user) => {
                        if (err)
                        {
                            console.log(err)
                            response.json({status: 'err', error: 'User not found! Please log in'})
                        }
                        else if (user.secretid === request.body.secretuserid)
                        {
                            base.published = request.body.published
                            if (request.body.published)
                                base.publisheddate = Date.now()
                            base.save()
                            response.json({
                                status: 'suc'
                            })
                        }
                        else
                        {
                            response.json({status: 'err', error: 'Authorisation error'})
                            console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                        }
                    })
                }
                else if (base.published)
                {
                    response.json({
                        status: 'suc',
                        name: base.name,
                        discription: base.discription,
                        authorid: base.authorid,
                        participantsid: base.participantsid,
                        author: false,
                        created: base.created
                    })
                }
                else
                {
                    response.json({
                        status: 'err',
                        error: 'This project is corrently hidden by author. Only participants can view it'
                    })
                }
            }
        })
    }
    catch (err)
    {
        console.log('Error at /api/changeprojectpublishstatus')
        console.log(err)
        response.json({status: 'err', error: 'Unexpected error occured!'})
    }
})

app.post('/api/updateproject', (request, response) => {
    try
    {
        Project.findById(request.body.projectid, (err, base) => {
            if(err)
            {
                console.log(err)
                response.end
            }
            else if (base == undefined || base.length < 1)
            {
                response.json({status: 'err', error: 'Project not found!'})
            }
            else if (base.authorid != request.body.userid)
            {
                response.json({status: 'err', error: 'User is not author'})
            }
            else
            {
                User.findById(request.body.userid, (err, user) => {
                    if (user.secretid != request.body.secretuserid)
                    {
                        console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                        response.json({status: 'err', error: 'Authorisation error'})
                    }
                    else
                    {
                        base.set({
                            name: request.body.name,
                            discription: request.body.discription,
                            secretmessage: request.body.secretmessage,
                            tagsrequiredid: request.body.chosentags
                        })
                        base.save()
                        response.json({status: 'suc'})
                    }
                })
            }
        })
    }
    catch(err)
    {
        console.log('/api/updateuser Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

app.get('/api/gettags', (request, response) => {
    Tag.find({parenttagid: undefined}, (err, tags) => {
        if (err)
        {
            console.log(err)
            response.end
        }
        else
            response.json({
                status: 'suc',
                parenttags: tags
            })
    })
})

app.post('/api/getspecifictags', (request, response) => {
    if (request.body.childtagsid.length <= 0)
        response.json({status: 'err', error: 'Not enough tag ids'})
    else
    {
        var tagstoreturn = []
        request.body.childtagsid.forEach(function(tagid){
            Tag.findById(tagid, (err, tag) => {
                if (err)
                {
                    console.log(err)
                }
                else
                {
                    tagstoreturn.push(tag)
                    if (tagstoreturn.length >= request.body.childtagsid.length)
                    {
                        response.json({status: 'suc', tags: tagstoreturn})
                    }
                }
            })
        })
    }
})

app.post('/api/newresponsebyuser', (request, response) => {
    try
    {
        Response.find({userid: request.body.userid, projectid: request.body.projectid}, (err, respbase) => {
            if (err)
            {
                console.log(err)
            }
            else if (respbase.length > 0)
            {
                response.json({status: 'err', error: 'Response already exists'})
            }
            else
            {
                console.log(request.body)
                const newResp = new Response({
                    userid: request.body.userid,
                    projectid: request.body.projectid,
                    userresponse: request.body.state,
                    authorresponse: undefined,
                    userresponded: Date.now()
                })
                console.log(newResp)
                newResp.save()
                response.json({status: 'suc'})
            }
        })
    }
    catch(err)
    {
        console.log('Error in /api/newresponsebyuser')
        console.log(err)
    }
})

app.post('/api/newresponsebyauthor', (request, response) => {
    try
    {
        Response.find({userid: request.body.userid, projectid: request.body.projectid}, (err, respbase) => {
            if (err)
            {
                console.log(err)
            }
            else if (respbase.length < 1)
            {
                response.json({status: 'err', error: 'Response does not exist!'})
            }
            else
            {
                if (request.body.authorresponse)
                {
                    User.findById(request.body.userid, (err, user) => {
                        if (err)
                        {
                            console.log(err)
                            response.end
                        }
                        else
                        {
                            Project.findById(request.body.projectid, (err, projectbase) => {
                                projectbase.participantsid.push(request.body.userid)
                                projectbase.save()
                            })
                            user.projectsid.push(request.body.projectid)
                            user.save()
                            response.json({status: 'suc'})
                        }
                    })
                }
                else
                {
                    response.json({status: 'suc'})
                }

                respbase[0].authorresponse = request.body.authorresponse
                respbase[0].authorresponded = Date.now()
                respbase[0].save()
            }
        })
    }
    catch(err)
    {
        console.log('Error in /api/newresponsebyauthor')
        console.log(err)
    }
})

app.post('/api/getproject', (request, response) => 
{
    try
    {
        console.log('Project card requested!')
        var usertags = []
        User.findById(request.body.userid, (err, user) => {
            if (err)
                console.log(err)
            else if (user == undefined)
            {
                response.json({status: 'err', error: 'User not found!'})
            }
            else if (user.secretid === request.body.secretuserid)
            {
                usertags = user.tagsid
                
                Project.find({published: true, authorid: {$ne : request.body.userid}}, (err, base) => {
                    if (err)
                        console.log(err)
                    else if (base.length < 1)
                    {
                        response.json({status: 'err', error: 'There are no projects available!'})
                    }
                    else
                    {
                        Response.find({userid: request.body.userid}, (err, responses) => {
                            if (err)
                                {
                                    console.log(err)
                                }
                                else
                                {
                                    var bestProject = undefined
                                    var bestProjectSimilarities = -1
                                    base.forEach(curProject => {
                                        if (findSimilarities(usertags, curProject.tagsrequiredid) > bestProjectSimilarities)
                                        {
                                            if (checkIfSuitable(responses, curProject._id))
                                            {
                                                bestProject = curProject
                                                bestProjectSimilarities = findSimilarities(usertags, curProject.tagsrequiredid)
                                            }
                                    }
                                })
                                if (bestProject == undefined)
                                {
                                    response.json({status: 'err', error: 'You have responded to all projects!'})
                                }
                                else
                                {
                                    response.json({
                                        project: bestProject,
                                        similarities: bestProjectSimilarities
                                    })
                                }
                            }
                        })
                    }
                })
            }
            else
            {
                console.log('Authorisation error for user ' + request.body.userid + ' ; Token received - ' + request.body.secretuserid)
                response.json({status: 'err', error: 'Authorisation error'})
            }
        })
    }
    catch(err)
    {
        console.log('/api/getproject Error occured!')
        console.log(err)
        response.json({status: 'err', error: err})
    }
})

function checkIfSuitable(responses, projectId) {
    var answer = true
    for (curResponse of responses)
    {
        if (curResponse.projectid == projectId)
        {
            answer = false
        }
    }
    return answer
}

function findSimilarities(array1, array2) {
    let count = 0
    array1.forEach((value1) => {
        array2.forEach((value2 => {
            if (value1 === value2)
                count++
        }))
    })
    return count
}

app.use('/app/projects/edit/*', express.static('public/app/projects/edit/index.html'))
app.use('/app/projects/*', express.static('public/app/projects/projectpage.html'))
app.use('/app/profile/*', express.static('public/app/profile/userpage.html'))


//admin panel


app.get('/supersecretadminpanel/api/enable2auth', (request, response) => {
    if (!admin2authenabled)
    {
        const url = 'https://www.authenticatorapi.com/pair.aspx?AppName=Naos%20admin&AppInfo=' + securedata.admins.name + '&SecretCode=' + securedata.admins.name
        fetch(url)
            .then(authresponse => {response.send(authresponse)})
    }
    else
        response.send('Already enabled!')
})

app.post('/supersecretadminpanel/api/login', (request, response) => {

})