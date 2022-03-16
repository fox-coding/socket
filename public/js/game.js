const roomID = document.getElementById('game_room_id').textContent;
const playerform = document.querySelector('.player-form');
const playerModal = document.querySelector('.player-form-wrapper');
var players = [];
var player = "";

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

        console.log(amountPlayerCards.length)
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
        //createPlayerCard(stringID)

        db.collection("gamerooms").doc(roomID).update({
            players:playerCount
        })

     })
}

db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{
    snaps.forEach(player => {
        var name = player.id.split("-");
        players.push(name[1])
        // Aufbau der Spieler-Eingabe:
        playerform.innerHTML +=`
            <button class="start-as-player" value="${player.id}">${player.id}</button>
        `
    });
    playerform.innerHTML += `
        <input type="text" id="player_name" placeholder="Gib deinen Spielernamen ein">
        <button>Neuen Spieler erstellen</button>
    `
})

db.collection("gamerooms").doc(roomID)
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());

        document.querySelector('.App').innerHTML = "";

        db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{
            snaps.forEach(player => {
                console.log(player.id)
                createPlayerCard(player.id)
            });
        })
    });

// Wenn ein neuer Spieler erstellt, oder ein bestehender gewählt wird:
playerform.addEventListener("submit",function(e){
    e.preventDefault();
    const name = playerform['player_name'].value;
    players.push(name);
    player = players[players.length-1];
    document.getElementById('player_name').innerText = player
    console.log(player);
    createNewPlayer(name);
    closeModal();
})