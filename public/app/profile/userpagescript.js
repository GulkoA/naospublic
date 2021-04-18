const userid = window.location.pathname.substring(13)
console.log(userid)
const chosentagsbox = document.getElementById('chosentagsbox')
var chosentags = []

const json = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userid: userid
      })
  }

  fetch('/api/getuserinfo', json)
      .then(response => {
          return response.json()
      })
      .then(json => {
          document.getElementById('loadingIcon').innerHTML = ''
          document.getElementById('pageTitle').innerText = json.firstname + ' ' + json.lastname + ' - Naos'
          document.getElementById('nameTitle').innerText = json.firstname + ' ' + json.lastname
          document.getElementById('profilePic').src = json.accountpicurl
          document.getElementById('discription').innerText = json.discription
          chosentags = json.chosentags
          
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
  
      })

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
            chosentagsbox.appendChild(newButton)
        }