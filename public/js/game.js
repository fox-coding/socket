const roomID = document.getElementById('game_room_id').textContent;
const playerform = document.querySelector('.player-form');

const createPlayerCard = function (id) {
    db.collection("gamerooms").doc(roomID).collection('player').doc(id).get().then(snap=>{
        var data = snap.data();
        console.log(data)
        var cpy = document.querySelector('.dummy-element-player-card').cloneNode(true);
        cpy.querySelector('.name-of-player').innerText = id;
        Object.keys(data).forEach(key => {
            if(key !== "Kniffel_Count"){
                console.log(cpy.querySelector("#"+key));
                console.log(key);
                cpy.querySelector("#"+key).innerText = data[key];
                cpy.querySelector("#"+key).setAttribute('id','');
            }
        });

        document.querySelector('.App').appendChild(cpy)

    })
}

const createNewPlayer = function (id) {
    db.collection("gamerooms").doc(roomID).collection('player').doc(id).set({
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
        createPlayerCard(id)
     })
}

db.collection("gamerooms").doc(roomID).collection('player').get().then((snaps)=>{

    snaps.forEach(player => {
        console.log(player.id)

        // Aufbau der Spieler-Eingabe:
        playerform.innerHTML +=`
            <input class="start-as-player" type="button" value="${player.id}">
        `

        // Aufbau der Spielerkarten:
        createPlayerCard(player.id)

    });

    playerform.innerHTML += `
        <input type="text" id="player_name" placeholder"Gib deinen Spielernamen ein">
        <button>Neuen Spieler erstellen</button>
    `
})

playerform.addEventListener("submit",function(e){
    e.preventDefault();
    const name = playerform['player_name'].value;
    createNewPlayer(name);
})