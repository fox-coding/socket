const submitForm = document.getElementById("chat_form");
const submitInput = document.getElementById("chat_input");
const chatWrapper = document.getElementById("chat_history");

console.log("UI geladen");

db.collection("chats").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    var chat = change.doc.data().messages;
    chatWrapper.innerHTML = "";
    chat.forEach((message) => {
      chatWrapper.innerHTML += `<div>${message}</div>`;
    });
    console.log(change.doc.data());
  });
});

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = submitInput.value;
  db.collection("chats")
    .doc("EQUrVsKLa0A39q7aRkP0")
    .get()
    .then((snap) => {
      let chat = snap.data().messages;
      chat.push(message);
      db.collection("chats")
        .doc("EQUrVsKLa0A39q7aRkP0")
        .set({ messages: chat });
    });
});

// EQUrVsKLa0A39q7aRkP0
