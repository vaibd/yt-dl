let BtnS = document.getElementById('btnS');
let yts = document.querySelector('.ytSearch');




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
