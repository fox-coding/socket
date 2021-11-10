const submitForm = document.getElementById("chat_form");
const submitInput = document.getElementById("chat_input");
const chatWrapper = document.getElementById("chat_history");
const logIn = document.getElementById("login_form");
const signupForm = document.getElementById("register_form");
const logoutBtn = document.getElementById("log_out");

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

// Listen for auth status
auth.onAuthStateChanged(user => {
  if(user){
    if(user.emailVerified){
      console.log('User eingeloggt UND verifiziert')
    }
    console.log('User eingeloggt')
  }else{
    console.log('kein User')
    chatWrapper.remove()
  }
})

// SIGN UP FORM
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = signupForm['sgn_email'].value;
      const password = signupForm['sgn_pass'].value;

      auth.createUserWithEmailAndPassword(email, password).then(cred => {
          return db.collection('users').doc(cred.user.uid).set({
              chat:[]
          }).then(()=>{
              var user = cred.user;
              user.sendEmailVerification().then(function(){
                  console.log("email verification sent to user");
              }).catch(err => {
                  console.log(err.message);
              }); 
          })
      }).catch(err => {
          console.log(err.message);
      })
  })
}

// LOG IN FORM
if (logIn) {
  logIn.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = logIn['log_email'].value;
      const password = logIn['log_pass'].value;
      auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log('succefully logged in')
      }).catch(err => {
        console.log(err.message);
      })
  })
}

// LOG OUT
if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      auth.signOut().then(() => {
        console.log("user ausgeloggt")
      })
  })
}



