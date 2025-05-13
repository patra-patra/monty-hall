document.addEventListener("DOMContentLoaded", function () {
    // Элементы DOM
    const doors = document.querySelectorAll(".door");
    const messageEl = document.querySelector(".message");
    const switchBtn = document.getElementById("switch-btn");
    const stayBtn = document.getElementById("stay-btn");
    const restartBtn = document.getElementById("restart-btn");
    const gamesPlayedEl = document.getElementById("games-played");
    const winsEl = document.getElementById("wins");
    const lossesEl = document.getElementById("losses");
    const winRateEl = document.getElementById("win-rate");

    // Статистика
    let stats = {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        switchWins: 0,
        stayWins: 0,
    };

    // Состояние игры
    let gameState = {
        prizeDoor: null,
        firstChoice: null,
        openedDoor: null,
        finalChoice: null,
        gameOver: false,
    };

    // Инициализация игры
    function initGame() {
        // Сброс состояния
        gameState = {
            prizeDoor: Math.floor(Math.random() * 3) + 1,
            firstChoice: null,
            openedDoor: null,
            finalChoice: null,
            gameOver: false,
        };

        // Сброс UI
        doors.forEach((door) => {
            door.classList.remove("open");
            const back = door.querySelector(".door-back");
            back.querySelector(".prize-image").classList.add("hidden");
            back.querySelector(".goat-image").classList.add("hidden");
            back.querySelector(".prize-text").textContent = "";
        });

        // Сброс кнопок
        switchBtn.disabled = true;
        stayBtn.disabled = true;

        // Сообщение
        messageEl.className = "message info";
        messageEl.textContent = "Выберите одну из трёх дверей";

        console.log("Приз за дверью:", gameState.prizeDoor); // Для отладки
    }

    // Открытие двери с козой (после первого выбора)
    function openGoatDoor() {
        // Найти дверь, которую можно открыть (не приз и не выбранная игроком)
        let doorToOpen = null;

        for (let i = 1; i <= 3; i++) {
            if (i !== gameState.prizeDoor && i !== gameState.firstChoice) {
                doorToOpen = i;
                break;
            }
        }

        // Если есть выбор между двумя дверьми с козами, выбрать случайную
        const possibleDoors = [];
        for (let i = 1; i <= 3; i++) {
            if (i !== gameState.prizeDoor && i !== gameState.firstChoice) {
                possibleDoors.push(i);
            }
        }

        if (possibleDoors.length > 1) {
            doorToOpen =
                possibleDoors[Math.floor(Math.random() * possibleDoors.length)];
        } else {
            doorToOpen = possibleDoors[0];
        }

        gameState.openedDoor = doorToOpen;

        // Открыть дверь в UI
        const doorEl = document.querySelector(
            `.door[data-door="${doorToOpen}"]`
        );
        doorEl.classList.add("open");

        const back = doorEl.querySelector(".door-back");
        back.querySelector(".goat-image").classList.remove("hidden");
        back.querySelector(".prize-text").textContent = "Коза";

        // Активировать кнопки выбора
        switchBtn.disabled = false;
        stayBtn.disabled = false;

        // Обновить сообщение
        messageEl.className = "message warning";
        messageEl.textContent = `Я открыл дверь ${doorToOpen} с козой. Хотите сменить выбор?`;
    }

    // Финальный выбор (смена или оставить)
    function makeFinalChoice(switchChoice) {
        if (gameState.gameOver) return;

        gameState.gameOver = true;

        if (switchChoice) {
            // Найти дверь, на которую можно переключиться
            for (let i = 1; i <= 3; i++) {
                if (i !== gameState.firstChoice && i !== gameState.openedDoor) {
                    gameState.finalChoice = i;
                    break;
                }
            }
        } else {
            gameState.finalChoice = gameState.firstChoice;
        }

        // Открыть все двери
        doors.forEach((door) => {
            const doorNumber = parseInt(door.getAttribute("data-door"));
            const back = door.querySelector(".door-back");

            if (doorNumber === gameState.prizeDoor) {
                back.querySelector(".prize-image").classList.remove("hidden");
                back.querySelector(".prize-text").textContent = "Приз!";
            } else if (doorNumber !== gameState.openedDoor) {
                back.querySelector(".goat-image").classList.remove("hidden");
                back.querySelector(".prize-text").textContent = "Коза";
            }

            door.classList.add("open");
        });

        // Проверить результат
        const isWin = gameState.finalChoice === gameState.prizeDoor;

        // Обновить статистику
        stats.gamesPlayed++;
        if (isWin) {
            stats.wins++;
            if (switchChoice) stats.switchWins++;
            else stats.stayWins++;

            messageEl.className = "message success";
            messageEl.textContent = `Поздравляем! Вы выиграли приз! (${switchChoice ? "сменили" : "оставили"} выбор)`;
        } else {
            stats.losses++;
            messageEl.className = "message error";
            messageEl.textContent = `К сожалению, вы проиграли. (${switchChoice ? "сменили" : "оставили"} выбор)`;
        }

        // Обновить статистику в UI
        updateStats();
    }

    // Обновление статистики
    function updateStats() {
        gamesPlayedEl.textContent = stats.gamesPlayed;
        winsEl.textContent = stats.wins;
        lossesEl.textContent = stats.losses;
        winRateEl.textContent =
            stats.gamesPlayed > 0
                ? Math.round((stats.wins / stats.gamesPlayed) * 100)
                : 0;
    }

    // Обработчики событий
    doors.forEach((door) => {
        door.addEventListener("click", function () {
            if (gameState.gameOver || gameState.firstChoice) return;

            const doorNumber = parseInt(this.getAttribute("data-door"));
            gameState.firstChoice = doorNumber;

            // Подсветить выбранную дверь
            this.style.boxShadow = "0 0 15px gold";

            // Открыть дверь с козой
            openGoatDoor();
        });
    });

    switchBtn.addEventListener("click", function () {
        makeFinalChoice(true);
    });

    stayBtn.addEventListener("click", function () {
        makeFinalChoice(false);
    });

    restartBtn.addEventListener("click", function () {
        initGame();
    });

    // Начать первую игру
    initGame();
});
