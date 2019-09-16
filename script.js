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
  house: "-age"
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
}

function prepareObjects(personer) {
  personer.forEach(person => {
    const students = Object.create(Array);
    const parts = person.fullname.trim().split(" ");
    const houses = person.house.trim();
    students.firstName = capitalize(parts[0]);
    students.lastName = capitalize(parts[parts.length - 1]);
    students.house = capitalize(houses);

    if (parts.length === 3) {
      students.middleName = capitalize(parts[1]);
    } else {
      students.middleName = "";
    }
    //sørger for at folk med middle Name komemr frem
    if (parts.length === 1) {
      students.middleName = "";
      students.lastName = "";
    }

    allPersons.push(students);

    document.querySelector("#fornavn").addEventListener("click", sorting);
    //sortere efte fornavn
    document.querySelector("#efternavn").addEventListener("click", sorting2);
    //sortere efter efternavn
  });

  visAlt();
  //sørger for at hvis alt bliver opdateret korrekt efter hvad der sorteres efter
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

function visAlt() {
  let liste = document.querySelector("#liste");
  liste.innerHTML = "";

  allPersons.forEach(person => {
    if (filter == "All Houses" || person.house == filter) {
      let template = `<div class="mineretter"><h2> ${person.firstName} ${person.middleName}  ${person.lastName}</h2><p>${person.house}</p></div>`;
      liste.insertAdjacentHTML("beforeend", template);
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
  document.querySelectorAll(".filter").forEach(knap => {
    knap.addEventListener("click", filtrering);
    //eventlistener for filter knappen der skal ændre sig
  });
}
close();
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
