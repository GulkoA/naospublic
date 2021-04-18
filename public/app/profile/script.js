const chosentagsbox = document.getElementById('chosentagsbox')
var chosentags = []

if (getCookie('userid') != "loggedout")
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

  fetch('/api/getuserinfoauthorised', json)
      .then(response => {
          return response.json()
      })
      .then(json => {
          console.log(json)
          document.getElementById('editbutton').disabled = false
          document.getElementById('logoutbutton').disabled = false
          document.getElementById('editbutton').onclick = () => {window.location.href = '/app/profile/edit'}
          document.getElementById('loadingIcon').innerHTML = ''
          document.getElementById('pageTitle').innerText = json.firstname + ' ' + json.lastname + ' - Naos'
          document.getElementById('nameTitle').innerText = json.firstname + ' ' + json.lastname
          document.getElementById('profilePic').src = json.accountpicurl
          document.getElementById('discription').innerText = json.discription
          chosentags = json.chosentags
          document.getElementById('logoutbutton').onclick = () => {

            document.cookie = "userid=" + "loggedout" + "; path=/" 
            document.cookie = "secretuserid=" + "loggedout" + "; path=/"
            window.location.href = '/app/login'
          }

          
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
}
else
  window.location.href = '/app/login'


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