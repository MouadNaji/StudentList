//nogle af funktionerne er kopiret fra en gammel opgave, derfor de har unormale navne. Ændre senere
"use strict";
document.addEventListener("DOMContentLoaded", start);
("use scrict");

let personer = [];
//variabel for indholdet
let filter = "All Houses";
//variable for filter

async function start() {
  const json = await fetch("http://petlatkea.dk/2019/students1991.json");

  personer = await json.json();
  //Henter data fra JSON fil ned
  sorting(personer);
  visPersoner();
}

function sorting(personer) {
  personer.sort((a, b) => {
    return a.fullname.localeCompare(b.fullname);
  });
  //Sortere alfabetisk
}

function visPersoner() {
  let liste = document.querySelector("#liste");
  liste.innerHTML = "";

  personer.forEach(ret => {
    if (filter == "All Houses" || ret.house == filter) {
      let template = `<div class="mineretter"><h2> ${ret.fullname}</h2><p>${ret.house}</p></div>`;
      liste.insertAdjacentHTML("beforeend", template);
      //sætter navn for hver elev og hus-navn ind i html
      liste.lastElementChild.addEventListener("click", visSingle);
      liste.lastElementChild.addEventListener("click", () => {
        visSingle(person);
      });
      //eventlistener for "klik på elever"
      function visSingle(person) {
        document.querySelector("#pop-op").style.display = "block";
        document
          .querySelector("#pop-op #lukknap")
          .addEventListener("click", close);
        //sørger for at der kommer pop-op side frem
        document.querySelector(
          "#indhold"
        ).innerHTML = `<h2> ${ret.fullname}</h2><p>${ret.house}</p>`;
        if (ret.house == "Ravenclaw") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img class="raven" src="billeder/blue.png" alt="gul" height="200" width="200">`;
          document.querySelector("#pop-op").style.background =
            "rgba(4, 4, 94, 0.5)";
        } else if (ret.house == "Slytherin") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img class="snake" src="billeder/green.png" alt="gul" height="200" width="200">`;
          document.querySelector("#pop-op").style.background =
            "rgba(1, 71, 65, 0.5)";
        } else if (ret.house == "Gryffindor") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img class="fugl" src="billeder/red.png" alt="red" height="200" width="200">`;
          document.querySelector("#pop-op").style.background =
            "rgba(87, 5, 28, 0.5)";
        } else if (ret.house == "Hufflepuff") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img class="bi" src="billeder/yellow.png" alt="gul" height="200" width="200">`;
          document.querySelector("#pop-op").style.background =
            "rgba(84, 67, 30, 0.5)";
        }
        //sørger for at logo og farve kommer for hver elev afhængig af hus
        start();
      }
    }
  });
}

function close() {
  document.querySelector("#pop-op").style.display = "none";
  //lukker pop-op
}

document.querySelectorAll(".filter").forEach(knap => {
  knap.addEventListener("click", filtrering);
  //eventlistener for filter
});

function filtrering() {
  document.querySelectorAll(".filter").forEach(knap => {
    knap.classList.remove("valgt");
  });
  this.classList.add("valgt");
  document.querySelector("h1").textContent = this.textContent;
  filter = this.getAttribute("data-hold");
  console.log(filter);
  //filtrering iforhold til hus
  visPersoner();
}
