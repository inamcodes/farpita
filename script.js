(() => {
    const audio = document.getElementById('audio');
    const playIcon = document.getElementById('play');
    const playContainer = document.getElementById('play-container');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackImage = document.getElementById('track-image');
    const playlistEl = document.getElementById('playlist');
    const repeatBtn = document.getElementById('repeat');
    const shuffleBtn = document.getElementById('shuffle');

    // Pre-generated list of files (edit to match files in folder)
    const songs = [
        { name: 'Bhit Ja Bhitai', artist: 'Bilal', file: 'Bhit Ja Bhitai  WAJD  The Sindhi Chapter  Official Music Video.mp3', cover: 'pizza.webp' },
        { name: 'Chhod Diya Wo Raasta', artist: 'Unknown', file: 'Chhod_Diya_Wo_Raasta_Jis_Raste_Se_Tum_The_Gujre__Arijit_singh_Song__Sad_Song_Mx_Musica(256k).mp3', cover: 'pizza.webp' },
        { name: 'Hadiqa Kiani - Kamli', artist: 'Lofi Girl', file: 'Hadiqa_Kiani___Kamli___WAJD___Bulleh_Shah___Chapter_4___Official_Music_Video(360p).mp3', cover: 'pizza.webp' },
        { name: 'Main Naraye Mastana', artist: 'Abida Parveen', file: 'Main_Naraye_Mastana_-_Abida_Parveen___Sufi_Kalaam___Times_Music_Spiritual(128k).m4a.mp3', cover: 'pizza.webp' },
        { name: 'Kahani Suno 2.0', artist: 'Kaifi Khalil', file: 'Kahani Suno 2.0 - Kaifi Khalil (Official Music Video).mp3', cover: 'pizza.webp' },
        { name: 'Mast Jawani Teri', artist: 'Tina_Praveen', file: 'Mast_Jawani_Teri_Mujhko_Pagal_Kare_Re__Ashok_Zakhmi_Muqabla_Tina_Praveen__Audio_Musicraft(256k).mp3', cover: 'pizza.webp' }
    ];

    let songIndex = 0;
    let isRepeating = false;
    let isShuffling = false;

    function loadSong(index) {
        const s = songs[index];
        titleEl.innerText = s.name;
        artistEl.innerText = s.artist ? `${s.artist} - Audio Library` : 'Unknown';
        audio.src = s.file;
        trackImage.src = s.cover || 'cover1.jpg';
        highlightPlaylist(index);
    }

    function playToggle() {
        if (audio.paused) {
            audio.play();
            playIcon.classList.replace('ri-play-fill', 'ri-pause-fill');
        } else {
            audio.pause();
            playIcon.classList.replace('ri-pause-fill', 'ri-play-fill');
        }
    }

    function prevSong() {
        if (isShuffling) {
            songIndex = Math.floor(Math.random() * songs.length);
        } else {
            songIndex = (songIndex - 1 + songs.length) % songs.length;
        }
        loadSong(songIndex);
        audio.play();
        playIcon.classList.replace('ri-play-fill', 'ri-pause-fill');
    }

    function nextSong() {
        if (isShuffling) {
            songIndex = Math.floor(Math.random() * songs.length);
        } else {
            songIndex = (songIndex + 1) % songs.length;
        }
        loadSong(songIndex);
        audio.play();
        playIcon.classList.replace('ri-play-fill', 'ri-pause-fill');
    }

    // Update progress bar and time
    audio.addEventListener('timeupdate', (e) => {
        const { currentTime, duration } = e.target;
        if (duration && !isNaN(duration)) {
            const percent = (currentTime / duration) * 100;
            progress.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(currentTime);
        }
    });

    // Show duration once metadata loads
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // When song ends
    audio.addEventListener('ended', () => {
        if (isRepeating) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextSong();
        }
    });

    // Seek on click
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const ratio = x / rect.width;
        if (audio.duration) {
            audio.currentTime = ratio * audio.duration;
        }
    });

    // Buttons
    playContainer.addEventListener('click', playToggle);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    repeatBtn.addEventListener('click', () => {
        isRepeating = !isRepeating;
        repeatBtn.style.opacity = isRepeating ? '1' : '0.7';
    });
    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.style.opacity = isShuffling ? '1' : '0.7';
    });

    // Playlist rendering + click to play
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((s, i) => {
            const li = document.createElement('li');
            li.textContent = `${s.name} — ${s.artist || 'Unknown'}`;
            li.dataset.index = i;
            li.addEventListener('click', () => {
                songIndex = i;
                loadSong(i);
                audio.play();
                playIcon.classList.replace('ri-play-fill', 'ri-pause-fill');
            });
            playlistEl.appendChild(li);
        });
        highlightPlaylist(songIndex);
    }

    function highlightPlaylist(index) {
        Array.from(playlistEl.children).forEach((li, i) => {
            li.style.background = i === index ? 'rgba(255,255,255,0.06)' : 'transparent';
            li.style.fontWeight = i === index ? '600' : '400';
        });
    }

    function formatTime(sec) {
        if (!sec || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Initial setup
    renderPlaylist();
    loadSong(songIndex);
})();