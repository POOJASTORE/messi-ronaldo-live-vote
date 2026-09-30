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
   FORMAT SCORE
========================= */

function formatScore(score) {

    if (score < 10) {
        return "0" + score;
    }

    return String(score);
}


/* =========================
   UPDATE SCREEN
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
     * animation can restart every tap.
     */
    void element.offsetWidth;

    element.classList.add("pop");
}


/* =========================
   VOICE
========================= */

function speakPlayer(player) {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }


    /*
     * Stop previous speech first.
     * This prevents overlapping voices
     * during fast taps.
     */
    window.speechSynthesis.cancel();


    const text =
        player === "messi"
            ? "Messi"
            : "Ronaldo";


    const utterance =
        new SpeechSynthesisUtterance(text);


    /*
     * Clear English pronunciation.
     */
    utterance.lang = "en-US";

    /*
     * Fast and energetic.
     */
    utterance.rate = 1.0;

    utterance.pitch = 1.0;

    utterance.volume = 1.0;


    /*
     * Speak immediately.
     */
    window.speechSynthesis.speak(
        utterance
    );
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
            scoreboard.requestFullscreen
        ) {

            await scoreboard.requestFullscreen();

        }

        else if (
            scoreboard.webkitRequestFullscreen
        ) {

            scoreboard.webkitRequestFullscreen();

        }

    } catch (error) {

        /*
         * Some browsers/WebViews
         * don't allow fullscreen.
         * Scoreboard still works normally.
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
         * Orientation lock can be
         * restricted by the browser.
         * Physical rotation still works.
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

        /*
         * Prevent reset click from
         * affecting anything else.
         */
        event.stopPropagation();


        messiScore = 0;

        ronaldoScore = 0;


        /*
         * Stop any current voice.
         */
        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();
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

        /*
         * Re-render after the device
         * changes orientation.
         */
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
   INITIAL STATE
========================= */

renderScores();
