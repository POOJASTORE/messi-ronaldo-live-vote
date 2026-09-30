"use strict";


/* =========================================
   GET HTML ELEMENTS
========================================= */

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


/* =========================================
   SCORES
========================================= */

let messiScore = 0;

let ronaldoScore = 0;


/* =========================================
   SCORE FORMAT
========================================= */

/*
    0  -> 00
    1  -> 01
    2  -> 02
    9  -> 09
    10 -> 10
    99 -> 99
    100 -> 100
*/

function formatScore(score) {

    if (score < 10) {

        return "0" + score;
    }

    return String(score);
}


/* =========================================
   UPDATE SCOREBOARD
========================================= */

function renderScores() {

    /* Update numbers */

    messiScoreElement.textContent =
        formatScore(messiScore);


    ronaldoScoreElement.textContent =
        formatScore(ronaldoScore);


    /* =====================================
       CROWN LOGIC
    ===================================== */

    /*
        Messi higher
        -> Messi crown ON
        -> Ronaldo crown OFF
    */

    if (messiScore > ronaldoScore) {

        messiCrown.classList.add("show");

        ronaldoCrown.classList.remove("show");
    }


    /*
        Ronaldo higher
        -> Ronaldo crown ON
        -> Messi crown OFF
    */

    else if (ronaldoScore > messiScore) {

        ronaldoCrown.classList.add("show");

        messiCrown.classList.remove("show");
    }


    /*
        Same score
        -> Both crowns OFF
    */

    else {

        messiCrown.classList.remove("show");

        ronaldoCrown.classList.remove("show");
    }
}


/* =========================================
   SCORE ANIMATION
========================================= */

function animateScore(element) {

    /*
        Remove previous animation.
        This makes fast consecutive taps
        animate correctly.
    */

    element.classList.remove("pop");


    /*
        Force browser reflow so the animation
        can restart even on rapid taps.
    */

    void element.offsetWidth;


    /*
        Start animation again.
    */

    element.classList.add("pop");
}


/* =========================================
   ADD VOTE
========================================= */

function addVote(player) {


    /* =====================================
       MESSI
    ===================================== */

    if (player === "messi") {

        messiScore += 1;


        animateScore(
            messiScoreElement
        );
    }


    /* =====================================
       RONALDO
    ===================================== */

    else if (player === "ronaldo") {

        ronaldoScore += 1;


        animateScore(
            ronaldoScoreElement
        );
    }


    /*
        Ignore anything unexpected.
    */

    else {

        return;
    }


    /*
        Update numbers + crown
        immediately after the vote.
    */

    renderScores();
}


/* =========================================
   VOTE EVENTS
========================================= */

/*
    VERY IMPORTANT:

    We use ONLY "click".

    We DO NOT use:

        touchstart
        touchend
        pointerdown

    for voting.

    Therefore a normal phone tap
    produces ONE vote.

    1 tap  = +1
    2 taps = +2
    3 taps = +3
*/


messiSide.addEventListener(
    "click",
    function () {

        addVote("messi");
    }
);


ronaldoSide.addEventListener(
    "click",
    function () {

        addVote("ronaldo");
    }
);


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
    "click",
    function () {

        /*
            Reset both players.
        */

        messiScore = 0;

        ronaldoScore = 0;


        /*
            Update screen.
        */

        renderScores();
    }
);


/* =========================================
   INITIAL STATE
========================================= */

/*
    When the page starts:

        Messi    = 00
        Ronaldo  = 00
        Crown    = none

    Nothing is automatically added.
*/

renderScores();
