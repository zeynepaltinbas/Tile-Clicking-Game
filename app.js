const cover = document.querySelector("#coverPage")
const wait = document.querySelector("#waitScreen")
const game = document.querySelector("#gameScreen")
const grid = document.querySelector("#grid")
const bar = document.querySelector("#pointBar")
const scoreText = document.querySelector("#scoreText")
const timerText = document.querySelector("#timerText")
const hiScoreText = document.querySelector("#hiScoreText")
const tapMsg = document.querySelector("#tapMessage")

var score = 0
var hiScore = localStorage.getItem("gameHiScore") || 0
var timeLeft = 10
var barVal = 10
var active = false
var blackTiles = []

var gameClock = null
var barClock = null

hiScoreText.innerHTML = hiScore

cover.addEventListener("click", function() {
    cover.classList.add("hidden")
    wait.classList.remove("hidden")
    startCount()
})

function startCount() {
    var c = 3
    document.querySelector("#countText").innerHTML = c
    
    var countTimer = setInterval(function() {
        c--
        if (c > 0) {
            document.querySelector("#countText").innerHTML = c
        } else {
            clearInterval(countTimer)
            document.querySelector("#countText").innerHTML = ""
            
            startGame()
            
            wait.classList.add("fade-out")
            setTimeout(function() {
                wait.classList.add("hidden")
                wait.classList.remove("fade-out")
            }, 1000)
        }
    }, 1000)
}

function startGame() {
    score = 0
    timeLeft = 10
    barVal = 10
    blackTiles = []
    scoreText.innerHTML = score
    timerText.innerHTML = timeLeft
    bar.style.width = "100%"
    
    grid.innerHTML = "" 
    tapMsg.classList.add("hidden")
    
    game.classList.remove("hidden")
    active = true
    
    for (var i = 0; i < 16; i++) {
        var t = document.createElement("div")
        t.className = "tile"
        t.id = "tile-" + i
        grid.appendChild(t)
    }

    addBlackTiles(3)
    runClocks()
}

function addBlackTiles(n, curr = -1) {
    while (blackTiles.length < n) {
        var r = Math.floor(Math.random() * 16)
        if (blackTiles.indexOf(r) === -1 && r !== curr) {
            blackTiles.push(r)
            document.getElementById("tile-" + r).classList.add("black")
        }
    }
}

function runClocks() {
    clearInterval(gameClock)
    clearInterval(barClock)

    gameClock = setInterval(function() {
        timeLeft--
        timerText.innerHTML = timeLeft
        if (timeLeft <= 0) {
            finish()
        }
    }, 1000)

    barClock = setInterval(function() {
        if (barVal > 0) {
            barVal--
            bar.style.width = (barVal * 10) + "%"
        }
    }, 100)
}

grid.addEventListener("click", function(e) {
    var tile = e.target
    
    if (!active || !tile.classList.contains("black")) 
        return

    score += barVal
    scoreText.innerHTML = score
    
    var id = parseInt(tile.id.split("-")[1])
    blackTiles.splice(blackTiles.indexOf(id), 1)

    tile.classList.remove("black")
    tile.classList.add("hit")
    tile.innerHTML = `<div class="popup">+${barVal}</div>`

    barVal = 10
    bar.style.width = "100%"

    addBlackTiles(3, id)
    
    setTimeout(function() {
        tile.classList.remove("hit")
        tile.innerHTML = ""
    }, 600)
})

function finish() {
    active = false
    clearInterval(gameClock)
    clearInterval(barClock)
    
    document.querySelector("#restartText").classList.remove("hidden")
    var msg = document.querySelector("#endText")
    msg.classList.remove("hidden")

    if (score > hiScore) {
        hiScore = score
        localStorage.setItem("gameHiScore", hiScore)
        hiScoreText.innerHTML = hiScore
        msg.innerHTML = "New Hiscore"

        var confettis = setInterval(function() {
            confetti({
                particleCount: 10,
                spread: 60,
                origin: { x: 0.5, y: 0.7}
            })
        }, 150)

        setTimeout(function() {
            clearInterval(confettis)
        }, 3000)

    } else {
        msg.innerHTML = "Time is up"
    }
}