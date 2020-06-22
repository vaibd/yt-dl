let Btn = document.getElementById('btn');
let BtnS = document.getElementById('btnS');

let URLip = document.querySelector('.URLinput');
let yts = document.querySelector('.ytSearch');
let select = document.querySelector('.opt');
let serverURL = 'https://damp-island-47659.herokuapp.com';
let prefix = 'https://www.googleapis.com/youtube/v3/search?maxResults=1&q=';
let midSearch = yts.value;
let suffix = '&key=AIzaSyCb5HvziFBD0_zKvL6LXNFHbYi1YyTSmbw';




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

// var qwe = 'https://www.googleapis.com/youtube/v3/search?maxResults=1&q=linkin park in the end&key=AIzaSyCb5HvziFBD0_zKvL6LXNFHbYi1YyTSmbw';
var qwe = `https://www.googleapis.com/youtube/v3/search?maxResults=1&q=${midSearch}&key=AIzaSyCb5HvziFBD0_zKvL6LXNFHbYi1YyTSmbw`;

   


fetch(qwe)
    .then(res => res.json())
    .then((out) => {
     
        
         var text = out.items[0].id.videoId;
         console.log(text);
        
        
}).catch(err => console.error(err));


}

console.log(midSearch);




