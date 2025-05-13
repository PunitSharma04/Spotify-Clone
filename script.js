const cardContainer = document.querySelector(".cardContainer");
let playbutton = document.querySelector("#playpause");
let currentSong = new Audio();
let currentPath = "";
let activePlayButton = null;
const defaultSongPath = "./melody/Tu_hi_aashiqi/play.mp3";

//play songs
function playMusic(songPath, playbtn = null) {
    document.querySelector('.track').innerHTML = songPath.split('/')[2];

    const isSameSong = currentPath === songPath;

    if (isSameSong) {
        if (!currentSong.paused) {
            currentSong.pause();
            playbutton.src = "./images/playHolderimages/playpause.svg";
            if (activePlayButton) activePlayButton.src = "./images/playbutton.svg";
        } else {
            currentSong.play();
            playbutton.src = "./images/playHolderimages/pause.svg";
            if (activePlayButton) activePlayButton.src = "./images/pausebutton.svg";
        }
    } else {
        currentSong.pause();
        currentSong.src = songPath;
        currentSong.load();
        currentSong.play();
        currentPath = songPath;
        playbutton.src = "./images/playHolderimages/pause.svg";

        if (activePlayButton) {
            activePlayButton.src = "./images/playbutton.svg";
        }

        if (playbtn) {
            playbtn.src = "./images/pausebutton.svg";
            activePlayButton = playbtn;
        } else {
            activePlayButton = null;
        }
    }
}

// main play pause button 
playbutton.addEventListener("click", () => {
    if (currentPath !== "") {
        playMusic(currentPath);
    }
    else {
        playMusic(defaultSongPath)
    }
});

// playlist 
let playlist = [
    "Angry_mood",
    "Bright_mood",
    "Chill_mood",
    "cs",
    "Dark_mood",
    "Diljit",
    "Funky_mood",
    "Karan_aujla",
    "Love_mood",
    "ncs",
    "Uplifting_mood",
];

playlist.forEach((path) => {
    fetch(`./songs/${path}/info.json`)
        .then((response) => response.json())
        .then((data) => {
            const card = document.createElement("div");
            card.classList.add("card");

            const image = document.createElement("div");
            image.classList.add("image");

            const cover = document.createElement("div");
            cover.classList.add("cover");

            const play = document.createElement("div");
            play.classList.add("play");

            let playbtn = document.createElement("img");
            playbtn.src = "./images/playbutton.svg";
            playbtn.alt = "play";

            const coverimage = document.createElement("img");
            coverimage.src = `./songs/${path}/cover.jpg`;
            coverimage.alt = data.title;

            const title = document.createElement("h2");
            title.textContent = data.title;

            const desc = document.createElement("p");
            desc.textContent = data.description;

            cover.appendChild(coverimage);
            image.appendChild(cover);
            image.appendChild(play);
            play.appendChild(playbtn);
            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(desc);
            cardContainer.appendChild(card);

            let songPath = `./songs/${path}/play.mp3`;

            play.addEventListener("click", () => {
                playMusic(songPath, playbtn);
            });
        })
        .catch((error) => {
            console.error(`Error loading info.json for ${path}:`, error);
        });
});

// liked songs 
const songs = document.querySelector(".songs");
let likedPlaylist = ["Tu_hi_aashiqi", "Tu_itni_khoobsurat"];
let ul = document.createElement("ul");
songs.appendChild(ul);

function likedSongs() {
    likedPlaylist.forEach((song) => {
        fetch(`./melody/${song}/info.json`)
            .then((response) => response.json())
            .then((data) => {
                const cover = data.cover;
                const title = data.title;
                let artist = data.artists.join(", ");

                let li = document.createElement("li");
                let text = document.createElement("div");

                let coverImage = document.createElement("div");
                coverImage.classList.add("coverImage");
                coverImage.innerHTML = cover;

                li.appendChild(coverImage);
                li.appendChild(text);

                let name = document.createElement("div");
                name.classList.add("singer");
                name.textContent = title;

                let description = document.createElement("div");
                description.classList.add("description");
                description.textContent = artist;

                text.appendChild(name);
                text.appendChild(description);
                ul.appendChild(li);

                let songPath = `./melody/${song}/play.mp3`;

                li.addEventListener("click", () => {
                    playMusic(songPath);
                });
            })
            .catch((error) => {
                console.error(`Error loading info.json for liked song ${song}:`, error);
            });
    });
}

