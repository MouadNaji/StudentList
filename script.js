//nogle af funktionerne er kopiret fra en gammel opgave, derfor de har unormale navne. Ændre senere
"use strict";
document.addEventListener("DOMContentLoaded", start);

let personer = [];
//variabel for indholdet
let blodType = [];
//variabel for indholdet
let filter = "All Houses";
//variable for filter
const allPersons = [];
//variable for alle
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
//prototype variabel
async function start() {
  const json = await fetch(
    "https://petlatkea.dk/2019/hogwartsdata/students.json"
  );
  const json2 = await fetch(
    "http://petlatkea.dk/2019/hogwartsdata/families.json"
  );

  personer = await json.json();
  blodType = await json2.json();
  //Henter data fra JSON fil ned

  visAlt();
  //kalder på functionen der viser alt på siden
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
//hentet fra denne hjemmeside https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
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

    //trim bliver brugt til at fjerne det første mellemrum i ordet
    students.firstName = capitalize(parts[0]);
    students.lastName = capitalize(parts[parts.length - 1]);
    students.house = capitalize(houses);
    if (students.lastName === "Finch-fletchley") {
      students.lastName = "Fletchley";
    }
    if (students.firstName === "Padma") {
      students.firstName = "Padme";
    }
    const tilBilleder = students.lastName.toLowerCase();
    const tilBilleder2 = students.firstName.charAt(0).toLowerCase();
    const tilBilleder3 = students.firstName.toLowerCase();

    if (students.lastName === "Patil") {
      students.photos = `billeder/images/${tilBilleder}_${tilBilleder3}.png`;
    } else {
      students.photos = `billeder/images/${tilBilleder}_${tilBilleder2}.png`;
    }

    students.id = uuid();
    students.gender = capitalize(person.gender);

    if (parts.length === 3) {
      students.middleName = capitalize(parts[1]);
    } else {
      students.middleName = "";
    }
    //sørger for at folk med middle Name komemr frem
    if (parts.length === 1) {
      students.middleName = "";
      students.lastName = "";
      students.photos = `billeder/images/li_s.png`;
    }
    prepBloodType(students);
    allPersons.push(students);
  });
  visAlt();

  //sørger for at hvis alt bliver opdateret korrekt efter hvad der sorteres efter
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
      //sætter navn for hver elev og hus-navn ind i html
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

function clickSomething(event) {
  const element = event.target;
  console.log(allPersons[0].id);

  if (
    allPersons[0].id === element.dataset.id &&
    element.dataset.action === "remove"
  ) {
    alert("warning! This Student can under no circumstances be EXPELLED!!");
    document.querySelector("#pop-op").style.display = "none";
  } else if (element.dataset.action === "remove") {
    element.parentElement.classList.add("dissappear");
    setTimeout(function() {
      element.parentElement.remove();

      if (filter === "All Houses") {
        document.querySelector("#nsh").textContent = `No house selected`;
      } else {
        houseNumbers();
      }
    }, 700);
    document.querySelector("#pop-op").style.display = "none";

    console.log("removed the item");
    const index = allPersons.findIndex(findFunction);
    console.table(allPersons);

    //console.log(allPersons.id);
    function findFunction(persons) {
      if (persons.id === element.dataset.id) {
        return true;
      } else {
        return false;
      }
    }
    //const index = element.dataset.index;
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
}

const nyListe = [];

document.querySelector("#expel").addEventListener("click", lavExpelListe);

function lavExpelListe() {
  document.querySelector("#liste3").style.display = "none";
  let liste = document.querySelector("#liste2");
  liste.innerHTML = "";
  nyListe.forEach(ting => {
    //med denne if sætning sørges der for at der kan filtreres ud fra hvad filter er lig med
    liste.innerHTML += `<div class="mineretter"><h2> ${ting.firstName} ${ting.middleName}  ${ting.lastName}</h2><img src="${ting.photos}" alt="student" height="42" width="42"><p>${ting.gender}<br>${ting.house}</p></div>`;
    liste.style.display = "block";
    liste.style.color = "darkred";
  });
  houseNumbers();
}

/////////////////////////////////////prefect Students //////////////////////////////////////////////
const nyListe2 = [];

document.querySelector("#liste").addEventListener("click", clickSomething2);
let counterForPerfect = 0;
function clickSomething2(event) {
  const element = event.target;

  if (element.dataset.action === "prefect") {
    counterForPerfect++;
    document.querySelector("#pop-op").style.display = "none";

    console.log("Item made perfect");
    const index = allPersons.findIndex(findFunction);

    //console.log(allPersons.id);
    function findFunction(persons) {
      if (persons.id === element.dataset.id) {
        return true;
      } else {
        return false;
      }
    }
    //const index = element.dataset.index;

    if (counterForPerfect < 2) {
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

function lavExpelListe2() {
  document.querySelector("#liste2").style.display = "none";
  let liste = document.querySelector("#liste3");
  liste.innerHTML = "";

  nyListe2.forEach(ling => {
    //med denne if sætning sørges der for at der kan filtreres ud fra hvad filter er lig med
    liste.innerHTML += `<div class="mineretter"><h2> ${ling.firstName} ${ling.middleName}  ${ling.lastName}</h2><img src="${ling.photos}" alt="student" height="42" width="42"><p>${ling.gender}<br>${ling.house}</p><button id="revoke">Revoke Prefect</button></div>`;
    liste.style.display = "block";
    liste.lastElementChild.style.backgroundColor = "green";
  });
  document.querySelector("#revoke").addEventListener("click", revokePrefect);
}

function revokePrefect() {
  const element = event.target;
  counterForPerfect--;

  nyListe2.pop();
  console.log("done");

  element.parentElement.classList.add("dissappear");
}

function houseNumbers() {
  let n = document.querySelector("#liste").childElementCount;
  document.querySelector("#nsh").textContent = `Students in house: ${n}`;
}
