var body = document.querySelector('body')

var board = document.getElementById("table-board")
var benchKittensPlayer1 = document.getElementById("bench-kittens-player-1")
var benchKittensPlayer2 = document.getElementById("bench-kittens-player-2")
var divMenu = document.getElementById("div-menu")
var divGameArea = document.getElementById("div-game-area")
var divHeader = document.getElementById("div-header")
var divHist = document.getElementById("div-hist")
var divTimer = document.getElementById("div-timer")
var section = document.getElementById("main-section")
var buttonPlay = document.getElementById("button-play")
var buttonHistory = document.getElementById("button-history")
var buttonClearHistory = document.getElementById("button-clear-history")
var buttonCloseModalHistory = document.getElementById("button-close-history")
var buttonPlayAgain = document.getElementById('btn-play-again')
var buttonSave = document.getElementById("btn-save")
var listHistory = document.querySelector(".list-history")
var modal = document.querySelector(".modal");
var overlay = document.querySelector(".overlay");
var modalHistory = document.querySelector(".modalHistory")
var overlayHistory = document.querySelector(".overlayHistory");
var modalBg = document.querySelector('.modal-bg')
var modalClose = document.querySelector('.modal-close')
var timeElement = document.querySelector('.watch .timer');
var spanActivePlayer = document.querySelector('.span-active-player')
var divGame = document.getElementById("div-game")
var inputPlayer1 = document.getElementById("first-player-name")
var inputPlayer2 = document.getElementById("second-player-name")
var inputDimension = document.getElementById("board-dimension")
var inputNumberKittens = document.getElementById("number-of-kittens-per-player")
var inputNumberOfPoints = document.getElementById("number-of-points")
var spanScorePlayer1 = document.getElementById("score-player-1")
var spanScorePlayer2 = document.getElementById("score-player-2")
var spanPlayer1 = document.getElementById("name-player-1")
var spanPlayer2 = document.getElementById("name-player-2")
var spanNumberKittensPlayer1 = document.querySelector('.number-kittens-1')
var spanNumberKittensPlayer2 = document.querySelector('.number-kittens-2')
var spanWinner = document.getElementById("span-winner")
var spanFinalScore = document.getElementById("span-final-score")

let playerName1 = "Player 1";
let playerName2 = "Player 2";
let scorePlayer1 = 0
let scorePlayer2 = 0
let maxNumberOfPoints = 5
let numberOfKittensPerPlayer
let numberOfKittensPlayer1
let numberOfKittensPlayer2
let matrix = [[]]
let activePlayer = 1
let tableDimension = 6 // Table dimension
let DEFAULT_SECONDS = 120
let seconds = DEFAULT_SECONDS // Fix to 180
let startTime = null
let colorFormat = ""
let doNotReceive = false

function timer() {
    if (seconds > 1) {
        seconds--;

        let secs = seconds % 60
        let mins = Math.floor(seconds/60)

        divTimer.innerHTML = `0${mins} : ${secs < 10 ? "0" : ""}${secs}`

        // Play with colors to improve the experience
        if (seconds <= 5) {
            if (seconds%2 === 0) {
                colorFormat = "#E57373"
            } else {
                colorFormat = "#66BB6A"
            }
        }

        divTimer.style.color = colorFormat

        if (!doNotReceive) {
            checkSayWinner()
        }
    } else {
        divTimer.innerHTML = "Time out"
        divTimer.style.color = "#EF5350"
        timeOut = true
        checkSayWinner()
        stopTimer()
    }
}

function LoadBenchPlayer() {
    LoadBenchPlayer1()
    LoadBenchPlayer2()
}
 
function Load() {
    setUpWinAdjacents()
    LoadTable()
    LoadBenchPlayer()
}

function LoadTable() {
    board.innerHTML = "";
    
    let N = tableDimension
    for (let i = 0; i < N; i++) {
        let tr = document.createElement('tr')
        for (let j = 0; j < N; j++) {
            let td = document.createElement('td')

            td.style.width = "75px";
            td.style.height = "75px";
            td.style.alignItems = "center";
            td.style.alignSelf = "center";
            td.style.justifyContent = "center";
            td.style.textAlign = "center";
            td.style.verticalAlign = "middle";
            td.className = "animate-image";
            
            tr.appendChild(td)
        }
        board.appendChild(tr)
    }
}

