document.getElementById('createbutton').onclick = () => {window.location.href = '/app/projects/create'}
const cardbox = document.getElementById('cardbox')


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
fetch('/api/getuserinfoauthorised', json)
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        if (json.status == 'err')
        {
            console.error(json.error)
            document.getElementById('message').textContent = json.error
        }
        else if (json.projectsid == undefined || json.projectsid.length < 1)
        {
            document.getElementById('message').textContent = 'No projects found! Please create a new one or discover others\' projects'
        }
        else
        {
            console.log(json)
            json.projectsid.forEach(project => {
                addProjectCard(project)
            })
        }
    })


function addProjectCard(projectid) {
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
                document.getElementById('message').textContent = json.error
            }
            else
            {
                console.log(json)

                const cardCol = document.createElement('div')
                cardCol.classList = 'col'
                const card = document.createElement('div')
                card.classList = 'card p-2'
                card.setAttribute('style', 'width: 18rem;')
                cardCol.appendChild(card)
                
                const cardTitle = document.createElement('h5')
                cardTitle.classList = 'card-title'
                cardTitle.textContent = json.name
                card.appendChild(cardTitle)

                const cardSubTitle = document.createElement('h6')
                cardSubTitle.classList = 'card-subtitle mb-2 text-muted'

                if (json.author)
                {
                    cardSubTitle.textContent = 'by you'
                }
                else
                {
                    const personLink = document.createElement('a')
                    fetchPerson(json.authorid, person => {
                        personLink.textContent = 'by ' + person.firstname + ' ' + person.lastname
                        personLink.href = '/app/profile/' + json.authorid
                    })
                    cardSubTitle.appendChild(personLink)
                }
                card.appendChild(cardSubTitle)

                const cardText = document.createElement('p')
                cardText.className = 'card-text'
                cardText.textContent = json.discription
                card.appendChild(cardText)

                const cardLink = document.createElement('a')
                cardLink.classList = 'card-link'
                cardLink.href = '/app/projects/' + projectid
                cardLink.textContent = 'Go to project page'
                card.appendChild(cardLink)


                cardbox.appendChild(cardCol)
            }
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


function notifyMe() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("Hi there!");
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Hi there!");
        }
      });
    }
  }