likedSongs();


// duration and seekbar
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


currentSong.addEventListener("timeupdate", () => {
    const currentFormatted = formatTime(currentSong.currentTime);
    const durationFormatted = formatTime(currentSong.duration);
    document.querySelector('.duration').innerHTML = `${currentFormatted} / ${durationFormatted}`;

    if (!isNaN(currentSong.duration)) {
        const percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector('.circle').style.left = percent + "%";
        document.querySelector('.progress').style.width = percent + "%";
    }
});

document.querySelector('.seekbar').addEventListener('click', (e) => {
    const seekbar = e.currentTarget;
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;

    if (!isNaN(currentSong.duration)) {
        currentSong.currentTime = percent * currentSong.duration;
    }

    document.querySelector('.circle').style.left = (percent * 100) + "%";
    document.querySelector('.progress').style.width = (percent * 100) + "%";
});

//repeat 

let isRepeat = false
let repeat = document.querySelector('#repeat');
repeat.addEventListener('click', () => {
    isRepeat = !isRepeat
    currentSong.loop = isRepeat
    if (isRepeat) {
        repeat.src = "./images/playHolderImages/repeat1.svg"
    }
    else {
        repeat.src = "./images/playHolderImages/repeat.svg"
    }
})

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = `${0 + "%"}`
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = `${-100 + "%"}`
})
document.querySelector(".showVolume img").addEventListener("click", () => {
    document.querySelector(".volume_play").style.display = block;
})


//previous and next button

document.querySelector("#previous").addEventListener('click', () => {
    let nowPLaying = currentPath.split('/')[2]
    console.log(nowPLaying)
    let index = playlist.indexOf(nowPLaying);
    let songPath;

    if (index !== -1) {
        if (index === 0) {
            return
        }
        songPath = `./songs/${playlist[index - 1]}/play.mp3`;
        playMusic(songPath)
    } else {
        index = likedPlaylist.indexOf(nowPLaying);
        if (index === 0) {
            return
        }
        songPath = `./melody/${likedPlaylist[index - 1]}/play.mp3`;
        playMusic(songPath)
    }
})


document.querySelector("#next").addEventListener('click', () => {
    let nowPLaying = currentPath.split('/')[2]
    console.log(nowPLaying)
    let index = playlist.indexOf(nowPLaying);
    let songPath;

    if (index !== -1) {
        if (index === playlist.length - 1) {
            return
        }
        songPath = `./songs/${playlist[index + 1]}/play.mp3`;
        playMusic(songPath)
    } else {
        index = likedPlaylist.indexOf(nowPLaying);
        if (index === likedPlaylist.length - 1) {
            return
        }
        songPath = `./melody/${likedPlaylist[index + 1]}/play.mp3`;
        playMusic(songPath)
    }
})

// volume button

const volumeSlider = document.querySelector('.volume_play ul li input[type="range"]');
const volumeButton = document.querySelector('#volumeButton');

volumeSlider.addEventListener('change', (e) => {
    currentSong.volume = parseFloat(e.target.value) / 100;
});


volumeButton.addEventListener('click', () => {
    if (currentSong.volume > 0) {
        currentSong.oldVolume = currentSong.volume; 
        currentSong.volume = 0;
        volumeSlider.value = 0;
        volumeButton.src="./images/playHolderImages/mute.svg"
    } else {
        currentSong.volume = currentSong.oldVolume || 1;
        volumeSlider.value = currentSong.volume * 100;
        volumeButton.src="./images/playHolderImages/volume.svg"
    }
});




