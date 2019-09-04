document.addEventListener("DOMContentLoaded", start);

let retter = [];
let filter = "All Houses";

async function start() {
  const json = await fetch("http://petlatkea.dk/2019/students1991.json");

  retter = await json.json();
  retter.sort((a, b) => {
    return a.fullname.localeCompare(b.fullname);
  });

  visRetterne();
}

function visRetterne() {
  let liste = document.querySelector("#liste");
  liste.innerHTML = "";

  retter.forEach(ret => {
    if (filter == "All Houses" || ret.house == filter) {
      let template = `<div class="mineretter"><h2> ${ret.fullname}</h2><p>${ret.house}</p></div>`;
      liste.insertAdjacentHTML("beforeend", template);
      liste.lastElementChild.addEventListener("click", visSingle);
      liste.lastElementChild.addEventListener("click", () => {
        visSingle(person);
      });

      function visSingle(person) {
        document.querySelector("#pop-op").style.display = "block";
        document
          .querySelector("#pop-op #lukknap")
          .addEventListener("click", close);

        document.querySelector(
          "#indhold"
        ).innerHTML = `<h2> ${ret.fullname}</h2><p>${ret.house}</p>`;
        if (ret.house == "Ravenclaw") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img src="billeder/gul.jpg" alt="gul" height="200" width="200">`;
        } else if (ret.house == "Slytherin") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img src="billeder/red.jpg" alt="gul" height="200" width="200">`;
        } else if (ret.house == "Gryffindor") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img src="billeder/blaa.jpg" alt="gul" height="200" width="200">`;
        } else if (ret.house == "Hufflepuff") {
          document.querySelector(
            "#indhold"
          ).innerHTML += `<img src="billeder/green.jpg" alt="gul" height="200" width="200">`;
        }
        start();
      }
    }
  });
}

function close() {
  document.querySelector("#pop-op").style.display = "none";
}

document.querySelectorAll(".filter").forEach(knap => {
  knap.addEventListener("click", filtrering);
});

function filtrering() {
  document.querySelectorAll(".filter").forEach(knap => {
    knap.classList.remove("valgt");
  });
  this.classList.add("valgt");
  document.querySelector("h1").textContent = this.textContent;
  filter = this.getAttribute("data-hold");
  console.log(filter);
  visRetterne();
}
