const availabletagsbox = document.getElementById('availabletagsbox')
const chosentagsbox = document.getElementById('chosentagsbox')
document.getElementById('loginbutton').onclick = () => {window.location.href = '/app/login'}

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
    newButton.className = 'btn btn-success m-1'
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



document.getElementById('registerButton').onclick = sendForm
function sendForm() {
    const Firstname = document.getElementById('inputFirstname').value
    const Lastname = document.getElementById('inputLastname').value
    const Email = document.getElementById('inputEmail').value
    const Password = document.getElementById('inputPassword').value
    const message = document.getElementById('message')
    if (Firstname == '' || Lastname == '' || Email == '' || Password == '')
    {
        message.innerText = 'Please fill all fields!'
    }
    else if (chosentags.length < 1)
    {
        message.innerText = 'Please choose al least one skill tag!'
    }
    else
    {
        const json = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: Firstname,
                lastname: Lastname,
                email: Email,
                password: Password,
                chosentags: chosentags
            })
        }
        message.innerText = ''
        fetch('/api/newuser', json)
            .then(response => {
                return response.json()
            })
            .then(json => {
                if (json.status === 'err')
                    message.innerText = json.err
                else if (json.status === 'suc')
                {
                    message.innerText = 'Successfully registered'
                    document.cookie = "userid=" + json.userid + "; path=/" 
                    document.cookie = "secretuserid=" + json.secretuserid + "; path=/"
                    window.location.href = '/app/profile'
                }
                else
                    message.innerText = 'Unexpected error occured!'
            })
    }
}