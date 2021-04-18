
var prevScrollpos = window.pageYOffset;
var h = window.innerHeight;

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > h - 40 ) {
    document.getElementById("navbar").style.backgroundColor = "blanchedalmond";
  } else if (currentScrollPos < h-40) {
    document.getElementById("navbar").style.backgroundColor = "rgba(0,0,0,0)";
  }
}

document.getElementById('wrapper').onclick = () => {window.location.href = '/app/register'}