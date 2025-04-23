(()=> {
    // Declaring elements
    const form_element = document.getElementById('form');
    const grid_container = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const attemptElement = document.getElementById('attempts');
    
    // Creating variables
    let flipped_cards = [];
    let isChecking = false;
    let score = 0;
    let attempts = 0;
    
    // createGrid() function creates the grid dynamically and fills it in with random numbers
    function createGrid(rows, columns, arr) {
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        let index = 0;

        for (let i = 0; i < rows; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement("td");
                cell.classList.add('card');
                cell.dataset.value = arr[index];
                cell.innerText = '';
                cell.addEventListener('click', cardGame);
                row.appendChild(cell);
                index++
            }
            tblBody.appendChild(row);
        }
        tbl.appendChild(tblBody);
        grid_container.innerHTML = '';
        grid_container.appendChild(tbl);
    }

    // checkMatch() checks if the two cards that are flipped have the same value
    function checkMatch(card1, card2) {
        return new Promise((resolve, reject) => {
            if (card1.dataset.value === card2.dataset.value) {
                resolve();
            } else {
                reject();
            }
        })
    }


    // cardGame() is initiated based on clicking a card, uses checkMatch to update score, attempts, and determine if cards should remain flipped "up"
    function cardGame(event) {
        if (isChecking) return;
        const card = event.target;
        if (card.classList.contains('matched') || flipped_cards.includes(card)) return;
        card.innerText = card.dataset.value;
        flipped_cards.push(card);

        if(flipped_cards.length === 2) {
            attempts += 1;
            updateAttemptsDisplay();
            isChecking = true;
            const [first, second] = flipped_cards;
            checkMatch(first, second)
                .then(()=> {
                    first.classList.add('matched');
                    second.classList.add('matched');
                    flipped_cards = [];
                    score += 10;
                    updateScoreDisplay();

                })
                .catch(() => {
                    setTimeout(() => {
                        first.innerText = '';
                        second.innerText = '';
                        flippedCards = [];
                    }, 1000);
                })
                .finally(() => {
                    flipped_cards = [];
                    setTimeout(() => isChecking = false, 1000);
                })
        }
    }

    // shuffle() shuffles numbers from a given array and returns shuffled array
    function shuffle(arr) {
        let currentIndex = arr.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }

    // generateNums() generates numbers based on user input of rows & columns, returns an array
    function generateNums(rows, columns) {
        const total = rows * columns;
        const nums = [];
        for (let i = 0; i < total/2; i++) {
            nums.push(i, i);
        }
        return nums;
    }

    // Updates Score display using local storage
    function updateScoreDisplay() {
        scoreElement.innerText = score;
        localStorage.setItem('memoryGameScore', score);
    }

    // Updates Attempts display using local storage
    function updateAttemptsDisplay() {
        attemptElement.innerText = attempts;
        localStorage.setItem('memoryGameAttempts', attempts);
    }

    // Loads Score from local storage
    function loadStoredScore() {
        const stored = localStorage.getItem('memoryGameScore');
        score = stored ? parseInt(stored, 10) : 0;
        updateScoreDisplay();
    }

    // Loads Attempts from local storage
    function loadStoredAttempts() {
        const stored = localStorage.getItem('memoryGameAttempts');
        attempts = stored ? parseInt(stored, 10) : 0;
        updateAttemptsDisplay();
    }

    // Initiates game based on user submitting rows & columns; makes sure the values are even
    form_element.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const rows = data.get('rows');
        const columns = data.get('columns');
        if ((rows * columns) % 2 !== 0 || rows * columns > 100) {
            alert("Please enter even numbers and keep grid size managable");
            return;
        }
        let arr = generateNums(rows, columns);
        arr = shuffle(arr);
        createGrid(rows, columns, arr);
    })

    // Resets game 
    form_element.addEventListener('reset', (event) => {
        event.preventDefault();
        grid_container.innerHTML = '';
        flipped_cards = [];
        isChecking = false;
        const rowInput = form_element.querySelector('[name="rows"]');
        const colInput = form_element.querySelector('[name="columns"]');
        rowInput.value = '';
        colInput.value = '';
        score = 0;
        attempts = 0;
        updateScoreDisplay();
        updateAttemptsDisplay();
    })

    // Loads score & attempts on reload of page
    loadStoredScore();
    loadStoredAttempts();

}) ();
