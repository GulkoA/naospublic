//fetching a card
if (getCookie('userid') == '' || getCookie('userid') == 'loggedout')
{
    window.location.href = '/app/login'
}
else
{
const json = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userid: getCookie('userid'),
        secretuserid: getCookie('secretuserid')
    })
}
var projectReceived;
fetch('/api/getproject', json)
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        if (json.status == 'err')
            document.getElementById('projectTitle').textContent = json.error
        else
        {
            console.log(json)
            projectReceived = json
            updateCard()
        }
    })

var chosentags = []

function updateCard() {
    //creating a project card
    document.getElementById('projectTitle').textContent = projectReceived.project.name
    document.getElementById('projectDiscription').textContent = projectReceived.project.discription
    document.getElementById('tagsboxlabel').textContent = 'Skill tags required (' + projectReceived.similarities + ' matches with you):'

    chosentags = projectReceived.project.tagsrequiredid
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


        fetchPerson(projectReceived.project.authorid, person => {

            var authorRow = document.getElementById('table').insertRow(1)
            authorRow.insertCell(0)
            var authorCell = authorRow.insertCell(1)
            authorCell.classList = 'form-control container'

            const authorSuperDiv = document.createElement('div')
            authorSuperDiv.classList = 'row align-items-start'
            authorCell.appendChild(authorSuperDiv)

            const authorPic = document.createElement('img')
            authorPic.classList = 'col-3 rounded'
            authorPic.src = person.accountpicurl
            authorPic.width = 100
            authorSuperDiv.appendChild(authorPic)

            const authorDiv = document.createElement('div')
            authorDiv.classList = 'col'
            
            const authorTitle = document.createElement('h3')
            authorTitle.textContent = 'by ' + person.firstname + ' ' + person.lastname
            authorDiv.appendChild(authorTitle)

            const authorDiscription = document.createElement('p')
            authorDiscription.classList = 'h5'
            authorDiscription.textContent = person.discription
            authorDiv.appendChild(authorDiscription)

            const viewAuthorPageButton = document.createElement('button')
            viewAuthorPageButton.textContent = 'View full profile'
            viewAuthorPageButton.onclick = () => {window.location.href = '/app/profile/' + projectReceived.project.authorid}
            viewAuthorPageButton.classList = 'btn btn-outline-primary'

            authorDiv.appendChild(viewAuthorPageButton)

            authorSuperDiv.appendChild(authorDiv)


            document.getElementById('nobutton').onclick = () => {
                sendResponse(false)
            }
            document.getElementById('yesbutton').onclick = () => {
                sendResponse(true)
            }
        })


}
}

function sendResponse(state) {
    const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: getCookie('userid'),
            projectid: projectReceived.project._id,
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

  function displayTag(tag) {
    const newButton = document.createElement('p')
    newButton.className = 'btn btn-success ms-2'
    newButton.type = 'button'
    newButton.innerText = tag.name
    newButton.id = tag._id
    document.getElementById('chosentagsbox').appendChild(newButton)
}