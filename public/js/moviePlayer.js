document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('movieVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = muteBtn.querySelector('i');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTime = document.getElementById('currentTime');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const videoControls = document.getElementById('videoControls');

    let isPlaying = false;
    let isMuted = false;
    let controlsTimeout;

    // Play/Pause functionality
    const togglePlay = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    video.addEventListener('play', () => {
        isPlaying = true;
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    });

    video.addEventListener('pause', () => {
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    });

    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Mute functionality
    const toggleMute = () => {
        video.muted = !video.muted;
        isMuted = video.muted;
        updateMuteButton();
        if (video.muted) {
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = video.volume;
        }
    };

    const updateMuteButton = () => {
        muteIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
        muteIcon.classList.add(isMuted ? 'fa-volume-mute' : 'fa-volume-up');
    };

    muteBtn.addEventListener('click', toggleMute);

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value);
        video.volume = volume;
        video.muted = volume === 0;
        isMuted = video.muted;
        updateMuteButton();
    });

    // Time and progress bar
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    video.addEventListener('timeupdate', () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progress.style.width = percentage + '%';
        currentTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    // Click on progress bar to seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
        video.currentTime = pos * video.duration;
    });

    // Fullscreen functionality
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Show/hide controls on mouse movement
    const showControls = () => {
        videoControls.classList.remove('opacity-0');
        document.body.style.cursor = 'default';
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(hideControls, 3000);
    };

    const hideControls = () => {
        if (!video.paused) {
            videoControls.classList.add('opacity-0');
            document.body.style.cursor = 'none';
        }
    };

    video.addEventListener('mousemove', showControls);
    videoControls.addEventListener('mousemove', showControls);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'm':
                toggleMute();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'arrowleft':
                video.currentTime = Math.max(video.currentTime - 10, 0);
                break;
            case 'arrowright':
                video.currentTime = Math.min(video.currentTime + 10, video.duration);
                break;
            case 'arrowup':
                e.preventDefault();
                video.volume = Math.min(video.volume + 0.1, 1);
                volumeSlider.value = video.volume;
                break;
            case 'arrowdown':
                e.preventDefault();
                video.volume = Math.max(video.volume - 0.1, 0);
                volumeSlider.value = video.volume;
                break;
        }
    });

    // Error handling
    video.addEventListener('error', () => {
        console.error('Error: Video failed to load');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-75';
        errorMessage.innerHTML = `
            <div class="text-center">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>Sorry, there was an error loading the video.</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-white text-black rounded">
                    Try Again
                </button>
            </div>
        `;
        video.parentElement.appendChild(errorMessage);
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        video.pause();
        video.src = '';
        video.load();
    });
});
