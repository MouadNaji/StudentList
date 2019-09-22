"use strict";
document.addEventListener("DOMContentLoaded", start);

let personer = [];
//variabel for indholdet af første json fil
let blodType = [];
//variabel for indhold af blodtype json fil
let filter = "All Houses";
//variable for filter
const allPersons = [];
//variable for endelige liste rigtig organiseret
const Array = {
  firstName: "-name",
  middleName: "-type",
  lastName: "-type",
  house: "-age",
  photos: "-billeder",
  id: "-id",
  gender: "-gender",
  bloodType: "-type"
};
//prototype variabel med alle informationer jeg skal have
async function start() {
  const json = await fetch(
    "https://petlatkea.dk/2019/hogwartsdata/students.json"
  );
  const json2 = await fetch(
    "http://petlatkea.dk/2019/hogwartsdata/families.json"
  );
  //henter de 2 json filer
  personer = await json.json();
  blodType = await json2.json();
  //Henter data fra JSON fil ind i variablerne

  visAlt();
  //kalder på functionen der viser alle elever
  prepareObjects(personer);
  //function der sørger for allPersons indeholder alle elementer
  document.querySelectorAll(".filter").forEach(knap => {
    knap.addEventListener("click", filtrering);

    //eventlistener for filter knappen
    document.querySelector("#fornavn").addEventListener("click", sorting);
    //sortere efte fornavn
    document.querySelector("#efternavn").addEventListener("click", sorting2);
    //sortere efter efternavn
  });
}
/////////////////////////////////////henter tilfældigt nummer//////////////////////////////////////////////
//kode hentet fra denne hjemmeside https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
/////////////////////////////////////forbereder og opdeler Json fil //////////////////////////////////////////////
function prepareObjects(personer) {
  hackTheList();
  personer.forEach(person => {
    const students = Object.create(Array);
    const parts = person.fullname.trim().split(" ");
    const houses = person.house.trim();
    //trim bliver brugt til at fjerne det første mellemrum i ordet split opdeler indholdet
    students.firstName = capitalize(parts[0]);
    students.lastName = capitalize(parts[parts.length - 1]);
    students.house = capitalize(houses);
    if (students.lastName === "Finch-fletchley") {
      students.lastName = "Fletchley";
    }
    if (students.firstName === "Padma") {
      students.firstName = "Padme";
    }
    //sørger for at de 2 navne er identiske med navne på billed filer
    const tilBilleder = students.lastName.toLowerCase();
    const tilBilleder2 = students.firstName.charAt(0).toLowerCase();
    const tilBilleder3 = students.firstName.toLowerCase();

    if (students.lastName === "Patil") {
      students.photos = `billeder/images/${tilBilleder}_${tilBilleder3}.png`;
    } else {
      students.photos = `billeder/images/${tilBilleder}_${tilBilleder2}.png`;
    }
    //sørger for billeder bliver sat rigtigt ind
    students.id = uuid();
    students.gender = capitalize(person.gender);

    if (parts.length === 3) {
      students.middleName = capitalize(parts[1]);
    } else {
      students.middleName = "";
    }
    //sørger for at folk med middle Name kommer frem
    if (parts.length === 1) {
      students.middleName = "";
      students.lastName = "";
      students.photos = `billeder/images/li_s.png`;
    }
    prepBloodType(students);
    //sørger for de rigtige blodtyper kommer ind
    allPersons.push(students);
    //sørger for at hver elev kommer in i variablen allPersons
  });
  visAlt();
  //sørger for at alt bliver opdateret korrekt efter hvad der sorteres efter
}
function prepBloodType(x) {
  blodType.half.forEach(type => {
    if (type === x.lastName) {
      x.blodType = "Blood Status: half";
    } else {
      x.blodType = "Blood Status: plain muggle";
    }
  });
  blodType.pure.forEach(type => {
    if (type === x.lastName) {
      x.blodType = "Blood Status: Pure";
    }
  });
}
//funktionen prepBloodType sørger for eleverne får rigtig blood status
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
// funktionen capitalize bliver brugt til at gøre det første bogstav stort og resten af ordet småt
/////////////////////////////////////sorterings funktionerne //////////////////////////////////////////////
function sorting() {
  allPersons.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName);
  });
  this.classList.add("valgt");
  document.querySelector("#efternavn").classList.remove("valgt");
  visAlt();
}
//sortering efter fornanvn
function sorting2() {
  allPersons.sort((a, b) => {
    return a.lastName.localeCompare(b.lastName);
  });
  this.classList.add("valgt");
  document.querySelector("#fornavn").classList.remove("valgt");
  visAlt();
}
//sortering efter efternavn
/////////////////////////////////////filtrering i forhold til hus //////////////////////////////////////////////
function filtrering() {
  document.querySelectorAll(".filter").forEach(knap => {
    knap.classList.remove("valgt");
  });
  this.classList.add("valgt");
  document.querySelector("h1").textContent = this.textContent;
  filter = this.getAttribute("data-hold");
  console.log(filter);
  //filtrering iforhold til hus
  visAlt();
  houseNumbers();
  if (filter === "All Houses") {
    document.querySelector("#nsh").textContent = `No house selected`;
  }
}
/////////////////////////////////////ny elev bliver sat ind i variablen allPersons //////////////////////////////////////////////
function hackTheList() {
  let Mouad = {
    firstName: "Mouad",
    middleName: "",
    lastName: "Naji",
    house: "Ravenclaw",
    photos: "billeder/mouad.png",
    id: uuid(),
    gender: "Male",
    blodType: "Blood Status: Pure"
  };
  allPersons.push(Mouad);
}
/////////////////////////////////////viser HovedListen af alle elever //////////////////////////////////////////////
function visAlt() {
  let liste = document.querySelector("#liste");

  liste.innerHTML = "";

  allPersons.forEach(person => {
    if (filter == "All Houses" || person.house == filter) {
      //med denne if sætning sørges der for at der kan filtreres ud fra hvad filter er lig med
      let template = `<div class="mineelever"><h2> ${person.firstName} ${person.middleName}  ${person.lastName} </h2><img src="${person.photos}" alt="student" height="42" width="42"><p>${person.gender}<br>${person.house}</p><button id="lort" data-id="${person.id}" data-action="remove">Expel Student</button><button id="lort2" data-id="${person.id}" data-action="prefect">Prefect</button></div>`;
      liste.insertAdjacentHTML("beforeend", template);
      document.querySelector("#liste2").style.display = "none";
      document.querySelector("#liste3").style.display = "none";
      //sætter navn for hver elev,billled,køn,id og hus-navn ind i html
      liste.lastElementChild.addEventListener("click", () => {
        visSingle(person);
      });
      //eventlistener for "klik på elever" så kommer der pop-op med single
    }
  });
  document.querySelector(
    "#numberofstudents"
  ).textContent = `Students in total: ${allPersons.length}`;
}
//viser antal elever i allPersons
/////////////////////////////////////viser personer i signleview//////////////////////////////////////////////
function visSingle(person) {
  document.querySelector("#pop-op").style.display = "block";
  document.querySelector("#pop-op #lukknap").addEventListener("click", close);
  //sørger for at der kommer pop-op side frem
  document.querySelector(
    "#indhold"
  ).innerHTML = `<div class="pop-up"><h2> ${person.firstName} ${person.middleName} ${person.lastName}</h2><p>${person.house}<br>${person.blodType}</p><img src="${person.photos}" alt="student" height="42" width="42"></div>`;
  if (person.house == "Ravenclaw") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<div class="ravenen"><img class="raven" src="billeder/blue.png" alt="gul" height="200" width="200"></div>`;
    document.querySelector("#pop-op").style.background = "rgba(4, 4, 94, 0.5)";
  } else if (person.house == "Slytherin") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<div class="snakeen"><img class="snake" src="billeder/green.png" alt="gul" height="200" width="200"></div>`;
    document.querySelector("#pop-op").style.background = "rgba(1, 71, 65, 0.5)";
  } else if (person.house == "Gryffindor") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<div class="fuglen"><img class="fugl" src="billeder/red.png" alt="red" height="200" width="200"></div>`;
    document.querySelector("#pop-op").style.background = "rgba(87, 5, 28, 0.5)";
  } else if (person.house == "Hufflepuff") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<div class="bien"><img class="bi" src="billeder/yellow.png" alt="gul" height="200" width="200"></div>`;
    document.querySelector("#pop-op").style.background =
      "rgba(84, 67, 30, 0.5)";
  }
  //sørger for at logo og farve kommer for hver elev afhængig af hus
}

