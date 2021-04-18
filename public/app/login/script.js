document.getElementById('loginbutton').onclick = sendForm
document.getElementById('registerbutton').onclick = () => {window.location.href = '/app/register'}
function sendForm() {
    const Email = document.getElementById('inputEmail').value
    const Password = document.getElementById('inputPassword').value
    const message = document.getElementById('message')
    if (Email == '' || Password == '')
    {
        message.innerText = 'Please fill all fields!'
    }
    else
    {
        const json = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: Email,
                password: Password   
            })
        }
        message.innerText = ''
        fetch('/api/login', json)
            .then(response => {
                return response.json()
            })
            .then(json => {
                if (json.status === 'err')
                    message.innerText = json.err
                else if (json.status === 'suc')
                {
                    message.innerText = 'Successfully logged in!'
                    document.cookie = "userid=" + json.userid + "; path=/" 
                    document.cookie = "secretuserid=" + json.secretuserid + "; path=/"
                    window.location.href = '/app/profile'
                }
                else
                    message.innerText = 'Unexpected error occured!'
            })
    }
}