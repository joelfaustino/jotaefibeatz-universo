/**
 * ============================================================
 * JOTA EFI BEATZ — GLOBAL AUDIO PLAYER
 * ============================================================
 *
 * File:
 * assets/js/player.js
 *
 * Purpose:
 * Global audio player for beats, drum kits, sample packs
 * and other audio previews.
 *
 * Dependencies:
 * - Bootstrap Icons
 * - main.js (optional)
 *
 * No external JavaScript library required.
 * ============================================================
 */

(() => {
    "use strict";

    /* ========================================================
       CONFIG
    ======================================================== */

    const CONFIG = {
        selectors: {
            player: ".global-player",
            audio: "#global-audio",

            playButton: ".player__play",
            previousButton: ".player__previous",
            nextButton: ".player__next",

            progress: ".player__progress",
            progressFill: ".player__progress-fill",

            currentTime: ".player__current-time",
            duration: ".player__duration",

            volume: ".player__volume",
            volumeButton: ".player__volume-button",

            title: ".player__title",
            artist: ".player__artist",
            cover: ".player__cover",

            closeButton: ".player__close",

            track: "[data-audio]",
            playTrigger: "[data-player-play]",
            addToQueue: "[data-player-add]"
        },

        classes: {
            active: "is-active",
            playing: "is-playing",
            paused: "is-paused",
            loading: "is-loading",
            muted: "is-muted",
            error: "is-error"
        },

        defaultVolume: 0.8,

        storage: {
            volume: "jota-efi-player-volume"
        }
    };


    /* ========================================================
       STATE
    ======================================================== */

    const state = {
        tracks: [],
        currentIndex: -1,

        isPlaying: false,
        isLoaded: false,
        isMuted: false,

        volume: CONFIG.defaultVolume,

        previousVolume: CONFIG.defaultVolume
    };


    /* ========================================================
       DOM
    ======================================================== */

    let player = null;
    let audio = null;

    let playButton = null;
    let previousButton = null;
    let nextButton = null;

    let progress = null;
    let progressFill = null;

    let currentTimeElement = null;
    let durationElement = null;

    let volumeControl = null;
    let volumeButton = null;

    let titleElement = null;
    let artistElement = null;
    let coverElement = null;

    let closeButton = null;


    /* ========================================================
       INIT
    ======================================================== */

    document.addEventListener("DOMContentLoaded", initPlayer);


    function initPlayer() {
        cacheDOM();

        if (!audio) {
            console.warn(
                "[JotaPlayer] Elemento #global-audio não encontrado."
            );
            return;
        }

        setupAudio();

        loadVolume();

        collectTracks();

        bindEvents();

        updateUI();

        exposeAPI();
    }


    /* ========================================================
       CACHE DOM
    ======================================================== */

    function cacheDOM() {
        player = document.querySelector(CONFIG.selectors.player);

        audio = document.querySelector(CONFIG.selectors.audio);

        if (!player) {
            return;
        }

        playButton = player.querySelector(
            CONFIG.selectors.playButton
        );

        previousButton = player.querySelector(
            CONFIG.selectors.previousButton
        );

        nextButton = player.querySelector(
            CONFIG.selectors.nextButton
        );

        progress = player.querySelector(
            CONFIG.selectors.progress
        );

        progressFill = player.querySelector(
            CONFIG.selectors.progressFill
        );

        currentTimeElement = player.querySelector(
            CONFIG.selectors.currentTime
        );

        durationElement = player.querySelector(
            CONFIG.selectors.duration
        );

        volumeControl = player.querySelector(
            CONFIG.selectors.volume
        );

        volumeButton = player.querySelector(
            CONFIG.selectors.volumeButton
        );

        titleElement = player.querySelector(
            CONFIG.selectors.title
        );

        artistElement = player.querySelector(
            CONFIG.selectors.artist
        );

        coverElement = player.querySelector(
            CONFIG.selectors.cover
        );

        closeButton = player.querySelector(
            CONFIG.selectors.closeButton
        );
    }


    /* ========================================================
       AUDIO SETUP
       ======================================================== */

    function setupAudio() {
        audio.preload = "metadata";

        audio.volume = state.volume;

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        audio.addEventListener(
            "progress",
            handleProgress
        );

        audio.addEventListener(
            "play",
            handlePlay
        );

        audio.addEventListener(
            "pause",
            handlePause
        );

        audio.addEventListener(
            "ended",
            handleEnded
        );

        audio.addEventListener(
            "waiting",
            handleWaiting
        );

        audio.addEventListener(
            "canplay",
            handleCanPlay
        );

        audio.addEventListener(
            "error",
            handleAudioError
        );

        audio.addEventListener(
            "volumechange",
            handleVolumeChange
        );
    }


    /* ========================================================
       COLLECT TRACKS
       ======================================================== */

    function collectTracks() {
        const elements = document.querySelectorAll(
            CONFIG.selectors.track
        );

        state.tracks = Array.from(elements)
            .filter((element) => {
                return element.dataset.audio;
            })
            .map((element) => {
                return {
                    element,

                    audio:
                        element.dataset.audio || "",

                    title:
                        element.dataset.title ||
                        element.dataset.name ||
                        "Untitled",

                    artist:
                        element.dataset.artist ||
                        "Jota Efi Beatz",

                    cover:
                        element.dataset.cover || "",

                    index: 0
                };
            });

        state.tracks.forEach((track, index) => {
            track.index = index;

            track.element.dataset.playerIndex = index;
        });
    }


    /* ========================================================
       EVENTS
       ======================================================== */

    function bindEvents() {
        if (playButton) {
            playButton.addEventListener(
                "click",
                togglePlay
            );
        }

        if (previousButton) {
            previousButton.addEventListener(
                "click",
                playPrevious
            );
        }

        if (nextButton) {
            nextButton.addEventListener(
                "click",
                playNext
            );
        }

        if (progress) {
            progress.addEventListener(
                "input",
                handleProgressInput
            );

            progress.addEventListener(
                "change",
                handleProgressInput
            );

            progress.addEventListener(
                "click",
                handleProgressClick
            );
        }

        if (volumeControl) {
            volumeControl.addEventListener(
                "input",
                handleVolumeInput
            );

            volumeControl.addEventListener(
                "change",
                handleVolumeInput
            );
        }

        if (volumeButton) {
            volumeButton.addEventListener(
                "click",
                toggleMute
            );
        }

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                closePlayer
            );
        }

        document.addEventListener(
            "click",
            handleDocumentClick
        );

        document.addEventListener(
            "keydown",
            handleKeyboard
        );
    }


    /* ========================================================
       DOCUMENT CLICK
       ======================================================== */

    function handleDocumentClick(event) {
        const track = event.target.closest(
            CONFIG.selectors.track
        );

        if (track) {
            event.preventDefault();

            const index = Number(
                track.dataset.playerIndex
            );

            if (!Number.isNaN(index)) {
                playTrack(index);
            }

            return;
        }

        const trigger = event.target.closest(
            CONFIG.selectors.playTrigger
        );

        if (trigger) {
            event.preventDefault();

            const audioSource =
                trigger.dataset.playerPlay ||
                trigger.dataset.audio;

            if (!audioSource) {
                return;
            }

            playSource({
                audio: audioSource,

                title:
                    trigger.dataset.title ||
                    "Preview",

                artist:
                    trigger.dataset.artist ||
                    "Jota Efi Beatz",

                cover:
                    trigger.dataset.cover ||
                    ""
            });
        }
    }


    /* ========================================================
       PLAY TRACK
       ======================================================== */

    function playTrack(index) {
        if (
            index < 0 ||
            index >= state.tracks.length
        ) {
            return;
        }

        const track = state.tracks[index];

        if (!track || !track.audio) {
            return;
        }

        state.currentIndex = index;

        resetTrackStates();

        track.element.classList.add(
            CONFIG.classes.playing
        );

        loadTrackData(track);

        setAudioSource(track.audio);

        showPlayer();

        playAudio();
    }


    /* ========================================================
       PLAY SOURCE
       ======================================================== */

    function playSource(data = {}) {
        const source = data.audio;

        if (!source) {
            return;
        }

        resetTrackStates();

        state.currentIndex = -1;

        updatePlayerInfo({
            title:
                data.title ||
                "Preview",

            artist:
                data.artist ||
                "Jota Efi Beatz",

            cover:
                data.cover ||
                ""
        });

        setAudioSource(source);

        showPlayer();

        playAudio();
    }


    /* ========================================================
       LOAD TRACK DATA
       ======================================================== */

    function loadTrackData(track) {
        updatePlayerInfo({
            title: track.title,

            artist: track.artist,

            cover: track.cover
        });
    }


    /* ========================================================
       SET AUDIO SOURCE
       ======================================================== */

    function setAudioSource(source) {
        if (!audio) {
            return;
        }

        state.isLoaded = false;

        player?.classList.remove(
            CONFIG.classes.error
        );

        player?.classList.add(
            CONFIG.classes.loading
        );

        audio.pause();

        audio.currentTime = 0;

        audio.src = normalizeAudioPath(source);

        audio.load();

        updateProgress(0);

        updateTimeDisplay(
            currentTimeElement,
            0
        );

        updateTimeDisplay(
            durationElement,
            0
        );
    }


    /* ========================================================
       NORMALIZE AUDIO PATH
       ======================================================== */

    function normalizeAudioPath(source) {
        if (!source) {
            return "";
        }

        /*
         * Absolute URLs:
         * https://...
         * http://...
         * blob:...
         * data:...
         */
        if (
            /^(https?:|blob:|data:)/i.test(source)
        ) {
            return source;
        }

        /*
         * Keep relative paths untouched.
         *
         * Example:
         * ./assets/audio/beats/sana-preview.mp3
         */
        return source;
    }


    /* ========================================================
       PLAY AUDIO
       ======================================================== */

    function playAudio() {
        if (!audio) {
            return;
        }

        const promise = audio.play();

        if (
            promise &&
            typeof promise.catch === "function"
        ) {
            promise.catch((error) => {
                console.warn(
                    "[JotaPlayer] Reprodução bloqueada:",
                    error
                );

                state.isPlaying = false;

                updatePlayButton();
            });
        }
    }


    /* ========================================================
       TOGGLE PLAY
       ======================================================== */

    function togglePlay() {
        if (!audio) {
            return;
        }

        if (!audio.src) {
            if (state.tracks.length > 0) {
                playTrack(0);
            }

            return;
        }

        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    }


    /* ========================================================
       PREVIOUS
       ======================================================== */

    function playPrevious() {
        if (state.tracks.length === 0) {
            return;
        }

        if (
            state.currentIndex === -1
        ) {
            playTrack(0);
            return;
        }

        /*
         * If the current track has played for more than
         * three seconds, restart it.
         */
        if (
            audio &&
            audio.currentTime > 3
        ) {
            audio.currentTime = 0;

            if (audio.paused) {
                playAudio();
            }

            return;
        }

        let previousIndex =
            state.currentIndex - 1;

        if (previousIndex < 0) {
            previousIndex =
                state.tracks.length - 1;
        }

        playTrack(previousIndex);
    }


    /* ========================================================
       NEXT
       ======================================================== */

    function playNext() {
        if (state.tracks.length === 0) {
            return;
        }

        let nextIndex =
            state.currentIndex + 1;

        if (
            state.currentIndex === -1 ||
            nextIndex >= state.tracks.length
        ) {
            nextIndex = 0;
        }

        playTrack(nextIndex);
    }


    /* ========================================================
       AUDIO EVENTS
       ======================================================== */

    function handleLoadedMetadata() {
        state.isLoaded = true;

        player?.classList.remove(
            CONFIG.classes.loading
        );

        if (durationElement) {
            durationElement.textContent =
                formatTime(audio.duration);
        }

        updateProgress(
            getProgressPercentage()
        );

        updateNavigationButtons();
    }


    function handleTimeUpdate() {
        if (!audio) {
            return;
        }

        const percentage =
            getProgressPercentage();

        updateProgress(percentage);

        updateTimeDisplay(
            currentTimeElement,
            audio.currentTime
        );
    }


    function handleProgress() {
        /*
         * Reserved for buffered progress
         * if a buffered bar is added later.
         */
    }


    function handlePlay() {
        state.isPlaying = true;

        player?.classList.add(
            CONFIG.classes.playing
        );

        player?.classList.remove(
            CONFIG.classes.paused
        );

        updatePlayButton();

        updateCurrentTrackState(true);
    }


    function handlePause() {
        state.isPlaying = false;

        player?.classList.remove(
            CONFIG.classes.playing
        );

        player?.classList.add(
            CONFIG.classes.paused
        );

        updatePlayButton();

        updateCurrentTrackState(false);
    }


    function handleEnded() {
        state.isPlaying = false;

        updateCurrentTrackState(false);

        /*
         * Automatically continue to the next track.
         */
        if (
            state.tracks.length > 1
        ) {
            playNext();
            return;
        }

        updatePlayButton();

        updateProgress(0);
    }


    function handleWaiting() {
        player?.classList.add(
            CONFIG.classes.loading
        );
    }


    function handleCanPlay() {
        player?.classList.remove(
            CONFIG.classes.loading
        );
    }


    function handleAudioError() {
        state.isPlaying = false;
        state.isLoaded = false;

        player?.classList.remove(
            CONFIG.classes.loading
        );

        player?.classList.add(
            CONFIG.classes.error
        );

        updatePlayButton();

        if (
            window.JotaEfi &&
            typeof window.JotaEfi.toast === "function"
        ) {
            window.JotaEfi.toast(
                "Não foi possível carregar este áudio.",
                "error"
            );
        }
    }


    function handleVolumeChange() {
        if (!audio) {
            return;
        }

        state.volume = audio.volume;

        state.isMuted = audio.muted;

        updateVolumeUI();

        saveVolume();
    }


    /* ========================================================
       PROGRESS
       ======================================================== */

    function handleProgressInput(event) {
        if (!audio || !audio.duration) {
            return;
        }

        const value =
            Number(event.target.value);

        if (
            Number.isNaN(value)
        ) {
            return;
        }

        audio.currentTime =
            audio.duration *
            (value / 100);

        updateProgress(value);
    }


    function handleProgressClick(event) {
        if (!progress || !audio) {
            return;
        }

        if (
            !audio.duration ||
            Number.isNaN(audio.duration)
        ) {
            return;
        }

        /*
         * If the element is a range input,
         * browser handles the click itself.
         */
        if (
            progress.tagName.toLowerCase() ===
            "input"
        ) {
            return;
        }

        const rect =
            progress.getBoundingClientRect();

        const position =
            event.clientX - rect.left;

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (position / rect.width) * 100
                )
            );

        audio.currentTime =
            audio.duration *
            (percentage / 100);

        updateProgress(percentage);
    }


    function getProgressPercentage() {
        if (
            !audio ||
            !audio.duration ||
            Number.isNaN(audio.duration)
        ) {
            return 0;
        }

        return (
            audio.currentTime /
            audio.duration
        ) * 100;
    }


    function updateProgress(percentage) {
        const value = Math.min(
            100,
            Math.max(
                0,
                Number(percentage) || 0
            )
        );

        if (progress) {
            /*
             * If it's an input[type=range]
             */
            if (
                progress.tagName.toLowerCase() ===
                "input"
            ) {
                progress.value = value;
            }

            /*
             * CSS custom property
             */
            progress.style.setProperty(
                "--progress",
                `${value}%`
            );
        }

        if (progressFill) {
            progressFill.style.width =
                `${value}%`;
        }
    }


    /* ========================================================
       VOLUME
       ======================================================== */

    function handleVolumeInput(event) {
        if (!audio) {
            return;
        }

        let value =
            Number(event.target.value);

        /*
         * Support both:
         * 0 - 1
         * 0 - 100
         */
        if (value > 1) {
            value /= 100;
        }

        value = Math.min(
            1,
            Math.max(0, value)
        );

        audio.volume = value;

        if (value > 0) {
            audio.muted = false;
            state.isMuted = false;
            state.previousVolume = value;
        }
    }


    function toggleMute() {
        if (!audio) {
            return;
        }

        if (audio.muted || audio.volume === 0) {
            audio.muted = false;

            audio.volume =
                state.previousVolume ||
                CONFIG.defaultVolume;

            state.isMuted = false;
        } else {
            state.previousVolume =
                audio.volume;

            audio.muted = true;

            state.isMuted = true;
        }

        updateVolumeUI();
    }


    function updateVolumeUI() {
        if (!audio) {
            return;
        }

        const volume =
            audio.muted
                ? 0
                : audio.volume;

        if (volumeControl) {
            /*
             * Support both 0-1 and 0-100
             */
            if (
                Number(volumeControl.max) <= 1
            ) {
                volumeControl.value =
                    volume;
            } else {
                volumeControl.value =
                    volume * 100;
            }

            volumeControl.style.setProperty(
                "--volume",
                `${volume * 100}%`
            );
        }

        if (volumeButton) {
            volumeButton.classList.toggle(
                CONFIG.classes.muted,
                audio.muted ||
                volume === 0
            );

            const icon =
                volumeButton.querySelector("i");

            if (icon) {
                icon.classList.remove(
                    "bi-volume-up",
                    "bi-volume-down",
                    "bi-volume-mute"
                );

                if (
                    audio.muted ||
                    volume === 0
                ) {
                    icon.classList.add(
                        "bi-volume-mute"
                    );
                } else if (
                    volume < 0.5
                ) {
                    icon.classList.add(
                        "bi-volume-down"
                    );
                } else {
                    icon.classList.add(
                        "bi-volume-up"
                    );
                }
            }
        }
    }


    /* ========================================================
       PLAYER INFO
       ======================================================== */

    function updatePlayerInfo(data = {}) {
        if (titleElement) {
            titleElement.textContent =
                data.title ||
                "Jota Efi Beatz";
        }

        if (artistElement) {
            artistElement.textContent =
                data.artist ||
                "Producer";
        }

        if (coverElement) {
            const cover =
                data.cover || "";

            if (cover) {
                if (
                    coverElement.tagName.toLowerCase() ===
                    "img"
                ) {
                    coverElement.src = cover;

                    coverElement.alt =
                        data.title ||
                        "Jota Efi Beatz";
                } else {
                    coverElement.style.backgroundImage =
                        `url("${cover}")`;
                }
            } else {
                if (
                    coverElement.tagName.toLowerCase() ===
                    "img"
                ) {
                    coverElement.removeAttribute(
                        "src"
                    );

                    coverElement.alt =
                        "Jota Efi Beatz";
                } else {
                    coverElement.style.backgroundImage =
                        "";
                }
            }
        }
    }


    /* ========================================================
       PLAY BUTTON
       ======================================================== */

    function updatePlayButton() {
        if (!playButton) {
            return;
        }

        playButton.classList.toggle(
            CONFIG.classes.playing,
            state.isPlaying
        );

        playButton.classList.toggle(
            CONFIG.classes.paused,
            !state.isPlaying
        );

        const icon =
            playButton.querySelector("i");

        if (icon) {
            icon.classList.remove(
                "bi-play-fill",
                "bi-pause-fill"
            );

            icon.classList.add(
                state.isPlaying
                    ? "bi-pause-fill"
                    : "bi-play-fill"
            );
        }

        playButton.setAttribute(
            "aria-label",
            state.isPlaying
                ? "Pausar"
                : "Reproduzir"
        );

        playButton.setAttribute(
            "title",
            state.isPlaying
                ? "Pausar"
                : "Reproduzir"
        );
    }


    /* ========================================================
       TRACK STATES
       ======================================================== */

    function resetTrackStates() {
        state.tracks.forEach((track) => {
            track.element.classList.remove(
                CONFIG.classes.playing,
                CONFIG.classes.paused
            );

            const button =
                track.element.querySelector(
                    "[data-player-button]"
                ) ||
                track.element.querySelector(
                    ".product-card__play"
                );

            if (button) {
                button.classList.remove(
                    CONFIG.classes.playing
                );

                const icon =
                    button.querySelector("i");

                if (icon) {
                    icon.classList.remove(
                        "bi-pause-fill"
                    );

                    icon.classList.add(
                        "bi-play-fill"
                    );
                }
            }
        });
    }


    function updateCurrentTrackState(
        playing
    ) {
        if (
            state.currentIndex < 0 ||
            !state.tracks[
                state.currentIndex
            ]
        ) {
            return;
        }

        const track =
            state.tracks[
                state.currentIndex
            ];

        if (playing) {
            track.element.classList.add(
                CONFIG.classes.playing
            );

            track.element.classList.remove(
                CONFIG.classes.paused
            );
        } else {
            track.element.classList.remove(
                CONFIG.classes.playing
            );

            track.element.classList.add(
                CONFIG.classes.paused
            );
        }

        const button =
            track.element.querySelector(
                "[data-player-button]"
            ) ||
            track.element.querySelector(
                ".product-card__play"
            );

        if (!button) {
            return;
        }

        button.classList.toggle(
            CONFIG.classes.playing,
            playing
        );

        const icon =
            button.querySelector("i");

        if (icon) {
            icon.classList.remove(
                "bi-play-fill",
                "bi-pause-fill"
            );

            icon.classList.add(
                playing
                    ? "bi-pause-fill"
                    : "bi-play-fill"
            );
        }
    }


    /* ========================================================
       NAVIGATION BUTTONS
       ======================================================== */

    function updateNavigationButtons() {
        if (state.tracks.length <= 1) {
            if (previousButton) {
                previousButton.disabled = true;
            }

            if (nextButton) {
                nextButton.disabled = true;
            }

            return;
        }

        if (previousButton) {
            previousButton.disabled = false;
        }

        if (nextButton) {
            nextButton.disabled = false;
        }
    }


    /* ========================================================
       SHOW / CLOSE PLAYER
       ======================================================== */

    function showPlayer() {
        if (!player) {
            return;
        }

        player.classList.add(
            CONFIG.classes.active
        );

        player.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "has-global-player"
        );
    }


    function closePlayer() {
        if (!player) {
            return;
        }

        audio?.pause();

        player.classList.remove(
            CONFIG.classes.active,
            CONFIG.classes.playing,
            CONFIG.classes.paused
        );

        player.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "has-global-player"
        );

        resetTrackStates();
    }


    /* ========================================================
       TIME
       ======================================================== */

    function formatTime(seconds) {
        if (
            !seconds ||
            Number.isNaN(seconds) ||
            seconds < 0
        ) {
            return "0:00";
        }

        const totalSeconds =
            Math.floor(seconds);

        const minutes =
            Math.floor(
                totalSeconds / 60
            );

        const remainingSeconds =
            totalSeconds % 60;

        return `${minutes}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    }


    function updateTimeDisplay(
        element,
        seconds
    ) {
        if (!element) {
            return;
        }

        element.textContent =
            formatTime(seconds);
    }


    /* ========================================================
       VOLUME STORAGE
       ======================================================== */

    function loadVolume() {
        try {
            const saved =
                localStorage.getItem(
                    CONFIG.storage.volume
                );

            if (saved === null) {
                audio.volume =
                    CONFIG.defaultVolume;

                state.volume =
                    CONFIG.defaultVolume;

                return;
            }

            const value =
                Number(saved);

            if (
                Number.isNaN(value) ||
                value < 0 ||
                value > 1
            ) {
                return;
            }

            state.volume = value;

            audio.volume = value;

            state.previousVolume =
                value || CONFIG.defaultVolume;

            updateVolumeUI();
        } catch (error) {
            console.warn(
                "[JotaPlayer] Não foi possível recuperar o volume.",
                error
            );
        }
    }


    function saveVolume() {
        try {
            localStorage.setItem(
                CONFIG.storage.volume,
                String(state.volume)
            );
        } catch (error) {
            /*
             * localStorage may be unavailable
             * in private/restricted environments.
             */
        }
    }


    /* ========================================================
       KEYBOARD
       ======================================================== */

    function handleKeyboard(event) {
        /*
         * Don't hijack keyboard controls when typing.
         */
        const target =
            event.target;

        const isTyping =
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            );

        if (isTyping) {
            return;
        }

        /*
         * Space = play/pause
         */
        if (
            event.code === "Space"
        ) {
            event.preventDefault();

            togglePlay();

            return;
        }

        /*
         * Arrow Left = previous
         */
        if (
            event.code === "ArrowLeft"
        ) {
            if (audio) {
                event.preventDefault();

                seekRelative(-5);
            }

            return;
        }

        /*
         * Arrow Right = next/seek
         */
        if (
            event.code === "ArrowRight"
        ) {
            if (audio) {
                event.preventDefault();

                seekRelative(5);
            }

            return;
        }

        /*
         * M = mute
         */
        if (
            event.key.toLowerCase() === "m"
        ) {
            toggleMute();
        }
    }


    /* ========================================================
       SEEK
       ======================================================== */

    function seekRelative(seconds) {
        if (
            !audio ||
            !audio.duration
        ) {
            return;
        }

        audio.currentTime =
            Math.min(
                audio.duration,
                Math.max(
                    0,
                    audio.currentTime + seconds
                )
            );
    }


    /* ========================================================
       UPDATE UI
       ======================================================== */

    function updateUI() {
        updatePlayButton();

        updateVolumeUI();

        updateNavigationButtons();

        updateProgress(
            getProgressPercentage()
        );
    }


    /* ========================================================
       EXTERNAL API
       ======================================================== */

    function exposeAPI() {
        window.JotaPlayer = {
            play: playAudio,

            pause: () => {
                audio?.pause();
            },

            toggle: togglePlay,

            next: playNext,

            previous: playPrevious,

            mute: toggleMute,

            close: closePlayer,

            show: showPlayer,

            seek: seekRelative,

            playTrack,

            playSource,

            getCurrentTrack: () => {
                if (
                    state.currentIndex < 0
                ) {
                    return null;
                }

                return state.tracks[
                    state.currentIndex
                ] || null;
            },

            getTracks: () => {
                return [...state.tracks];
            },

            getState: () => {
                return {
                    ...state
                };
            },

            setVolume: (value) => {
                if (!audio) {
                    return;
                }

                let volume =
                    Number(value);

                if (volume > 1) {
                    volume /= 100;
                }

                volume = Math.min(
                    1,
                    Math.max(
                        0,
                        volume
                    )
                );

                audio.volume =
                    volume;

                audio.muted =
                    volume === 0;

                updateVolumeUI();
            }
        };
    }


    /* ========================================================
       PUBLIC REFRESH
       ======================================================== */

    function refreshTracks() {
        collectTracks();

        updateNavigationButtons();
    }


    /* ========================================================
       MUTATION OBSERVER
       ========================================================
       Useful if products are loaded dynamically by
       products.js or another script.
       ======================================================== */

    function initMutationObserver() {
        if (!document.body) {
            return;
        }

        const observer =
            new MutationObserver(
                (mutations) => {
                    let shouldRefresh = false;

                    mutations.forEach(
                        (mutation) => {
                            mutation.addedNodes.forEach(
                                (node) => {
                                    if (
                                        node.nodeType !== 1
                                    ) {
                                        return;
                                    }

                                    if (
                                        node.matches?.(
                                            CONFIG.selectors.track
                                        ) ||
                                        node.querySelector?.(
                                            CONFIG.selectors.track
                                        )
                                    ) {
                                        shouldRefresh =
                                            true;
                                    }
                                }
                            );
                        }
                    );

                    if (shouldRefresh) {
                        refreshTracks();
                    }
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* ========================================================
       PAGE VISIBILITY
       ======================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {
            /*
             * Keep audio playing when the user changes
             * tabs. No automatic pause.
             */
        }
    );


    /* ========================================================
       INITIAL UI AFTER DOM
       ======================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            /*
             * Wait one frame so dynamically created player
             * elements can exist before initialization.
             */
            requestAnimationFrame(() => {
                initMutationObserver();
            });
        }
    );


    /* ========================================================
       PUBLIC REFRESH EVENT
       ======================================================== */

    document.addEventListener(
        "jota:player:refresh",
        () => {
            refreshTracks();
        }
    );


    /* ========================================================
       CUSTOM EVENTS
       ======================================================== */

    function dispatchPlayerEvent(
        name,
        detail = {}
    ) {
        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        );
    }


    /*
     * Hook into audio events to allow other scripts to
     * listen without accessing the player directly.
     */

    if (audio) {
        audio.addEventListener(
            "play",
            () => {
                dispatchPlayerEvent(
                    "jota:player:play",
                    {
                        track:
                            state.tracks[
                                state.currentIndex
                            ] || null
                    }
                );
            }
        );

        audio.addEventListener(
            "pause",
            () => {
                dispatchPlayerEvent(
                    "jota:player:pause",
                    {
                        track:
                            state.tracks[
                                state.currentIndex
                            ] || null
                    }
                );
            }
        );

        audio.addEventListener(
            "ended",
            () => {
                dispatchPlayerEvent(
                    "jota:player:ended",
                    {
                        track:
                            state.tracks[
                                state.currentIndex
                            ] || null
                    }
                );
            }
        );
    }

})();