function close() {
  document.querySelector("#pop-op").style.display = "none";
  //lukker pop-op
}
close();

/////////////////////////////////////Expel Students //////////////////////////////////////////////
document.querySelector("#liste").addEventListener("click", clickSomething);
//der sørges for at alle personer der bliver expelled fjernes fra allPersons og kommer i nyListe
function clickSomething(event) {
  const element = event.target;
  console.log(allPersons[0].id);
  allPersons.forEach(person => {
    if (
      person.id === element.dataset.id &&
      person.firstName === "Mouad" &&
      element.dataset.action === "remove"
    ) {
      // sørger for at mouad ikke kan blive expelled
      alert("warning! This Student can under no circumstances be EXPELLED!!");
      document.querySelector("#pop-op").style.display = "none";
      person.dataset.action = "prefect";
    }
  });
  if (element.dataset.action === "remove") {
    element.parentElement.classList.add("dissappear");
    setTimeout(function() {
      element.parentElement.remove();

      if (filter === "All Houses") {
        document.querySelector("#nsh").textContent = `No house selected`;
      } else {
        houseNumbers();
      }
    }, 700);
    //sørger for at den kun tæller personer for hvert hus hvis man vælger et husnavn
    document.querySelector("#pop-op").style.display = "none";
    //sørger for pop-op ikke dukker op
    console.log("removed the item");
    const index = allPersons.findIndex(findFunction);
    console.table(allPersons);

    function findFunction(persons) {
      if (persons.id === element.dataset.id) {
        return true;
      } else {
        return false;
      }
    }
    // der sørges for at den person man har klikket på er den samme som den person der bliver fjernet fra listen
    nyListe.push(allPersons[index]);
    console.log(nyListe);
    allPersons.splice(index, 1);

    document.querySelector(
      "#numberofstudents"
    ).textContent = `students in total: ${allPersons.length}`;
    document.querySelector(
      "#numberofstudentsex"
    ).textContent = `Expelled students: ${nyListe.length}`;
  }
  //sørger for at tælleren følger med når trykker expel
}

