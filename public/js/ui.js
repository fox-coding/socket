const submitForm = document.getElementById("chat_form");
const createGame = document.getElementById('create_game_room');
const submitInput = document.getElementById("chat_input");
const chatWrapper = document.getElementById("chat_history");
const logIn = document.getElementById("login_form");
const signupForm = document.getElementById("register_form");
const logoutBtn = document.getElementById("log_out");
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const resetPass = document.querySelector('.pass-reset-form');
var userID;


const showLoader = () => {
  document.querySelector('body').classList.add('loading')
}

const closeLoader = () => {
  document.querySelector('body').classList.remove('loading')
}

const openModal = (me) => {
  var activeModal = document.querySelector('.modal.active');
  var targetEl;

  if(activeModal){
      activeModal.classList.remove('active')
  }

  var target = me.getAttribute('data-modal');
  targetEl = document.querySelector('.' + target);

  document.querySelector('body').classList.add('modal-active');
  document.querySelector('.event-overlay').classList.add('active');
  targetEl.classList.add('active');
}

const closeModal = () => {
  var activeModal = document.querySelector('.modal.active');
  var activeOverlay = document.querySelector('.event-overlay.active')
  document.querySelector('body').classList.remove('modal-active');
  if(activeModal){
      activeModal.classList.remove('active')
  }
  if(activeOverlay){
      activeOverlay.classList.remove('active')
  }
}

const showAlert = (mode,msg) =>{
  closeModal();
  var alert = document.querySelector('.modal-alert');
  alert.classList.remove('error','success','warning','active');
  alert.querySelector('.message').innerHTML = msg;
  alert.classList.add(mode,'active');
  document.querySelector('.event-overlay').classList.add('active')
}

const setupUI = (user) => {
  if (user) {
      loggedInLinks.forEach(item => {
          item.classList.add('displayed');
      });
      loggedOutLinks.forEach(item => item.classList.remove('displayed'));

  } else {
      loggedInLinks.forEach(item => item.classList.remove('displayed'));
      loggedOutLinks.forEach(item => item.classList.add('displayed'));
  }
}

console.log("UI geladen");

// Listen for auth status
auth.onAuthStateChanged(user => {
  if (user) {
      userID = user.uid;
      if (user.emailVerified) {
          setupUI(user);        
      }else{
          user.sendEmailVerification().then(function(){
              showAlert('success','We have send you a verification mail. Please follow instructions in the email, to verify your account!')
          }).catch(err => {
              console.log(err.message);
              setupUI();
              showAlert('success','We have send you a verification mail. Please follow instructions in the email, to verify your account!')
          });
      }
  } else {
      setupUI();
  }
})

db.collection("chats").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    var chat = change.doc.data().messages;
    chat.forEach((message) => {
    });
    console.log(change.doc.data());
  });
});


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

if (resetPass) {
    resetPass.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = resetPass['reset_pass_mail'].value;
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resetPass.parentNode.parentNode.innerHTML = `<div class="success-msg"><p class="success">We have send you an email! Please follow the instructions written in the email.</p></div>`
        })
        .catch((error) => {
          var errorMessage = error.message;
          resetPass.parentNode.parentNode.innerHTML = `<div class="success-msg"><p class="error">${errorMessage}</p></div>`
        });
    })
}

document.querySelector('body').addEventListener('click', function (e) {
  var me = e.target;
  if (me.classList.contains('modal-open')) {
      openModal(me,"onclick")
  }
  if (me.classList.contains('modal-close')) {
      closeModal()
  }
  if (me.classList.contains('start-game')) {
    db.collection("gamerooms").add({})
    .then((docRef) => {
        var roomID = docRef.id
        console.log("Document written with ID: ", roomID);

        // db.collection("gamerooms").doc(roomID).collection('players').doc(name).set({
        //   name: name,
        //   id: userid
        // })
        location.href = location.href+"room?id="+roomID
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  }
})
