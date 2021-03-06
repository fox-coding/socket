const roomID = document.getElementById('game_room_id').textContent;
const existingPlayers = document.querySelector('.existing-players');
const docBody = document.querySelector('body');
var existingPlayersBtns;
const playerform = document.querySelector('.player-form');
const playerModal = document.querySelector('.player-form-wrapper');
const rollBtn = document.querySelector('.roll-button');
var turn;
var gameStarted;
var players = [];
var playerName;
var dices = [];
var saved = [];
var rolledCount = 0;

openModal(playerModal);

const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }
  
  let duplicatedArray = [9, 9, 111, 2, 3, 4, 4, 5, 7];

const createPlayerCard = function (id) {

    var amountPlayerCards = document.querySelectorAll('.App .ListComponent');

    db.collection("gamerooms").doc(roomID).collection('player').doc(id).get().then(snap=>{
        var data = snap.data();
        var cpy = document.querySelector('.dummy-element-player-card').cloneNode(true);
        cpy.querySelector('.name-of-player').innerText = id;
        Object.keys(data).forEach(key => {
            if(key !== "Kniffel_Count"){
                cpy.querySelector("#"+key).innerText = data[key];
                cpy.querySelector("#"+key).setAttribute('id','');
            }
        });

        cpy.classList.remove('dummy-element-player-card');

        if(amountPlayerCards.lenght === 0){
            //insertBefore(cpy, document.querySelector('.dice-roller-container'));
            document.querySelector('.App').prepend(cpy)
        }else{
            document.querySelector('.App').appendChild(cpy)
        }

    })
}

const createNewPlayer = function (name) {
    let playerCount = players.length;
    db.collection("gamerooms").doc(roomID).collection('player').doc(name).set({
        Einser: null,
        Zweier: null,
        Dreier: null,
        Vierer: null,
        Fuenfer: null,
        Sechser: null,
        Dreierpasch: null,
        Viererpasch: null,
        Full_House: null,
        Kleine_Strazze: null,
        Grozze_Strazze: null,
        Kniffel: null,
        Kniffel_Count: null,
        Chance: null
     }).then(()=>{
        if(playerCount === 1){
            db.collection("gamerooms").doc(roomID).update({
                players:playerCount,
                turn:name,
                playerOrder: players,
                gameStarted:false,
                rolled:[],
                savedDices:[],
                rolledCount: 0
            })

        }else{
            db.collection("gamerooms").doc(roomID).update({
                players:playerCount,
                playerOrder: players
            })
        }
     })
}

db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{
    snaps.forEach(player => {
        var name = player.id;
        players.push(name)
        // Aufbau der Spieler-Eingabe:
        existingPlayers.innerHTML +=`
            <button class="start-as-player" value="${player.id}">${player.id}</button>
        `
    });
    existingPlayersBtns = document.querySelectorAll('.start-as-player');
    // Wenn ein bestehender Spieler gew??hlt wird:
    existingPlayersBtns.forEach(player => {
        player.addEventListener("click",function(e){
            playerName = e.target.innerText;
            document.getElementById('player_name').innerText = playerName
            closeModal();
        })
    })
})

db.collection("gamerooms").doc(roomID)
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());

        turn = doc.data().turn;
        dices = doc.data().rolled;
        saved = doc.data().savedDices;
        rolledCount = doc.data().rolledCount;
        players = doc.data().playerOrder;


        gameStarted = doc.data().gameStarted;

        document.querySelector('.App').innerHTML = "";

        db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{
            snaps.forEach(player => {
                createPlayerCard(player.id)
            });
        })


        document.querySelector('.roll-counter').innerText = dices
        if(gameStarted && gameStarted === true){
            const rolledDicesHtml = dices.map((dice, index) => {
                return `<div class="dice rolled ${dice}" data-index="${index}" data-value="${dice}">${dice}</div>`        
            }).join("");
            const savedDicesHtml = saved.map((dice, index) => {
                return `<div class="dice saved ${dice}" data-index="${index}" data-value="${dice}">${dice}</div>`        
            }).join("");


            document.querySelector('.dices-rolled').innerHTML = rolledDicesHtml;
            document.querySelector('.dices-saved').innerHTML = savedDicesHtml;
        }
});

// Wenn ein neuer Spieler erstellt
playerform.addEventListener("submit",function(e){
    e.preventDefault();

    if(gameStarted){
        alert('Spiel wurde bereits gestartet!')
        return
    }

    const name = playerform['player_name'].value;
    console.log(players)
    if(!players){
        players = []
    }
    players.push(name);
    console.log(players)
    createNewPlayer(name);
    playerName = players[players.length-1];
    document.getElementById('player_name').innerText = playerName
    closeModal();
})

