const projectid = window.location.pathname.substring(14)
const nameTitle = document.getElementById('nameTitle')
const discription = document.getElementById('discription')
const message = document.getElementById('message')
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const pageTitle = document.getElementById('pageTitle')
const titleBadge = document.getElementById('titleBadge')
const author = document.getElementById('author')
const secretmessage = document.getElementById('secretmessage')
var chosentags = []
const json = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userid: getCookie('userid'),
        secretuserid: getCookie('secretuserid'),
        projectid: projectid
    })
}

fetch('/api/getprojectinfo', json)
    .then(response => {return response.json()})
    .then(json => {
        console.log(json)
        if (json.status == 'err')
        {
            console.log('Error! ' + json.error)
            nameTitle.textContent = 'Error!'
            message.textContent = json.error
            button1.setAttribute('class', 'invisible')
            button2.setAttribute('class', 'invisible')

        }
        else
        {
            nameTitle.textContent = json.name
            discription.textContent = json.discription
            pageTitle.textContent = json.name + ' - Naos'
            secretmessage.textContent = json.secretmessage

            if (json.author)
            {                
                button1.textContent = 'Edit'
                button1.disabled = false
                button1.onclick = () => {window.location.href = '/app/projects/edit/' + projectid}
                secretmessage.textContent = json.secretmessage

                if (json.published)
                {
                    button2.textContent = 'Unpublish'
                    titleBadge.setAttribute('class', 'badge bg-success')
                    titleBadge.textContent = 'published'
                }
                else
                {
                    button2.textContent = 'Publish'
                    titleBadge.textContent = 'unpublished'
                }

                button2.onclick = () => {
                    changeprojectpublishstatus(!json.published)
                }
                button2.disabled = false

                if (json.responses.length < 1)
                {
                    const messageTitle = document.createElement('h4')
                    messageTitle.textContent = 'No candidates at the moment'
                    document.getElementById('candidatestable').appendChild(messageTitle)
                }

                if (json.participant.length < 1)
                {
                    const messageTitle = document.createElement('h4')
                    messageTitle.textContent = 'No candidates at the moment'
                    document.getElementById('participantstable').appendChild(messageTitle)
                }

                json.responses.forEach(personid => {
                fetchPerson(personid, person => {

                    var personRow = document.getElementById('candidatestable').insertRow(0)
                    personRow.classList = 'form-control'
                    const personCell = personRow.insertCell(0)
                    personCell.classList = 'container'
                    const personButtonsCell = personRow.insertCell(1)
        
                    const personSuperDiv = document.createElement('div')
                    personSuperDiv.classList = 'row align-items-start'
                    personCell.appendChild(personSuperDiv)
        
                    const personPic = document.createElement('img')
                    personPic.classList = 'col-3 rounded'
                    personPic.src = person.accountpicurl
                    personPic.width = 100
                    personSuperDiv.appendChild(personPic)
        
                    const personDiv = document.createElement('div')
                    personDiv.classList = 'col'
                    
                    const personTitle = document.createElement('h3')
                    personTitle.textContent = person.firstname + ' ' + person.lastname
                    personDiv.appendChild(personTitle)
        
                    const personDiscription = document.createElement('p')
                    personDiscription.classList = 'h5'
                    personDiscription.textContent = person.discription
                    personDiv.appendChild(personDiscription)
        
                    const viewpersonPageButton = document.createElement('button')
                    viewpersonPageButton.textContent = 'View full profile'
                    viewpersonPageButton.onclick = () => {window.location.href = '/app/profile/' + personid}
                    viewpersonPageButton.classList = 'btn btn-outline-primary'
        
                    personDiv.appendChild(viewpersonPageButton)
        
                    personSuperDiv.appendChild(personDiv)

                    const acceptButton = document.createElement('button')
                    acceptButton.textContent = 'Accept'
                    acceptButton.onclick = () => {sendResponse(personid, true)}
                    acceptButton.classList = 'btn btn-success my-1'
                    personButtonsCell.appendChild(acceptButton)

                    personButtonsCell.appendChild(document.createElement('br'))

                    const declineButton = document.createElement('button')
                    declineButton.textContent = 'Decline'
                    declineButton.onclick = () => {sendResponse(personid, false)}
                    declineButton.classList = 'btn btn-danger btn-success my-1'
                    personButtonsCell.appendChild(declineButton)
                })
                })

                json.participantsid.forEach(personid => {
                    fetchPerson(personid, person => {
    
                        var personRow = document.getElementById('participantstable').insertRow(0)
                        personRow.classList = 'form-control'
                        const personCell = personRow.insertCell(0)
                        personCell.classList = 'container'
                        const personButtonsCell = personRow.insertCell(1)
            
                        const personSuperDiv = document.createElement('div')
                        personSuperDiv.classList = 'row align-items-start'
                        personCell.appendChild(personSuperDiv)
            
                        const personPic = document.createElement('img')
                        personPic.classList = 'col-3 rounded'
                        personPic.src = person.accountpicurl
                        personPic.width = 100
                        personSuperDiv.appendChild(personPic)
            
                        const personDiv = document.createElement('div')
                        personDiv.classList = 'col'
                        
                        const personTitle = document.createElement('h3')
                        personTitle.textContent = person.firstname + ' ' + person.lastname
                        personDiv.appendChild(personTitle)
            
                        const personDiscription = document.createElement('p')
                        personDiscription.classList = 'h5'
                        personDiscription.textContent = person.discription
                        personDiv.appendChild(personDiscription)
            
                        const viewpersonPageButton = document.createElement('button')
                        viewpersonPageButton.textContent = 'View full profile'
                        viewpersonPageButton.onclick = () => {window.location.href = '/app/profile/' + personid}
                        viewpersonPageButton.classList = 'btn btn-outline-primary'
            
                        personDiv.appendChild(viewpersonPageButton)
            
                        personSuperDiv.appendChild(personDiv)
                    })
                    })
            }
            else if (json.participant)
            {
                titleBadge.setAttribute('class', 'badge bg-success')
                    titleBadge.textContent = 'participant'

                button1.setAttribute('class', 'invisible')
                button2.setAttribute('class', 'invisible')


                document.getElementById('candidatesbox').setAttribute('class', 'invisible')

                if (json.participant.length < 1)
                {
                    const messageTitle = document.createElement('h4')
                    messageTitle.textContent = 'No candidates at the moment'
                    document.getElementById('participantstable').appendChild(messageTitle)
                }

                json.participantsid.forEach(personid => {
                    fetchPerson(personid, person => {
    
                        var personRow = document.getElementById('participantstable').insertRow(0)
                        personRow.classList = 'form-control'
                        const personCell = personRow.insertCell(0)
                        personCell.classList = 'container'
                        const personButtonsCell = personRow.insertCell(1)
            
                        const personSuperDiv = document.createElement('div')
                        personSuperDiv.classList = 'row align-items-start'
                        personCell.appendChild(personSuperDiv)
            
                        const personPic = document.createElement('img')
                        personPic.classList = 'col-3 rounded'
                        personPic.src = person.accountpicurl
                        personPic.width = 100
                        personSuperDiv.appendChild(personPic)
            
                        const personDiv = document.createElement('div')
                        personDiv.classList = 'col'
                        
                        const personTitle = document.createElement('h3')
                        personTitle.textContent = person.firstname + ' ' + person.lastname
                        personDiv.appendChild(personTitle)
            
                        const personDiscription = document.createElement('p')
                        personDiscription.classList = 'h5'
                        personDiscription.textContent = person.discription
                        personDiv.appendChild(personDiscription)
            
                        const viewpersonPageButton = document.createElement('button')
                        viewpersonPageButton.textContent = 'View full profile'
                        viewpersonPageButton.onclick = () => {window.location.href = '/app/profile/' + personid}
                        viewpersonPageButton.classList = 'btn btn-outline-primary'
            
                        personDiv.appendChild(viewpersonPageButton)
            
                        personSuperDiv.appendChild(personDiv)
                    })
                    })
            }
            else
            {
                document.getElementById('candidatesbox').setAttribute('class', 'invisible')
                document.getElementById('participantstable').setAttribute('class', 'invisible')

                button1.setAttribute('class', 'invisible')

                button2.textContent = 'Ask to join'
                button2.onclick = () => {askToJoin(true)}
                button2.disabled = false
            }

            chosentags = json.chosentags
            if (chosentags.length > 0)
            {
                const jsonfortags = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        childtagsid: chosentags
                    })
                    }
        
                fetch('/api/getspecifictags', jsonfortags)
                .then(response => {
                    return response.json()
                })
                .then(json => {
                    if (json.status == 'err')
                    console.log(json.error)
                    else
                    {
                        console.log(json)
                        json.tags.forEach(function(value) {
                        displayTag(value)
                    })
                    }
                })
            }
            else
            {
                document.getElementById('tagsboxbig').innerHTML = ''
            }

            const jsonforuser = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: json.authorid
                })
                }

            fetch('/api/getuserinfo', jsonforuser)
                .then(response => {
                    return response.json()
                })
                .then(jsonres => {
                    author.textContent = 'by ' + jsonres.firstname + ' ' + jsonres.lastname
                    author.setAttribute('href', ('/app/profile/' + json.authorid))
                })
        }
    })