function LoadBenchPlayer1() {
    benchKittensPlayer1.innerHTML = ""
    
    let N = numberOfKittensPerPlayer/4, M = 4 

    let total = numberOfKittensPlayer1
    for (let i = 0; i < N; i++) {
        let trKittensPlayer1 = document.createElement('tr')

        for (let j = 0; j < M; j++) {

            let tdKittensPlayer1 = document.createElement('td')

            if (total > 0) {
                let imgKittensPlayer1 = document.createElement('img')
                imgKittensPlayer1.src = "img/cat-head-100-orange.png"
                imgKittensPlayer1.alt = "Kitten Player 1"
                tdKittensPlayer1.appendChild(imgKittensPlayer1)                
            }

            trKittensPlayer1.appendChild(tdKittensPlayer1)

            total--
        }

        benchKittensPlayer1.appendChild(trKittensPlayer1)
    }
}

function LoadBenchPlayer2() {
    benchKittensPlayer2.innerHTML = ""
    
    let N = numberOfKittensPerPlayer/4, M = 4 

    let total = numberOfKittensPlayer2
    for (let i = 0; i < N; i++) {
        let trKittensPlayer2 = document.createElement('tr')

        for (let j = 0; j < M; j++) {
            let tdKittensPlayer2 = document.createElement('td')

            if (total > 0) {
                let imgKittensPlayer2 = document.createElement('img')
                imgKittensPlayer2.src = "img/cat-head-100-grey.png"
                imgKittensPlayer2.alt = "Kitten Player 2"
                tdKittensPlayer2.appendChild(imgKittensPlayer2)                
            }

            trKittensPlayer2.appendChild(tdKittensPlayer2)

            total--
        }

        benchKittensPlayer2.appendChild(trKittensPlayer2)
    }
}

let isMenuVisible = true
buttonPlay.addEventListener('click', function (e) { 
    e.preventDefault()

    if (inputPlayer1.value === null || inputPlayer2.value === null) {
        alert("Please, fill all the fields")
    } else {
        playMeow()
        startInterval()
        playTiming()

        if (isMenuVisible) {
            playerName1 = inputPlayer1.value
            playerName2 = inputPlayer2.value

            numberOfKittensPerPlayer = inputNumberKittens.value
            tableDimension = inputDimension.value
            maxNumberOfPoints = inputNumberOfPoints.value

            isMenuVisible = false

            showGame()
        } else {
            isMenuVisible = true

            showMenu()
        }        
    }
})

buttonPlayAgain.addEventListener('click', function (e) { 
    e.preventDefault()
    closeModal()
    playMeow()
    playTiming()
    stopWinningSong()
    startInterval()
    showGame()
})

buttonHistory.addEventListener('click', function (e) {
    e.preventDefault()
    let history = JSON.parse(localStorage.getItem('history'))

    if (history === null) {
        alert("No history for now. Sorry! Play at least one time with your friend.")
    } else {
        hideMenuShowHistoryModal()
        listHistory.innerHTML = ''
        for (let x of history) {
            let li = document.createElement('li')
            li.innerText = x
            listHistory.appendChild(li)
        }
    }
})


buttonClearHistory.addEventListener('click', function (e) {
    e.preventDefault()
    localStorage.removeItem('history');
    alert("History cleared successfully!")
})

buttonCloseModalHistory.addEventListener('click', function (e) {
    e.preventDefault()
    closeModalHistory()
})

buttonSave.addEventListener('click', function (e) {
    e.preventDefault()
    saveData()
    console.log(localStorage)
})

function hideMenuShowHistoryModal() {
    openModalHistory()
}

