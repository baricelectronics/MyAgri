var firebaseConfig = { //definiranje baze podataka
  apiKey: "AIzaSyA4cQmSNY5t6vmMdNHYM2XgrMhNWqydZac",
  authDomain: "myagri-9837a.firebaseapp.com",
  databaseURL: "https://myagri-9837a-default-rtdb.firebaseio.com",
  projectId: "myagri-9837a",
  storageBucket: "myagri-9837a.appspot.com",
  messagingSenderId: "609292585951",
  appId: "1:609292585951:web:c003730839a6e94310126a",
  measurementId: "G-19EMWPSYMZ"
  };

const clock = document.getElementById("clock");
var a1number,a2number;
var mnumber,dnumber,tnumber;

var numberRef = firebase.database().ref().child("alarm1");
		numberRef.on('value', function(snapshot) {
			a1number = snapshot.val(); //očitanje te spremanje vremena navodnjavanja
		});

var number2Ref = firebase.database().ref().child("alarm2");
		number2Ref.on('value', function(snapshot) {
			a2number = snapshot.val(); //očitanje te spremanje drugog vremena navodnjavanja
		});

var number3Ref = firebase.database().ref().child("dwater");
    number3Ref.on('value', function(snapshot) {
        dnumber = snapshot.val(); //očitanje te spremanje dnevne potrošnje vode
    });

var number4Ref = firebase.database().ref().child("mwater");
    number4Ref.on('value', function(snapshot) {
        mnumber = snapshot.val(); //očitanje te spremanje mjesečne potrošnje vode
    });

var number5Ref = firebase.database().ref().child("twater");
    number5Ref.on('value', function(snapshot) {
        tnumber = snapshot.val(); //očitanje trenutne vrijednosti količine vode
        dnumber=dnumber+tnumber; //računanje dnevne potrošnje
        mnumber=mnumber+tnumber; //računanje mjesečne potrošnje
        var database = firebase.database(); 
        database.ref("dwater").set(dnumber); //spremanje vrijednosti u bazu
        database.ref("mwater").set(mnumber);
        database.ref("twater").set(0);
    });

function updateTime() { //funkcija koja sprema trenutno vrijeme
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
      
    if (isNewMonth()) { //funkcija provjerava da li je početak novog mjeseca
        var database = firebase.database();
		    database.ref("mwater").set(0); //nakon izvršenja funkcije, mjesečna potrošnja se postavlja na 0
    } 

    if (`00:00`==`${hours}:${minutes}`) { //provjera da li je ponoć
        var database = firebase.database();
		database.ref("dwater").set(0); //postavljanje dnevne potrošnje na 0
    }

    if (a1number == `${hours}:${minutes}`|| a2number == `${hours}:${minutes}`) { //provjera da li je trenutno vrijeme jednako vrijednostima alarm1 ili alarm2
        var database = firebase.database();
		database.ref("valve").set(1); //paljenje ventila
    }
}

function isNewMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  const previousMonth = previousDate.getMonth();
  return currentMonth !== previousMonth;
}

setInterval(updateTime, 1000);
timeInput.addEventListener("change", () => {
    const [hours, minutes] = timeInput.value.split(":");
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    clock.textContent = `${hours}:${minutes}:00`;
    clearInterval(intervalId);
    intervalId = setInterval(updateTime, 1000);
});
let intervalId = setInterval(updateTime, 1000);