let Btn = document.getElementById('btn');
let BtnS = document.getElementById('btnS');

let URLip = document.querySelector('.URLinput');
let yts = document.querySelector('.ytSearch');
let select = document.querySelector('.opt');
let serverURL = 'https://damp-island-47659.herokuapp.com';

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




}
