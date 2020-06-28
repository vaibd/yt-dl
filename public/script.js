let Btn = document.getElementById('btn');
let BtnS = document.getElementById('btnS');

let URLip = document.querySelector('.URLinput');
let yts = document.querySelector('.ytSearch');
let select = document.querySelector('.opt');
let serverURL = 'http://localhost:3000';


Btn.addEventListener('click', () => {
	if (!URLip.value) {
		alert('Enter YouTube URL');
	} else {
		if (select.value == 'mp3') {
			redirectMp3(URLip.value);
		} else if (select.value == 'mp4') {
			redirectMp4(URLip.value);
		}
		
	}
});

function redirectMp3(query) {
	window.location.href = `${serverURL}/downloadmp3?url=${query}`;
	document.getElementById('heading').innerHTML = 'File Should be Downloading now';
    document.getElementById("stat").value = yts.value;
}

function redirectMp4(query) {
	window.location.href = `${serverURL}/downloadmp4?url=${query}`;
}


 
BtnS.addEventListener('click', () => {
    
    if (!yts.value) {
		alert('Enter song name');
	} else {		
        redirectSong();
	}
    

});


function redirectSong(){
    
document.getElementById('heading').innerHTML = 'Playing';
document.getElementById("player").src = "https://www.youtube.com/embed?listType=search&list=" + yts.value ;
let midSearch = yts.value;
var qwe =  `https://www.googleapis.com/youtube/v3/search?maxResults=1&q=${midSearch}&key=AIzaSyCJwoAW9Xmi3IMQeDNfC2f_N9DGUqTieOE`;
console.log(midSearch);
console.log(qwe);
fetch(qwe)
    .then(res => res.json())
    .then((out) => {
         var text = 'https://www.youtube.com/watch?v=' + out.items[0].id.videoId;
         console.log(text);
         
         document.getElementById("dlSr").value = text;
         document.getElementById("stat").value = yts.value;
         
}).catch(err => console.error(err));
}