function saveData() {
    localStorage.setItem('playerName1', playerName1); 
    localStorage.setItem('scorePlayer1', scorePlayer1); 
    localStorage.setItem('numberOfKittensPlayer1', numberOfKittensPlayer1)

    localStorage.setItem('playerName2', playerName2); 
    localStorage.setItem('scorePlayer2', scorePlayer2); 
    localStorage.setItem('numberOfKittensPlayer2', numberOfKittensPlayer2)

    localStorage.setItem('numberOfKittensPerPlayer', numberOfKittensPerPlayer)
    localStorage.setItem('activePlayer', activePlayer)
    localStorage.setItem('seconds', seconds)
    localStorage.setItem('DEFAULT_SECONDS', DEFAULT_SECONDS)
    localStorage.setItem('tableDimension', tableDimension)
    localStorage.setItem('startTime', startTime)
    localStorage.setItem('maxNumberOfPoints', maxNumberOfPoints)

    matrix = []
    for (let i = 0; i < tableDimension; i++) {
        matrix[i] = []
        for (let j = 0; j < tableDimension; j++) {
            let cell_origin = getIdCell(i, j)
            matrix[i][j] = cell_origin
        }
    }

    localStorage.setItem('matrix', JSON.stringify(matrix))
}

function clearData() {
    localStorage.removeItem('playerName1');
    localStorage.removeItem('scorePlayer1');
    localStorage.removeItem('numberOfKittensPlayer1');
    localStorage.removeItem('playerName2');
    localStorage.removeItem('scorePlayer2');
    localStorage.removeItem('numberOfKittensPlayer2');
    localStorage.removeItem('numberOfKittensPerPlayer');
    localStorage.removeItem('activePlayer');
    localStorage.removeItem('seconds');
    localStorage.removeItem('DEFAULT_SECONDS');
    localStorage.removeItem('tableDimension');
    localStorage.removeItem('startTime');
    localStorage.removeItem('maxNumberOfPoints');
}

function loadData() {
    playerName1 = localStorage.getItem('playerName1');
    scorePlayer1 = localStorage.getItem('scorePlayer1')
    numberOfKittensPlayer1 = localStorage.getItem('numberOfKittensPlayer1')

    playerName2 = localStorage.getItem('playerName2')
    scorePlayer2 = localStorage.getItem('scorePlayer2')
    numberOfKittensPlayer2 = localStorage.getItem('numberOfKittensPlayer2')

    numberOfKittensPerPlayer = localStorage.getItem('numberOfKittensPerPlayer')
    activePlayer = localStorage.getItem('activePlayer')
    seconds = localStorage.getItem('seconds')
    DEFAULT_SECONDS = localStorage.getItem('DEFAULT_SECONDS')
    tableDimension = localStorage.getItem('tableDimension')
    startTime = localStorage.getItem('startTime')
    maxNumberOfPoints = localStorage.getItem('maxNumberOfPoints')

    matrix = JSON.parse(localStorage.getItem('matrix'))

    console.log("Loaded matrix = ")
    console.log(matrix)
    console.log(tableDimension)

    for (let i = 0; i < tableDimension; i++) {
        for (let j = 0; j < tableDimension; j++) {
            if (matrix === null) continue
            if (matrix[i][j] == -1)
                continue

            let imgKittensPlayer = document.createElement('img')

            let nameImage = "img/cat-head-100-orange.png" // Just in case
            if (matrix[i][j] == 1) {
                nameImage = "img/cat-head-100-orange.png";
            } else {
                nameImage = "img/cat-head-100-grey.png";
            }

            imgKittensPlayer.src = nameImage
            board.rows[i].cells[j].appendChild(imgKittensPlayer)
        }
    }

    reloadInterface()
}

function reloadInterface () {
    spanPlayer1.innerText = "Player 1: " + playerName1
    spanPlayer2.innerText = "Player 2: " + playerName2

    spanScorePlayer1.innerText = "Points: " + scorePlayer1 + " / " + maxNumberOfPoints
    spanScorePlayer2.innerText = "Points: " + scorePlayer2 + " / " + maxNumberOfPoints

    updateActivePlayer()
    updateNumberKittens()
}

window.addEventListener("load", (event) => {
    const name = localStorage.getItem('playerName1')
    if (name) {
        LoadTable()
        showGame()
        Load()
        loadData()
        clearData()
        // localStorage.clear()
    }
})

let audioPlaying = null
let audioWinning = null

function playTiming() {
    // Uncomment for better experience

/*    audioPlaying = new Audio("audio/battle-cats.mp3")
    audioPlaying.loop = true
    audioPlaying.play()
    audioPlaying.volume = 0.3*/
}

function stopTimingSound() {
/*    if (audioPlaying != null) {
        audioPlaying.pause()
        audioPlaying.currentTime = 0        
    }*/
}

