"use strict";

/* =========================
   ELEMENTS
========================= */

const scoreboard = document.getElementById("scoreboard");

const messiSide = document.getElementById("messiSide");
const ronaldoSide = document.getElementById("ronaldoSide");

const messiScoreElement = document.getElementById("messiScore");
const ronaldoScoreElement = document.getElementById("ronaldoScore");

const messiCrown = document.getElementById("messiCrown");
const ronaldoCrown = document.getElementById("ronaldoCrown");

const resetButton = document.getElementById("resetBtn");


/* =========================
   SCORES
========================= */

let messiScore = 0;
let ronaldoScore = 0;


/* =========================
   VOICE ENGINE
========================= */

const voiceSupported =
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

let voices = [];


/* =========================
   LOAD VOICES
========================= */

function loadVoices() {

    if (!voiceSupported) {
        return;
    }

    voices = window.speechSynthesis.getVoices();
}

if (voiceSupported) {

    loadVoices();

    if ("onvoiceschanged" in window.speechSynthesis) {

        window.speechSynthesis.onvoiceschanged =
            function () {

                loadVoices();

            };
    }
}


/* =========================
   FIND ENGLISH VOICE
========================= */

function getEnglishVoice() {

    if (!voiceSupported) {
        return null;
    }

    if (!voices.length) {
        voices =
            window.speechSynthesis.getVoices();
    }

    let voice = voices.find(function (item) {

        return (
            item.lang &&
            item.lang.toLowerCase() === "en-us"
        );

    });

    if (voice) {
        return voice;
    }

    voice = voices.find(function (item) {

        return (
            item.lang &&
            item.lang.toLowerCase().startsWith("en")
        );

    });

    return voice || null;
}


/* =========================
   SPEAK PLAYER
========================= */

function speakPlayer(player) {

    if (!voiceSupported) {
        return;
    }

    const text =
        player === "messi"
            ? "Messi"
            : "Ronaldo";


    try {

        window.speechSynthesis.cancel();

    } catch (error) {
        // Ignore speech cancellation errors.
    }


    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.volume = 1;

    utterance.rate = 0.95;

    utterance.pitch = 1;


    const englishVoice =
        getEnglishVoice();

    if (englishVoice) {

        utterance.voice =
            englishVoice;

    }


    try {

        window.speechSynthesis.speak(
            utterance
        );

    } catch (error) {
        // Scoreboard continues normally.
    }
}


/* =========================
   INITIALIZE AUDIO
========================= */

function initializeAudio() {

    if (!voiceSupported) {
        return;
    }

    voices =
        window.speechSynthesis.getVoices();
}


/* =========================
   FORMAT SCORE
========================= */

function formatScore(score) {

    if (score < 10) {
        return "0" + score;
    }

    return String(score);
}


/* =========================
   RENDER SCORES
========================= */

function renderScores() {

    messiScoreElement.textContent =
        formatScore(messiScore);

    ronaldoScoreElement.textContent =
        formatScore(ronaldoScore);


    if (messiScore > ronaldoScore) {

        messiCrown.classList.add("show");

        ronaldoCrown.classList.remove("show");

    }

    else if (ronaldoScore > messiScore) {

        ronaldoCrown.classList.add("show");

        messiCrown.classList.remove("show");

    }

    else {

        messiCrown.classList.remove("show");

        ronaldoCrown.classList.remove("show");

    }
}


/* =========================
   SCORE ANIMATION
========================= */

function animateScore(element) {

    element.classList.remove("pop");

    void element.offsetWidth;

    element.classList.add("pop");
}


/* =========================
   FULLSCREEN
========================= */

async function requestFullScreen() {

    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement
    ) {
        return;
    }

    try {

        if (
            scoreboard &&
            scoreboard.requestFullscreen
        ) {

            await scoreboard.requestFullscreen();

        }

        else if (
            scoreboard &&
            scoreboard.webkitRequestFullscreen
        ) {

            scoreboard.webkitRequestFullscreen();

        }

    } catch (error) {
        // Fullscreen is optional.
    }
}


/* =========================
   LANDSCAPE LOCK
========================= */

async function tryLandscapeLock() {

    try {

        if (
            screen.orientation &&
            screen.orientation.lock
        ) {

            await screen.orientation.lock(
                "landscape"
            );

        }

    } catch (error) {
        // Orientation lock is optional.
    }
}


/* =========================
   ENTER LIVE DISPLAY
========================= */

async function enterLiveDisplay() {

    await requestFullScreen();

    await tryLandscapeLock();
}


/* =========================
   ADD VOTE
========================= */

function addVote(player) {

    if (player === "messi") {

        messiScore += 1;

        animateScore(
            messiScoreElement
        );

        speakPlayer("messi");

    }

    else if (player === "ronaldo") {

        ronaldoScore += 1;

        animateScore(
            ronaldoScoreElement
        );

        speakPlayer("ronaldo");

    }

    else {

        return;

    }

    renderScores();
}


/* =========================
   MESSI TAP
========================= */

messiSide.addEventListener(
    "click",
    function () {

        initializeAudio();

        enterLiveDisplay();

        addVote("messi");

    }
);


/* =========================
   RONALDO TAP
========================= */

ronaldoSide.addEventListener(
    "click",
    function () {

        initializeAudio();

        enterLiveDisplay();

        addVote("ronaldo");

    }
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        messiScore = 0;

        ronaldoScore = 0;


        if (voiceSupported) {

            try {

                window.speechSynthesis.cancel();

            } catch (error) {
                // Ignore.
            }

        }


        renderScores();

    }
);


/* =========================
   ORIENTATION CHANGE
========================= */

window.addEventListener(
    "orientationchange",
    function () {

        requestAnimationFrame(
            renderScores
        );

    }
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        requestAnimationFrame(
            renderScores
        );

    }
);


/* =========================
   INITIAL PAGE LOAD
========================= */

initializeAudio();

renderScores();
