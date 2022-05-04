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
var rollCount = 0;
var dices = [];
var saved = [];
var rolledCount = 0;

openModal(playerModal);

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
    let stringID = playerCount+"-"+name;
    db.collection("gamerooms").doc(roomID).collection('player').doc(stringID).set({
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
                gameStarted:false,
                rolled:[],
                savedDices:[],
                rollCount: 0
            })

        }else{
            db.collection("gamerooms").doc(roomID).update({
                players:playerCount,
            })
        }
     })
}

db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{
    snaps.forEach(player => {
        var name = player.id.split("-");
        players.push(name[1])
        // Aufbau der Spieler-Eingabe:
        existingPlayers.innerHTML +=`
            <button class="start-as-player" value="${player.id}">${player.id.split('-')[1]}</button>
        `
    });
    existingPlayersBtns = document.querySelectorAll('.start-as-player');
    // Wenn ein bestehender Spieler gewählt wird:
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
    const name = playerform['player_name'].value;
    players.push(name);
    createNewPlayer(name);
    console.log(players)
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

            var tmpDices = []

            for (let i = 0; i < dices.length; i++) {
                var value = (Math.floor(Math.random() * 6 + 1));
                tmpDices.push(value)
            }
            dices = tmpDices;

            db.collection("gamerooms").doc(roomID).update({
                rolled:dices,
                rollCount: rollCount
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
})


