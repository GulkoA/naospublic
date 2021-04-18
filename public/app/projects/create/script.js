document.getElementById('cancelButton').onclick = () => {
    window.location.href = '/app/projects'
}

document.getElementById('saveButton').onclick = () => {
    const inputProjectName = document.getElementById('inputProjectName').value
    const inputDiscription = document.getElementById('inputDiscription').value
    const inputSecretMessage = document.getElementById('inputSecretMessage').value
    if (inputProjectName == '' || inputDiscription == '' || inputSecretMessage == '')
    {
        document.getElementById('message').textContent = 'Please fill all fields!'
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
                secretuserid: getCookie('secretuserid'),
                projectname: inputProjectName,
                discription: inputDiscription,
                secretmessage: inputSecretMessage,
                tagsrequiredid: chosentags,
                publish: document.getElementById('publishCheckbox').checked
            })
        }
            fetch('/api/newproject', json)
                .then(response => {
                    return response.json()
                })
                .then(json => {
                    if(json.status == 'err')
                        document.getElementById('message').textContent = json.error
                    else
                    {
                        document.getElementById('message').textContent = 'Successfully created!'
                        window.location.href = '/app/projects/' + json.projectid
                    }

                })
    }
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

  const availabletagsbox = document.getElementById('availabletagsbox')
const chosentagsbox = document.getElementById('chosentagsbox')

fetch('/api/gettags')
    .then(response => {
        return response.json()
    })
    .then(json => {
        json.parenttags.forEach(function(value) {
            displayTag(value)
        })
    })
var chosentags = []

function displayTag(tag) {
    const newButton = document.createElement('button')
    newButton.className = 'btn btn-success m-2'
    newButton.type = 'button'
    newButton.innerText = tag.name
    newButton.id = tag._id
    tag.childsnotadded = true
    newButton.setAttribute('data-tag', JSON.stringify(tag))
    newButton.addEventListener('click', moveToChosen)
    availabletagsbox.appendChild(newButton)
}

function moveToChosen(event) {
    const button = event.target
    button.removeEventListener('click', moveToChosen)
    button.addEventListener('click', moveToAvailable)
    chosentagsbox.appendChild(button)
    chosentags.push(button.id)
    const tagdata = JSON.parse(button.getAttribute('data-tag'))
    if (tagdata.childsnotadded && tagdata.childtagsid != undefined)
    {
        const json = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: button.getAttribute('data-tag')
        }
        fetch('/api/getspecifictags', json)
            .then(response => {
                return response.json()
            })
            .then(json => {
                console.log(json)
                json.tags.forEach(function(value) {
                    displayTag(value)
                })
            })
            tagdata.childsnotadded = false
            button.setAttribute('data-tag', JSON.stringify(tagdata))
    }
}

function moveToAvailable(event) {
    const button = event.target
    button.removeEventListener('click', moveToAvailable)
    button.addEventListener('click', moveToChosen)
    availabletagsbox.appendChild(button)
    chosentags = chosentags.filter((value) => {
        return value != button.id
    })
}