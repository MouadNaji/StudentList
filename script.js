//nogle af funktionerne er kopiret fra en gammel opgave, derfor de har unormale navne. Ændre senere
"use strict";
document.addEventListener("DOMContentLoaded", start);

let personer = [];
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
  gender: "-gender"
};
//prototype variabel
async function start() {
  const json = await fetch(
    "https://petlatkea.dk/2019/hogwartsdata/students.json"
  );

  personer = await json.json();
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
function uuid() {
  let bytes = window.crypto.getRandomValues(new Uint8Array(32));
  const randomBytes = () => (bytes = bytes.slice(1)) && bytes[0];

  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (randomBytes() & (15 >> (c / 4)))).toString(16)
  );
}
function prepareObjects(personer) {
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

    allPersons.push(students);
  });

  visAlt();
  //sørger for at hvis alt bliver opdateret korrekt efter hvad der sorteres efter
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
// funktionen capitalize bliver brugt til at gøre det første bogstav stort og resten af ordet småt
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
}
function visAlt() {
  let liste = document.querySelector("#liste");
  liste.innerHTML = "";

  allPersons.forEach(person => {
    if (filter == "All Houses" || person.house == filter) {
      //med denne if sætning sørges der for at der kan filtreres ud fra hvad filter er lig med
      let template = `<div class="mineretter"><h2> ${person.firstName} ${person.middleName}  ${person.lastName}</h2><img src="${person.photos}" alt="student" height="42" width="42"><p>${person.gender}<br>${person.house}</p><button id="lort" data-id="${person.id}" data-action="remove">Expel Student</button><button id="lort2" data-id="${person.id}" data-action="prefect">Prefect</button></div>`;
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
}
function visSingle(person) {
  document.querySelector("#pop-op").style.display = "block";
  document.querySelector("#pop-op #lukknap").addEventListener("click", close);
  //sørger for at der kommer pop-op side frem
  document.querySelector(
    "#indhold"
  ).innerHTML = `<h2> ${person.firstName} ${person.middleName} ${person.lastName}</h2><p>${person.house}</p>`;
  if (person.house == "Ravenclaw") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<img class="raven" src="billeder/blue.png" alt="gul" height="200" width="200">`;
    document.querySelector("#pop-op").style.background = "rgba(4, 4, 94, 0.5)";
  } else if (person.house == "Slytherin") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<img class="snake" src="billeder/green.png" alt="gul" height="200" width="200">`;
    document.querySelector("#pop-op").style.background = "rgba(1, 71, 65, 0.5)";
  } else if (person.house == "Gryffindor") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<img class="fugl" src="billeder/red.png" alt="red" height="200" width="200">`;
    document.querySelector("#pop-op").style.background = "rgba(87, 5, 28, 0.5)";
  } else if (person.house == "Hufflepuff") {
    document.querySelector(
      "#indhold"
    ).innerHTML += `<img class="bi" src="billeder/yellow.png" alt="gul" height="200" width="200">`;
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

document.querySelector("#liste").addEventListener("click", clickSomething);

function clickSomething(event) {
  const element = event.target;

  if (element.dataset.action === "remove") {
    element.parentElement.classList.add("dissappear");
    setTimeout(function() {
      element.parentElement.remove();
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
}

////peeeeeeeeeeeerffffeeeeeeecccctss////////////////////////////////////////////
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

    if (counterForPerfect < 5) {
      nyListe2.push(allPersons[index]);
    } else {
      alert(`only 4 Students can be in Prefect`);
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
    liste.innerHTML += `<div class="mineretter"><h2> ${ling.firstName} ${ling.middleName}  ${ling.lastName}</h2><img src="${ling.photos}" alt="student" height="42" width="42"><p>${ling.gender}<br>${ling.house}</p></div>`;
    liste.style.display = "block";
    liste.lastElementChild.style.backgroundColor = "green";
  });
}