rollBtn.addEventListener("click",function(e){
    if(turn === playerName){
        if(!gameStarted){
            db.collection("gamerooms").doc(roomID).update({
                gameStarted:true,
            })
        }
        if(rolledCount < 3){

            rolledCount++;

            var tmpDices = []

            let dicesCounter = dices.length;
            if(dicesCounter === 0){
                dicesCounter = 5;
            }

            for (let i = 0; i < dicesCounter; i++) {
                var value = (Math.floor(Math.random() * 6 + 1));
                tmpDices.push(value)
            }
            dices = tmpDices;

            console.log(dices)
            db.collection("gamerooms").doc(roomID).update({
                rolled:dices,
                rolledCount: rolledCount
            })
        }else{
            alert('aufgebraucht!')
        }

    }else{
        alert(`Du bist nicht am Zug! Sondern ${turn}`)
    }
})

docBody.addEventListener("click",function(e){
    var me = e.target;
    if(me.classList.contains('dice')){
        let index = parseFloat(me.dataset.index);
        let value = parseFloat(me.dataset.value);
        db.collection("gamerooms").doc(roomID).get().then(doc=>{
            let savedDices = doc.data().savedDices;
            let turn = doc.data().turn

            if(turn !== playerName){
                return;
            }

            if(me.classList.contains('rolled')){
                dices.splice(index, 1);
                savedDices.push(value);
            }else{
                savedDices.splice(index, 1);
                dices.push(value);
            }

            db.collection("gamerooms").doc(roomID).update({
                rolled: dices,
                savedDices:savedDices
            })
        })
    }
    if(me.classList.contains('list-btn')){
        console.log(saved)
        var neededValue = me.dataset.value;
        var counter = 0;
        var dbSlot = me.innerText.replace('??','ue');
        var currentValue = me.nextElementSibling.innerText;

        for (let i = 0; i < saved.length; i++) {
            const value = saved[i];

            if(value == neededValue){
                counter++;
            }   
        }
        if(currentValue === ''){
            let playerOfClickedCard = me.parentElement.parentElement.parentElement.querySelector('.name-of-player').innerText
            if(playerName !== playerOfClickedCard){
                alert('Ups! Falsche Karte');
                return;
            }
            db.collection("gamerooms").doc(roomID).collection('player').doc(playerName).update({
                [dbSlot]:counter*neededValue
            }).then(()=>{
                let playerTurnIndex = players.indexOf(playerName)+1;
                if(playerTurnIndex > players.length-1){
                    playerTurnIndex = 0
                }
    
                db.collection("gamerooms").doc(roomID).update({
                    turn: players[playerTurnIndex],
                    rolledCount: 0,
                    rolled: [],
                    savedDices: []
    
                })
            })

        }else{
            alert('Feld bereits bef??llt!')
        }

    }
    // PR??FEN DER W??RFEL BEI FUNKTIONALEN EINTR??GEN:
    if(me.classList.contains('function-btn')){

        var currentValue = me.nextElementSibling.innerText;

        // Dreierpasch Funktion:
        if(me.classList.contains('dreierpasch') || me.classList.contains('viererpasch') || me.classList.contains('kniffel')){
            var dreierpasch = false
            var viererpasch = false
            var kniffel = false
            var sum = 0
            var dbSlot = me.innerText.replace('??','ue');

            saved.forEach(value => {
                var count = 0
                sum = sum + value
                saved.forEach(element => {
                    if (element === value) {
                      count += 1;
                    }
                  });
                if(count >= 3){
                    dreierpasch = true
                }
                if(count >= 4){
                    viererpasch = true
                }
                if(count >= 5){
                    kniffel = true 
                }
            })
            if(kniffel && me.classList.contains('kniffel')){
                sum = 50
            }
            if(me.classList.contains('dreierpasch') && !dreierpasch){
                sum = 0
            }
            if(me.classList.contains('viererpasch') && !viererpasch){
                sum = 0
            }
            if(me.classList.contains('kniffel') && !kniffel){
                sum = 0
            }
            // In DB speichern:

            if(currentValue === ""){
                db.collection("gamerooms").doc(roomID).collection('player').doc(playerName).update({
                    [dbSlot]:sum
                }).then(()=>{
                    let playerTurnIndex = players.indexOf(playerName)+1;
                    if(playerTurnIndex > players.length-1){
                        playerTurnIndex = 0
                    }
                    db.collection("gamerooms").doc(roomID).update({
                        turn: players[playerTurnIndex],
                        rolledCount: 0,
                        rolled: [],
                        savedDices: []
                    })
                }) 
            }
        }
    }
})


