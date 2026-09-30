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


/*
 * Load available voices.
 * Some Android browsers load them
 * slightly after the page opens.
 */
function loadVoices() {

    if (!voiceSupported) {
        return;
    }

    voices = window.speechSynthesis.getVoices();
}


/*
 * Android/Chrome can fire this event
 * when voices become available.
 */
if (voiceSupported) {

    loadVoices();

    if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged =
            loadVoices;
    }
}


/* =========================
   FIND ENGLISH VOICE
========================= */

function getEnglishVoice() {

    if (!voices.length) {
        voices =
            window.speechSynthesis.getVoices();
    }

    /*
     * Prefer US English.
     */
    let voice = voices.find(function (item) {
        return (
            item.lang &&
            item.lang.toLowerCase() === "en-us"
        );
    });

    if (voice) {
        return voice;
    }


    /*
     * Otherwise use any English voice.
     */
    voice = voices.find(function (item) {
        return (
            item.lang &&
            item.lang
                .toLowerCase()
                .startsWith("en")
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


    /*
     * Stop previous voice.
     * This prevents overlapping audio.
     */
    try {
        window.speechSynthesis.cancel();
    } catch (error) {
        // Ignore speech engine errors.
    }


    const speakNow = function () {

        const utterance =
            new SpeechSynthesisUtterance(text);


        /*
         * Clear English pronunciation.
         */
        utterance.lang = "en-US";


        /*
         * Full available speech volume.
         */
        utterance.volume = 1.0;


        /*
         * Normal-fast, clear speech.
         */
        utterance.rate = 0.95;


        /*
         * Natural voice pitch.
         */
        utterance.pitch = 1.0;


        const englishVoice =
            getEnglishVoice();

        if (englishVoice) {
            utterance.voice =
                englishVoice;
        }


        /*
         * Speak.
         */
        try {
            window.speechSynthesis.speak(
                utterance
            );
        } catch (error) {
            // Keep scoreboard working.
        }
    };


    /*
     * Give Android speech engine a tiny
     * moment after cancel().
     */
    setTimeout(speakNow, 30);
}


/* =========================
   INITIALIZE AUDIO
========================= */

function initializeAudio() {

    if (!voiceSupported) {
        return;
    }

    /*
     * Calling getVoices() helps initialize
     * the Android speech engine.
     */
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


    /*
     * MESSI LEADING
     */
    if (messiScore > ronaldoScore) {

        messiCrown.classList.add("show");

        ronaldoCrown.classList.remove("show");
    }


    /*
     * RONALDO LEADING
     */
    else if (ronaldoScore > messiScore) {

        ronaldoCrown.classList.add("show");

        messiCrown.classList.remove("show");
    }


    /*
     * TIE
     */
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

    /*
     * Force reflow so animation
     * works on every single tap.
     */
    void element.offsetWidth;

    element.classList.add("pop");
}


/* =========================
   FULLSCREEN
========================= */

async function requestFullScreen() {

    /*
     * Already fullscreen.
     */
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

        /*
         * Some browsers/WebViews block
         * fullscreen. The scoreboard
         * continues working normally.
         */

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

        /*
         * Orientation lock is optional.
         * Physical phone rotation still works.
         */

    }
}


/* =========================
   ENTER LIVE DISPLAY
========================= */

async function enterLiveDisplay() {

    /*
     * These are triggered by the user's
     * tap, which is important for browser
     * fullscreen permissions.
     */
    await requestFullScreen();

    await tryLandscapeLock();
}


/* =========================
   ADD VOTE
========================= */

function addVote(player) {

    /*
     * MESSI
     */
    if (player === "messi") {

        messiScore += 1;

        animateScore(
            messiScoreElement
        );

        speakPlayer("messi");
    }


    /*
     * RONALDO
     */
    else if (player === "ronaldo") {

        ronaldoScore += 1;

        animateScore(
            ronaldoScoreElement
        );

        speakPlayer("ronaldo");
    }


    /*
     * Invalid player
     */
    else {

        return;
    }


    /*
     * Update scores and crown.
     */
    renderScores();
}


/* =========================
   MESSI TAP
========================= */

messiSide.addEventListener(
    "click",
    function () {

        /*
         * Initialize speech from the
         * user's actual tap.
         */
        initializeAudio();

        /*
         * Try fullscreen/landscape.
         */
        enterLiveDisplay();

        /*
         * Add exactly ONE vote.
         */
        addVote("messi");
    }
);


/* =========================
   RONALDO TAP
========================= */

ronaldoSide.addEventListener(
    "click",
    function () {

        /*
         * Initialize speech from the
         * user's actual tap.
         */
        initializeAudio();

        /*
         * Try fullscreen/landscape.
         */
        enterLiveDisplay();

        /*
         * Add exactly ONE vote.
         */
        addVote("ronaldo");
    }
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function (event) {

        /*
         * Don't let reset behave like
         * another screen tap.
         */
        event.stopPropagation();


        /*
         * Reset both scores.
         */
        messiScore = 0;
        ronaldoScore = 0;


        /*
         * Stop current voice.
         */
        if (voiceSupported) {

            try {
                window.speechSynthesis.cancel();
            } catch (error) {
                // Ignore.
            }
        }


        /*
         * Remove crown and restore 00/00.
         */
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