const nyListe = [];

document.querySelector("#expel").addEventListener("click", lavExpelListe);
//her sørges der for at eleverne kommer frem i expel listen
function lavExpelListe() {
  document.querySelector("#liste3").style.display = "none";
  let liste = document.querySelector("#liste2");
  liste.innerHTML = "";
  nyListe.forEach(ting => {
    liste.innerHTML += `<div class="mineelever"><h2> ${ting.firstName} ${ting.middleName}  ${ting.lastName}</h2><img src="${ting.photos}" alt="student" height="42" width="42"><p>${ting.gender}<br>${ting.house}</p></div>`;
    liste.style.display = "block";
    liste.style.color = "darkred";
  });
  houseNumbers();
}

/////////////////////////////////////prefect Students //////////////////////////////////////////////
const nyListe2 = [];
//der bliver lavet en tredje liste for prefects
document.querySelector("#liste").addEventListener("click", clickSomething2);
let counterForPerfect = 0;
// denne variabel bruges til at tælle antal prefect
function clickSomething2(event) {
  const element = event.target;

  if (element.dataset.action === "prefect") {
    counterForPerfect++;
    document.querySelector("#pop-op").style.display = "none";

    console.log("Item made perfect");
    const index = allPersons.findIndex(findFunction);

    function findFunction(persons) {
      if (persons.id === element.dataset.id) {
        return true;
      } else {
        return false;
      }
    }

    if (counterForPerfect < 2) {
      //her sørges for at der kun kan være 1 prefect af gangen
      nyListe2.push(allPersons[index]);
    } else {
      counterForPerfect--;
      alert(
        `Only 1 Student can be Prefect, The best student in the school!
        -Go revoke the current prefect student in the prefect list before choosing a new`
      );
    }
  }
}

document.querySelector("#prefect").addEventListener("click", lavExpelListe2);
// der sørges for at dataen fra nyliste2 kommer frem
function lavExpelListe2() {
  document.querySelector("#liste2").style.display = "none";
  let liste = document.querySelector("#liste3");
  liste.innerHTML = "";

  nyListe2.forEach(ling => {
    //her sættes dataen ind i prefect listen
    liste.innerHTML += `<div class="mineelever"><h2> ${ling.firstName} ${ling.middleName}  ${ling.lastName}</h2><img src="${ling.photos}" alt="student" height="42" width="42"><p>${ling.gender}<br>${ling.house}</p><button id="revoke">Revoke Prefect</button></div>`;
    liste.style.display = "block";
    liste.lastElementChild.style.backgroundColor = "green";
  });
  document.querySelector("#revoke").addEventListener("click", revokePrefect);
}

function revokePrefect() {
  //her sørges for at man kan revoke
  const element = event.target;
  counterForPerfect--;

  nyListe2.pop();
  console.log("done");

  element.parentElement.classList.add("dissappear");
}

function houseNumbers() {
  //denne funktion sørger for at tælle hvor mange elever der er i hvert hus ud fra hvor mange childelements der er nå der filtreres
  let n = document.querySelector("#liste").childElementCount;
  document.querySelector("#nsh").textContent = `Students in house: ${n}`;
}
