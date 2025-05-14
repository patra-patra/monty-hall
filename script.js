document.addEventListener("DOMContentLoaded", function () {
    const doors = document.querySelectorAll(".door");
    const messageEl = document.querySelector(".message");
    const switchBtn = document.getElementById("switch-btn");
    const stayBtn = document.getElementById("stay-btn");
    const restartBtn = document.getElementById("restart-btn");
    const inputs = document.querySelectorAll(".door-input");

    let prizeDoor, firstChoice, openedDoor, finalChoice, gameOver;

    function initGame() {
        prizeDoor = Math.floor(Math.random() * 3) + 1;
        firstChoice = null;
        openedDoor = null;
        finalChoice = null;
        gameOver = false;

        doors.forEach((door) => {
            door.classList.remove("open", "selected");
            const back = door.querySelector(".door-back");
            back.querySelector(".prize-image").classList.add("hidden");
            back.querySelector(".goat-image").classList.add("hidden");
        });

        inputs.forEach((input) => (input.checked = false));

        switchBtn.disabled = true;
        stayBtn.disabled = true;

        messageEl.className = "message info";
        messageEl.textContent = "Выберите одну из трёх дверей";
    }

    function openGoatDoor() {
        const candidates = [1, 2, 3].filter(
            (n) => n !== prizeDoor && n !== firstChoice
        );
        openedDoor = candidates[Math.floor(Math.random() * candidates.length)];

        const doorEl = document.querySelector(`.door[data-door="${openedDoor}"]`);
        doorEl.classList.add("open");
        const back = doorEl.querySelector(".door-back");
        back.querySelector(".goat-image").classList.remove("hidden");

        switchBtn.disabled = false;
        stayBtn.disabled = false;

        messageEl.className = "message warning";
        messageEl.textContent = `Я открыл дверь ${openedDoor} с козой. Хотите сменить выбор?`;
    }

    function makeFinalChoice(switchChoice) {
        if (gameOver) return;
        gameOver = true;

        finalChoice = switchChoice
            ? [1, 2, 3].find((n) => n !== firstChoice && n !== openedDoor)
            : firstChoice;

        // Подсветка финального выбора
        doors.forEach((door) => door.classList.remove("selected"));
        const selectedDoorEl = document.querySelector(`.door[data-door="${finalChoice}"]`);
        selectedDoorEl.classList.add("selected");

        doors.forEach((door) => {
            const num = parseInt(door.dataset.door);
            const back = door.querySelector(".door-back");

            if (num === prizeDoor) {
                back.querySelector(".prize-image").classList.remove("hidden");
            } else if (num !== openedDoor) {
                back.querySelector(".goat-image").classList.remove("hidden");
            }

            door.classList.add("open");
        });

        const win = finalChoice === prizeDoor;
        messageEl.className = `message ${win ? "success" : "error"}`;
        messageEl.textContent = win
            ? "Поздравляем! Вы выиграли!"
            : "Увы, вы выбрали козу.";
    }

    doors.forEach((door) => {
        door.addEventListener("click", () => {
            if (gameOver || firstChoice) return;
            firstChoice = parseInt(door.dataset.door);

            doors.forEach(d => d.classList.remove("selected"));
            door.classList.add("selected");

            openGoatDoor();
        });
    });

    switchBtn.addEventListener("click", () => makeFinalChoice(true));
    stayBtn.addEventListener("click", () => makeFinalChoice(false));
    restartBtn.addEventListener("click", initGame);

    initGame();
});