function playPlaceCat() {
    let audio = new Audio("audio/kitten-meow-place.mp3")
    audio.play()
}


function playWinningSong() {
    let audioWinning = new Audio("audio/cat-sing-sound.mp3")
    audioWinning.play()
}

function stopWinningSong() {
    if (audioWinning != null) {
        audioWinning.pause()
        audioWinning.currentTime = 0
    }
}

function playBoopMeow() {
    let audio = new Audio("audio/cat-push-away.mp3")
    audio.play()
}

function playMeow() {
    let audio = new Audio("audio/cat-placing.mp3")
    audio.play()
}

function showMenu() {
    divGame.style.display = "none"
    divMenu.style.display = "block"
    divHist.style.display = "block"
}

function showGame() {
    closeModal()
    divMenu.style.display = "none"
    divGame.style.display = "block"
    divHist.style.display = "none"

    spanPlayer1.innerText = "Player 1: " + playerName1
    spanPlayer2.innerText = "Player 2: " + playerName2

    spanScorePlayer1.innerText = "Points: " + scorePlayer1 + " / " + maxNumberOfPoints
    spanScorePlayer2.innerText = "Points: " + scorePlayer2 + " / " + maxNumberOfPoints

    doNotReceive = false
    
    updateActivePlayer()

    body.style.backgroundImage = "none"

    numberOfKittensPlayer1 = numberOfKittensPlayer2 = numberOfKittensPerPlayer
    LoadBenchPlayer()

    updateNumberKittens()
}

function updateActivePlayer() {
    if (activePlayer == 1) {
        spanActivePlayer.innerText = "Active Player: " + playerName1
    } else {
        spanActivePlayer.innerText = "Active Player: " + playerName2
    }

    // Reset timer in case he could think faster
    resetTimerChangePlayer()
}

function updateNumberKittens() {
    spanNumberKittensPlayer1.innerText = numberOfKittensPlayer1 + " Orange Kittens"
    spanNumberKittensPlayer2.innerText = numberOfKittensPlayer2 + " Grey Kittens"

    LoadBenchPlayer1()
    LoadBenchPlayer2()
}

function startInterval () {
    startTime = setInterval(function () {
        timer()
    }, 1000)
}

function stopTimer() {
    clearInterval(startTime)
}

let adjacents_y = [], adjacents_x = []

Load()

function delegate (parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}

function updateNextPlayerToPlay() {
    activePlayer = 1 + activePlayer%2
    // console.log("Active => " + activePlayer)
}

delegate(board, 'click', 'td', function (e) {
    if (this.firstChild) {
        e.preventDefault()
        console.log("Busy cell")
    } else {
        this.innerHTML = ''
        let imgKittensPlayer = document.createElement('img')

        let nameImage = "img/cat-head-100-orange.png" // Just in case
        if (activePlayer == 1) {
            nameImage = "img/cat-head-100-orange.png";
        } else {
            nameImage = "img/cat-head-100-grey.png";
        }

        imgKittensPlayer.src = nameImage

        this.appendChild(imgKittensPlayer)

        // Check Boop
        let row = e.target.parentNode.rowIndex
        let col = e.target.cellIndex

        indicateKittens(row, col)

        if (activePlayer == 1) {
            numberOfKittensPlayer1 = Math.max(0, numberOfKittensPlayer1 - 1)
        } else {
            numberOfKittensPlayer2 = Math.max(0, numberOfKittensPlayer2 - 1)
        }
    
        updateNextPlayerToPlay()
        updateActivePlayer()
        updateNumberKittens()
        LoadBenchPlayer()
    }
})

let dy = [ -1, -1, -1,  0, 0,  1, 1, 1] // Directional vectors for rows
let dx = [ -1,  0,  1, -1, 1, -1, 0, 1] // Directional vectors for columns

function isValidCoordinate(N, x, y) {
    return x >= 0 && x < N && y >= 0 && y < N;
}

