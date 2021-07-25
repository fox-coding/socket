console.log('UI geladen');

db.collection('chats').onSnapshot((snapshot)=>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data())
    });
})