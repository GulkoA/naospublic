const availabletagsbox = document.getElementById('availabletagsbox')
const chosentagsbox = document.getElementById('chosentagsbox')
const projectid = window.location.pathname.substring(19)
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
console.log(json)
const message = document.getElementById('message')
fetch('/api/getprojectinfo', json)
    .then(response => {
        return response.json()
    })
    .then(json => {
      console.log(json)
      if (json.status == 'err')
        message.innerText = json.error
      else if (!json.author)
      {
        document.getElementById('message').textContent =  'Oops! Only author can edit this project!'
        document.getElementById('inputName').disabled = true
        document.getElementById('inputDiscription').disabled = true
      }
      else
      {
        console.log(json)
        document.getElementById('saveButton').disabled = false
        document.getElementById('inputName').value = json.name
        document.getElementById('inputDiscription').value = json.discription
        document.getElementById('inputSecretMessage').value = json.secretmessage
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
                  console.log(json)
                  json.tags.forEach(function(value) {
                      displayTagInChosen(value)
                      if (value.childtagsid != undefined)
                      {
                        const jsonfortags2 = {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              childtagsid: value.childtagsid
                            })
                          }
                        fetch('/api/getspecifictags', jsonfortags2)
                          .then(response => {
                              return response.json()
                          })
                          .then(json => {
                              console.log(json)
                              json.tags.forEach(function(value) {
                                if (chosentags.find(element => element == value._id) == undefined)
                                  displayTag(value)
                              })
                          })
                      }
                  })
              })
      }

        fetch('/api/gettags')
          .then(response => {
              return response.json()
          })
          .then(json => {
              json.parenttags.forEach(function(value) {
                  if (chosentags.find(element => element == value._id) == undefined)
                    displayTag(value)
              })
          })
      }
    }) 

    document.getElementById('cancelButton').onclick = () => {
      window.location.href = '/app/projects/' + projectid
    }

    document.getElementById('saveButton').onclick = () => {
      const json = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: getCookie('userid'),
            secretuserid: getCookie('secretuserid'),
            projectid: projectid,
            name: document.getElementById('inputName').value,
            discription: document.getElementById('inputDiscription').value,
            secretmessage: document.getElementById('inputSecretMessage').value,
            chosentags: chosentags
        })
    }
    console.log(json.body)
    fetch('/api/updateproject', json)
      .then(response => {
        return response.json()
      })
      .then(json => {
        if (json.status == 'err')
          message.innerText = json.error
        else
          message.innerText = 'Successfully saved!'
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

function displayTagInChosen(tag) {
  const newButton = document.createElement('button')
  newButton.className = 'btn btn-success ms-2'
  newButton.type = 'button'
  newButton.innerText = tag.name
  newButton.id = tag._id
  tag.childsnotadded = false
  newButton.setAttribute('data-tag', JSON.stringify(tag))
  newButton.addEventListener('click', moveToAvailable)
  chosentagsbox.appendChild(newButton)
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