function fetchPerson(personid, callback){
    const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: personid
        })
    }
    
  
    fetch('/api/getuserinfo', json)
        .then(response => {
            return response.json()
        })
        .then(json => {
            callback(json)
            return json
        })
}

function askToJoin(state) {
    const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: getCookie('userid'),
            projectid: projectid,
            state: state
        })
    }
  
    fetch('/api/newresponsebyuser', json)
        .then(response => {
            return response.json()
        })
        .then(json => {
            console.log(json)
            window.location.reload()
        })
}

function sendResponse(userid, authorresponse)  {
    const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: userid,
            projectid: projectid,
            authorresponse: authorresponse
        })
    }
  
    fetch('/api/newresponsebyauthor', json)
        .then(response => {
            return response.json()
        })
        .then(json => {
            console.log(json)
            window.location.reload()
        })
}
    

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function changeprojectpublishstatus(newstate) {
      const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: getCookie('userid'),
            secretuserid: getCookie('secretuserid'),
            projectid: projectid,
            published: newstate
        })
      }
      console.log(json)
      fetch('/api/changeprojectpublishstatus', json)
        .then(request => {
            return request.json()
        })
        .then(json => {
            if (status == 'err')
                console.log(json)
            window.location.reload()
        })
  }

  function displayTag(tag) {
    const newButton = document.createElement('p')
    newButton.className = 'btn btn-success ms-2'
    newButton.type = 'button'
    newButton.innerText = tag.name
    newButton.id = tag._id
    chosentagsbox.appendChild(newButton)
}