function checkBoopSituation(row, col) {
    
    let hasBoop = false
    let posBoops = []
    for (let i = 0; i < dy.length; ++i) {
        let ii = row + dy[i];
        let jj = col + dx[i];

        if (isValidCoordinate(tableDimension, ii, jj)) {
            let val = board.rows[ii].cells[jj]
            if (val.firstChild) {
                hasBoop = true
                posBoops.push({ii, jj})
            }
        }
    }

    if (hasBoop) {
        for (let item of posBoops) {
            pullKitten(item.ii, item.jj, row, col)
        }

        setTimeout(function () {
            performCheckingWinningPositions()
        }, 900)
    }
}

function getAdjacents(row, col) {
    let hasBoop = false
    let posBoops = []
    for (let i = 0; i < dy.length; ++i) {
        let ii = row + dy[i];
        let jj = col + dx[i];

        if (isValidCoordinate(tableDimension, ii, jj)) {
            let val = board.rows[ii].cells[jj]
            if (val.firstChild) {
                hasBoop = true
                posBoops.push({ii, jj})
            }
        }
    }

    if (hasBoop) {
        return posBoops
    }

    return null
}

function indicateKittens(row, col) {
    playPlaceCat()

    let posBoops = getAdjacents(row, col)
    if (posBoops == null) return null

    for (let item of posBoops) {
        if (item.ii == row && item.jj == col)
            continue
        board.rows[item.ii].cells[item.jj].style.backgroundColor = "#e9c4c8"
    }

    setTimeout(function () {
        for (let item of posBoops) {
            if (item.ii == row && item.jj == col)
                continue
            board.rows[item.ii].cells[item.jj].style.backgroundColor = ""
        }
        checkBoopSituation(row, col)
    }, 75)
}

function pullKitten(iTarget, jTarget, rowTable, colTable) {
    if (jTarget === colTable && (iTarget - rowTable) < 0) {
        BoopDownToUp(iTarget, jTarget)
        console.log("Boop down to up.")
    } else
        if (jTarget === colTable && (iTarget - rowTable) > 0) {
            BoopUpToDown(iTarget, jTarget)
            console.log("Boop up to down.")
        } else
            if (iTarget === rowTable && (jTarget - colTable) < 0) {
                BoopRightToLeft(iTarget, jTarget)
                console.log("Boop right to left")
            } else 
                if (iTarget === rowTable && (jTarget - colTable) > 0) {
                    BoopLeftToRight(iTarget, jTarget)
                    console.log("Boop left to right")
                } else
                    if ((iTarget + 1 == rowTable) && (jTarget - colTable) < 0) {
                        BoopDownUpLeftDiagonal(iTarget, jTarget)
                        console.log("Boop down up left diagonal")
                    } else 
                        if ((iTarget - 1 == rowTable) && (jTarget - colTable) > 0) {
                            BoopUpDownRightDiagonal(iTarget, jTarget)
                            console.log("Boop up down right diagonal")
                        } else 
                            if ((jTarget - 1 == colTable) && (iTarget - rowTable) < 0) {
                                BoopDownUpRightDiagonal(iTarget, jTarget)
                                console.log("Boop down up right diagonal")
                            } else if ((jTarget + 1 == colTable && (iTarget - rowTable) > 0)){
                                BoopUpDownLeftDiagonal(iTarget, jTarget)
                                console.log("Boop up down left diagonal")
                            }
}

const startTransform = 300
const endTransform = 400

