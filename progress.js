// ==========================================
// MATHORIA - PLAYER PROGRESS SYSTEM
// ==========================================


// ------------------------------
// XP LEVELS
// ------------------------------

const MATHORIA_LEVELS = [
    0,
    100,
    400,
    700,
    1100,
    1600,
    2200,
    3000,
    4000,
    5000
];


// ------------------------------
// GET PLAYER XP
// ------------------------------

function getXP() {

    return Number(
        localStorage.getItem("mathoriaXP")
    ) || 0;

}


// ------------------------------
// SAVE PLAYER XP
// ------------------------------

function saveXP(xp) {

    localStorage.setItem(
        "mathoriaXP",
        xp
    );

}


// ------------------------------
// GET PLAYER LEVEL
// ------------------------------

function getLevel(xp = getXP()) {

    let level = 1;

    for (let i = 0; i < MATHORIA_LEVELS.length; i++) {

        if (xp >= MATHORIA_LEVELS[i]) {
            level = i + 1;
        }

    }

    return Math.min(level, 10);

}


// ------------------------------
// XP NEEDED FOR NEXT LEVEL
// ------------------------------

function getNextLevelXP(level = getLevel()) {

    if (level >= 10) {
        return 5000;
    }

    return MATHORIA_LEVELS[level];

}


// ------------------------------
// ADD XP
// ------------------------------

function addXP(amount) {

    let xp = getXP();

    xp += amount;

    saveXP(xp);

    updatePlayerDisplay();

    return xp;

}


// ------------------------------
// GET TOTAL COMPLETED GAMES
// ------------------------------

function getCompletedGames() {

    return Number(
        localStorage.getItem("mathoriaCompletedGames")
    ) || 0;

}


// ------------------------------
// COMPLETE GAME
// ------------------------------

function completeGame(gameName, perfectScore = false) {

    const completedKey =
        "mathoriaGame_" + gameName;

    const alreadyCompleted =
        localStorage.getItem(completedKey);


    // --------------------------
    // FIRST COMPLETION
    // --------------------------

    if (!alreadyCompleted) {

        localStorage.setItem(
            completedKey,
            "true"
        );


        let completedGames =
            getCompletedGames();

        completedGames++;


        localStorage.setItem(
            "mathoriaCompletedGames",
            completedGames
        );

    }


    // --------------------------
    // PERFECT SCORE
    // --------------------------

    if (perfectScore) {

        localStorage.setItem(
            "mathoriaPerfectScore",
            "true"
        );

    }


    // --------------------------
    // DAILY ACTIVITY
    // --------------------------

    updateDailyActivity();


    // --------------------------
    // UPDATE ACHIEVEMENTS
    // --------------------------

    updateAchievements();

    updatePlayerDisplay();

}


// ------------------------------
// CHECK ACHIEVEMENTS
// ------------------------------

function updateAchievements() {

    const xp = getXP();

    const completedGames =
        getCompletedGames();


    // --------------------------
    // FIRST GAME
    // --------------------------

    if (completedGames >= 1) {

        localStorage.setItem(
            "achievement_first_game",
            "true"
        );

    }


    // --------------------------
    // 5 GAMES
    // --------------------------

    if (completedGames >= 5) {

        localStorage.setItem(
            "achievement_five_games",
            "true"
        );

    }


    // --------------------------
    // 10 GAMES
    // --------------------------

    if (completedGames >= 10) {

        localStorage.setItem(
            "achievement_ten_games",
            "true"
        );

    }


    // --------------------------
    // PERFECT SCORE
    // --------------------------

    if (
        localStorage.getItem(
            "mathoriaPerfectScore"
        )
    ) {

        localStorage.setItem(
            "achievement_perfect_score",
            "true"
        );

    }


    // --------------------------
    // 100 XP
    // --------------------------

    if (xp >= 100) {

        localStorage.setItem(
            "achievement_100xp",
            "true"
        );

    }


    // --------------------------
    // 500 XP
    // --------------------------

    if (xp >= 500) {

        localStorage.setItem(
            "achievement_500xp",
            "true"
        );

    }


    // --------------------------
    // LEVEL 10
    // --------------------------

    if (getLevel(xp) >= 10) {

        localStorage.setItem(
            "achievement_level10",
            "true"
        );

    }


    // --------------------------
    // 3 DAY STREAK
    // --------------------------

    if (getStreak() >= 3) {

        localStorage.setItem(
            "achievement_streak",
            "true"
        );

    }

}


// ------------------------------
// PLAYER DISPLAY
// ------------------------------

function updatePlayerDisplay() {

    const xp = getXP();

    const level =
        getLevel(xp);


    const levelElement =
        document.getElementById("playerLevel");

    const xpElement =
        document.getElementById("playerXP");


    if (levelElement) {

        levelElement.textContent =
            level;

    }


    if (xpElement) {

        xpElement.textContent =
            xp;

    }


    updateAchievements();

}


// ------------------------------
// GET LOCAL DATE
// ------------------------------
// Uses the user's local browser date
// instead of UTC.

function getLocalDate() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ------------------------------
// DAILY ACTIVITY
// ------------------------------

function updateDailyActivity() {

    const today =
        getLocalDate();


    const lastPlayed =
        localStorage.getItem(
            "mathoriaLastPlayed"
        );


    // First time playing
    if (!lastPlayed) {

        localStorage.setItem(
            "mathoriaLastPlayed",
            today
        );

        localStorage.setItem(
            "mathoriaStreak",
            "1"
        );

        return;

    }


    // Already played today
    if (lastPlayed === today) {

        return;

    }


    const lastDate =
        new Date(lastPlayed);

    const currentDate =
        new Date(today);


    const difference =
        Math.floor(
            (
                currentDate -
                lastDate
            ) /
            (1000 * 60 * 60 * 24)
        );


    // Played the next day
    if (difference === 1) {

        let streak =
            Number(
                localStorage.getItem(
                    "mathoriaStreak"
                )
            ) || 1;


        streak++;


        localStorage.setItem(
            "mathoriaStreak",
            streak
        );

    }


    // Missed a day or more
    else {

        localStorage.setItem(
            "mathoriaStreak",
            "1"
        );

    }


    localStorage.setItem(
        "mathoriaLastPlayed",
        today
    );

}


// ------------------------------
// GET STREAK
// ------------------------------

function getStreak() {

    return Number(
        localStorage.getItem(
            "mathoriaStreak"
        )
    ) || 0;

}


// ------------------------------
// INITIALIZE
// ------------------------------

updateDailyActivity();

updatePlayerDisplay();