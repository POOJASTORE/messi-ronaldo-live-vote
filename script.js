"use strict";


/* =========================
   ELEMENTS
========================= */

const scoreboard =
    document.getElementById("scoreboard");

const messiSide =
    document.getElementById("messiSide");

const ronaldoSide =
    document.getElementById("ronaldoSide");

const messiScoreElement =
    document.getElementById("messiScore");

const ronaldoScoreElement =
    document.getElementById("ronaldoScore");

const messiCrown =
    document.getElementById("messiCrown");

const ronaldoCrown =
    document.getElementById("ronaldoCrown");

const resetButton =
    document.getElementById("resetBtn");


/* =========================
   SCORES
========================= */

let messiScore = 0;
let ronaldoScore = 0;


/* =========================
   VOICE SUPPORT
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

    voices =
        window.speechSynthesis.getVoices();
}


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

    if (!voiceSupported) {
        return null;
    }


    if (!voices.length) {

        voices =
            window.speechSynthesis.getVoices();
    }


    /* Prefer US English */

    let voice =
        voices.find(function (item) {

            return (
                item.lang &&
                item.lang.toLowerCase() === "en-us"
            );

        });


    if (voice) {
        return voice;
    }


    /* Otherwise any English voice */

    voice =
        voices.find(function (item) {

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
     * Stop previous speech so
     * voices never overlap.
     */

    try {

        window.speechSynthesis.cancel();

    } catch (error) {

        // Ignore speech errors.
    }


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang = "en-US";

    utterance.volume = 1.0;

    utterance.rate = 0.95;

    utterance.pitch = 1.0;


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

        // Scoreboard continues working.
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


    /* Messi leading */

    if (messiScore > ronaldoScore) {

        messiCrown.classList.add("show");

        ronaldoCrown.classList.remove("show");
    }


    /* Ronaldo leading */

    else if (ronaldoScore > messiScore) {

        ronaldoCrown.classList.add("show");

        messiCrown.classList.remove("show");
    }


    /* Tie */

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
     * Force browser reflow so the
     * animation works on every tap.
     */

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

        /*
         * Fullscreen is optional.
         * Scoreboard continues normally.
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
         * Some browsers don't allow
         * orientation locking.
         */

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

    /* Messi */

    if (player === "messi") {

        messiScore += 1;

        animateScore(
            messiScoreElement
        );

        speakPlayer("messi");
    }


    /* Ronaldo */

    else if (player === "ronaldo") {

        ronaldoScore += 1;

        animateScore(
            ronaldoScoreElement
        );

        speakPlayer("ronaldo");
    }


    /* Invalid player */

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

        /*
         * Initialize speech from
         * actual user interaction.
         */

        initializeAudio();


        /*
         * Try fullscreen and landscape.
         */

        enterLiveDisplay();


        /*
         * Add exactly one score.
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
         * Initialize speech from
         * actual user interaction.
         */

        initializeAudio();


        /*
         * Try fullscreen and landscape.
         */

        enterLiveDisplay();


        /*
         * Add exactly one score.
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
         * Prevent reset from behaving
         * like a player tap.
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

                // Ignore speech errors.
            }
        }


        /*
         * Restore 00 / 00
         * and remove crowns.
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
   INITIAL LOAD
========================= */

initializeAudio();

renderScores();