var id = null
function BoopDownToUp(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row - 1, col)) {
        let up = board.rows[row - 1].cells[col]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(-77.9px)";

            setTimeout(function () {
                board.rows[row - 1].cells[col].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        board.rows[row].cells[col].style.transform = "translateY(-77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function BoopUpToDown(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row + 1, col)) {
        let up = board.rows[row + 1].cells[col]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(77.9px)";

            setTimeout(function () {
                board.rows[row + 1].cells[col].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        let tmp = board.rows[row].cells[col].innerHTML
        board.rows[row].cells[col].style.transform = "translateY(77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function BoopRightToLeft(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row, col - 1)) {
        let up = board.rows[row].cells[col - 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateX(-77.9px)";

            setTimeout(function () {
                board.rows[row].cells[col - 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        let tmp = board.rows[row].cells[col].innerHTML
        board.rows[row].cells[col].style.transform = "translateX(-77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)


        whoWasDroopedOut(val)
    }
}

function BoopLeftToRight(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row, col + 1)) {
        let up = board.rows[row].cells[col + 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateX(77.9px)";

            setTimeout(function () {
                board.rows[row].cells[col + 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        let tmp = board.rows[row].cells[col].innerHTML
        board.rows[row].cells[col].style.transform = "translateX(77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)


        whoWasDroopedOut(val)
    }
}

function BoopDownUpLeftDiagonal(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row - 1, col - 1)) {
        let up = board.rows[row - 1].cells[col - 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(-77.9px) translateX(-77.9px)";

            setTimeout(function () {
                board.rows[row - 1].cells[col - 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        board.rows[row].cells[col].style.transform = "translateY(-77.9px) translateX(-77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function BoopUpDownRightDiagonal(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row + 1, col + 1)) {
        let up = board.rows[row + 1].cells[col + 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(77.9px) translateX(77.9px)";

            setTimeout(function () {
                board.rows[row + 1].cells[col + 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        board.rows[row].cells[col].style.transform = "translateY(77.9px) translateX(77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function BoopDownUpRightDiagonal(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row - 1, col + 1)) {
        let up = board.rows[row - 1].cells[col + 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(-77.9px) translateX(77.9px)";

            setTimeout(function () {
                board.rows[row - 1].cells[col + 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        board.rows[row].cells[col].style.transform = "translateY(-77.9px) translateX(77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function BoopUpDownLeftDiagonal(row, col) {
    let val = board.rows[row].cells[col]
    if (isValidCoordinate(tableDimension, row + 1, col - 1)) {
        let up = board.rows[row + 1].cells[col - 1]
        if (up.firstChild) {
            console.log("Can not be booped.")
        } else {
            console.log("Boop him :)")
            
            let tmp = board.rows[row].cells[col].innerHTML
            board.rows[row].cells[col].style.transform = "translateY(77.9px) translateX(-77.9px)";

            setTimeout(function () {
                board.rows[row + 1].cells[col - 1].innerHTML = tmp;
                board.rows[row].cells[col].style.border = "none";
                board.rows[row].cells[col].innerHTML = '';
                board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
            }, startTransform)

            setTimeout(function () {
                board.rows[row].cells[col].style.border = "0.5px solid grey"
            }, endTransform)

        }
    } else {
        console.log("Out of the board.")
            
        board.rows[row].cells[col].style.transform = "translateY(77.9px) translateX(-77.9px)";

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "none";
            board.rows[row].cells[col].innerHTML = '';
            board.rows[row].cells[col].style.transform = "translateY(0px) translateX(0px)";
        }, startTransform)

        setTimeout(function () {
            board.rows[row].cells[col].style.border = "0.5px solid grey"
        }, endTransform)

        whoWasDroopedOut(val)
    }
}

function whoWasDroopedOut(val) {
    let str = val.getElementsByTagName('img')[0].getAttribute('src')

    let id = - 1
    if (str === "img/cat-head-100-grey.png") {
        id = 2
    } else {
        id = 1
    }

    if (id == 1) {
        numberOfKittensPlayer1 = Math.min(numberOfKittensPlayer1 + 1, numberOfKittensPerPlayer)
    } else {
        numberOfKittensPlayer2 = Math.min(numberOfKittensPlayer2 + 1, numberOfKittensPerPlayer)
    }

    updateActivePlayer()
    updateNumberKittens()
}

let beingDragged;

delegate(benchKittensPlayer1, 'dragstart', 'td', function(e) {
    if (activePlayer == 1) {
        beingDragged = e.target;
    } else {
        e.preventDefault()
    }
})

delegate(benchKittensPlayer2, 'dragstart', 'td', function(e) {
    if (activePlayer == 2) {
        beingDragged = e.target;
    } else {
        e.preventDefault()
    }
})

delegate(board, 'dragenter', 'td', function (e) {

    if (this.firstChild) {
        e.preventDefault()
        console.log("Busy cell")
    } else {
        if (beingDragged != null) {
            this.innerHTML = ''
            e.target.append(beingDragged)
        }    
        
        console.log("Left")
    }
})

delegate(board, 'dragend', 'td', function (e) {
    console.log("Drag completed.")
    beingDragged = null

    if (activePlayer == 1) {
        numberOfKittensPlayer1 = Math.max(0, numberOfKittensPlayer1 - 1)
    } else {
        numberOfKittensPlayer2 = Math.max(0, numberOfKittensPlayer2 - 1)
    }

    let row = e.parentNode
    let col = e.cellIndex

    cell = e.target.parentNode;
    row = cell.parentNode;
    cellIndex = cell.cellIndex;
    rowIndex = row.rowIndex;

    indicateKittens(rowIndex, cellIndex)

    updateNextPlayerToPlay()
    updateActivePlayer()
    updateNumberKittens()
    LoadBenchPlayer()
})


function detected(vet) {
    return vet.length === 3
}

function getIdCell(i, j) {
    let element = board.rows[i].cells[j].getElementsByTagName('img')

    if (element.length == 0)
        return -1

    let cell_origin = element[0].getAttribute('src')

    let str = "img/cat-head-100-orange.png"

    if (str.localeCompare(cell_origin) == 0)
        return 1

    return 2
}

function checkWinnigScorePosition() {
    let allPosKittens = []
    for (let i = 0; i < tableDimension; i++) {
        for (let j = 0; j < tableDimension; j++) {
            let cell_origin = getIdCell(i, j)

            if (cell_origin == - 1) continue

            for (let u = 0; u < adjacents_x.length; u++) {
                let posKittens = []
                for (let w = 0; w < adjacents_x[0].length; w++) {
                    let ii = i + adjacents_y[u][w]
                    let jj = j + adjacents_x[u][w]

                    console.log(posKittens)

                    if (isValidCoordinate(tableDimension, ii, jj)) {
                        let cell_dest = getIdCell(ii, jj)

                        console.log(cell_origin + " vs " + cell_dest)

                        if (cell_origin === cell_dest) {
                            // Count matches
                            posKittens.push({ii, jj, cell_origin})
                        }
                    }
                }

                if (detected(posKittens)) {
                    for (let c of posKittens) {
                        allPosKittens.push(c)
                    }
                }
            }
        }
    }  
        
    let res = []
    allPosKittens.forEach((element) => {
        let contains = false

        for (let x of res) {
            if (x.ii == element.ii && x.jj == element.jj && x.cell_dest == element.cell_dest) {
                contains = true
                break
            }
        }

        if (contains) {
            res.push(element)
        }
    })

    for (let x of res) {
        allPosKittens.push(x)
    }

    console.log("LENGTH = " + allPosKittens.length)

    let len = allPosKittens.length

    if ( len === 3 || len === 5 ) {
        return allPosKittens
    }

    return null
}

function setUpWinAdjacents(){
    main_diagonal_y = [0, -1, 1]
    main_diagonal_x = [0, -1, 1]

    second_diangonal_y = [0,  1, -1]
    second_diangonal_x = [0, -1,  1]

    collumn_y = [0, -1, 1]
    collumn_x = [0,  0, 0]

    row_y = [0,  0, 0]
    row_x = [0, -1, 1]

    adjacents_y = [main_diagonal_y, second_diangonal_y, collumn_y, row_y]
    adjacents_x = [main_diagonal_x, second_diangonal_x, collumn_x, row_x]
}

function performCheckingWinningPositions() {
    // Check after pull the kittens
    let res = checkWinnigScorePosition()
    
    if (res === null) {
        console.log("Not detected score.")
    } else {
        console.log("Score detected: ")
        console.log(res)

        let listCells = []
        let idSet = new Set([]);
        for (let u of res) {
            console.log("(" + u.ii + ", " + u.jj + ")")
            let element = board.rows[u.ii].cells[u.jj]
            listCells.push(element)
            idSet.add(u.cell_origin)

            if (u.cell_origin === 1) {
                numberOfKittensPlayer1 = Math.min(numberOfKittensPlayer1 + 1, numberOfKittensPerPlayer)
            } else {
                numberOfKittensPlayer2 = Math.min(numberOfKittensPlayer2 + 1, numberOfKittensPerPlayer)
            }
        }

        // ==== PERFORM ANIMATION === //
        animateKittens(listCells)

        idSet.forEach((value) => {
            //console.log("Lets perform animation now :) => Player " + value)
            if (value == 1) {
                scorePlayer1 = Math.min(scorePlayer1 + 1, maxNumberOfPoints)
            } else {
                scorePlayer2 = Math.min(scorePlayer2 + 1, maxNumberOfPoints)
            }
        });

        updateScoreTable()
    }
}

function updateScoreTable() {
    spanScorePlayer1.innerText = "Points: " + scorePlayer1 + " / " + maxNumberOfPoints
    spanScorePlayer2.innerText = "Points: " + scorePlayer2 + " / " + maxNumberOfPoints
}

function animateKittens(listCells) {
    for (let u of listCells) {
        u.classList.toggle("pulse")
    }

    playBoopMeow()

    setTimeout(function () {
        for (let u of listCells) {
            u.classList.remove("pulse")
            u.innerHTML = '';
        }
        updateActivePlayer()
        updateNumberKittens()
        LoadBenchPlayer()
    }, 200)
}

let timeOut = false

function checkSayWinner() {
    let winnerId = -1

    if (timeOut == true) {
        winnerId = activePlayer == 1 ? 2 : 1
    } else 
        if (numberOfKittensPlayer1 == 0) {
            winnerId = 1
        } else 
            if (numberOfKittensPlayer2 == 0) {
                winnerId = 2
            } else 
                if (scorePlayer1 >= maxNumberOfPoints) {
                    winnerId = 1
                } else 
                    if (scorePlayer2 >= maxNumberOfPoints) {
                        winnerId = 2
                    }

    if (winnerId != -1 && !doNotReceive) {
        stopTimer()
        loadWinningForm(winnerId)
        doNotReceive = true
    }
}

const openModalHistory = function() {
    modalHistory.classList.remove("hidden");
    overlayHistory.classList.remove("hidden");
    divMenu.style.display = "none"
}

const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

let winnerPlayer = []
let loserPlayer = []

function loadWinningForm(winnerId) {
    stopTimer()

    winnerPlayer = [playerName1, scorePlayer1]
    loserPlayer = [playerName2, scorePlayer2]

    if (winnerId == 2) {
        winnerPlayer = [playerName2, scorePlayer2]
        loserPlayer = [playerName1, scorePlayer1]
    }

    let currentTime = Date()

    let duelGame = [winnerPlayer, loserPlayer, currentTime]
    console.log("Load Winner => ")
    console.log(duelGame)

    openModal()

    stopTimingSound()
    playWinningSong()
    spanWinner.innerText = winnerPlayer[0].toUpperCase() + ", YOU WON :)!"
    spanFinalScore.innerText = winnerPlayer[1] + " AGAINST " + loserPlayer[1]
    saveHistory()
}

function saveHistory() {
    const now = new Date().toLocaleString()

    let str = `${playerName1} [${scorePlayer1} - ${scorePlayer2}] ${playerName2} | ${now} | Winner : ${winnerPlayer[0]}`

    let history = JSON.parse(localStorage.getItem('history'))
    localStorage.removeItem('history')
    if (history === null) {
        history = []
    }

    history.push(str)
    localStorage.setItem('history', JSON.stringify(history))
}

function resetTimerChangePlayer() {
    stopTimer()
    timeOut = false
    seconds = DEFAULT_SECONDS
    startTime = null
    colorFormat = "#6e7173"
    divTimer.style.color = colorFormat
    divTimer.innerHTML = '02 : 00'
    startInterval()
}

const closeModalHistory = function () {
    modalHistory.classList.add("hidden");
    overlayHistory.classList.add("hidden");

    divMenu.style.display = "block"

    divMenu.classList.add("menu")
    buttonPlay.classList.add("button-menu")
    buttonHistory.classList.add("button-menu")
    buttonClearHistory.classList.add("button-menu")
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    timeOut = false
    seconds = DEFAULT_SECONDS
    startTime = null
    colorFormat = "#6e7173"
    divTimer.style.color = colorFormat
    divTimer.innerHTML = '03 : 00'

    scorePlayer1 = 0
    scorePlayer2 = 0
    numberOfKittensPlayer1 = numberOfKittensPerPlayer
    numberOfKittensPlayer2 = numberOfKittensPerPlayer

    LoadBenchPlayer()
    LoadTable()
};

overlay.addEventListener("click", closeModal);
overlayHistory.addEventListener("click", closeModalHistory)

/* === INIT PHASE === */
divGame.style.display = 'none'