//Fetches json data
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
const menuUrl = "./menu.json"; //fileName to load
const menuAllDishes = await fetchData(menuUrl); //Saves json data to local array, await forces fetchData to be done before continuing
const language = "./language.json"; //fileName to load
const changeLangOtherText = await fetchData(language); //Saves json data to local array, await forces fetchData to be done before continuing

let changeLangOtherDOM = []; // Array of all DOM-elements that will change language, except dishes

//DOM-data
const display = document.querySelector("#dishes-data");
const langSelect = document.querySelector("#language-select");
const htmlTag = document.querySelector("html");
const checkVeg = document.querySelector("#filter-veg");
const checkBeef = document.querySelector("#filter-beef");
const checkChicken = document.querySelector("#filter-chicken");
const checkPork = document.querySelector("#filter-pork");
const checkFish = document.querySelector("#filter-fish");
const checkSeafood = document.querySelector("#filter-seafood");
const checkGluten = document.querySelector("#filter-gluten");
const checkLactose = document.querySelector("#filter-lactose");
const title = document.querySelector("h1");
const langWord = document.querySelectorAll("label")[0];
const swedish = document.querySelectorAll("option")[0];
const sortWord = document.querySelectorAll("label")[1];
const priceRising = document.querySelectorAll("option")[3];
const priceFalling = document.querySelectorAll("option")[4];
const clearFilter = document.querySelector("button");
const meatDishes = document.querySelectorAll("h3")[0];
const labelVeg = document.querySelectorAll("label")[2];
const labelBeef = document.querySelectorAll("label")[3];
const labelChicken = document.querySelectorAll("label")[4];
const labelPork = document.querySelectorAll("label")[5];
const labelFish = document.querySelectorAll("label")[6];
const labelSeafood = document.querySelectorAll("label")[7];
const allergies = document.querySelectorAll("h3")[1];
const labelGluten = document.querySelectorAll("label")[8];
const labelLactose = document.querySelectorAll("label")[9];

changeLangOtherDOM.push(
  title,
  langWord,
  swedish,
  sortWord,
  priceRising,
  priceFalling,
  clearFilter,
  meatDishes,
  labelVeg,
  labelBeef,
  labelChicken,
  labelPork,
  labelFish,
  labelSeafood,
  allergies,
  labelGluten,
  labelLactose
);

let currentDishes = menuAllDishes; //Copy info to another array that we want to filter
let langNumber = 0; //sets the language to swedish at start

displayDishes(); //display all dishes at start

//call this function to display the current filtered dishes
function displayDishes() {
  let menuDisplay = currentDishes
    .map((object) => {
      switch (
        object.price.length //check how many prices a dish has
      ) {
        case 1: //display if dish has only one price
          return `
                <div class="dish">
                    <br>
                    <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr</h3>
                    <p class="dish-info">${object.language[langNumber].info}</p>
                    <br>
                </div>
                `;
          break;
        case 2: //display if dish has two prices
          return `
                <div class="dish">
                    <br>
                    <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr / ${object.price[1]} kr</h3>
                    <p class="dish-info">${object.language[langNumber].info}</p>
                    <br>
                </div>
                `;
          break;
      }
    })
    .join(""); //Removes the "," between each dish object caused by reading the json-file.
  display.innerHTML = menuDisplay;
}

//handles multiple filters in the right order and displays filtered dishes
function filterLogic() {
  currentDishes = menuAllDishes; //reset all dishes

  //filter meat choices first, if any are checked
  if (
    checkVeg.checked ||
    checkBeef.checked ||
    checkChicken.checked ||
    checkPork.checked ||
    checkFish.checked ||
    checkSeafood.checked
  ) {
    filterMeat();
  }

  //filter gluten free choice after meat filter, if checked
  if (checkGluten.checked) {
    filterGluten();
  }

  //filter lactose free choice last, if checked
  if (checkLactose.checked) {
    filterLactose();
  }

  displayDishes();
}

//filter meat dishes
function filterMeat() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkVeg.checked && object.meatType[0] === "Vegetarian") {
      return object;
    } else if (checkBeef.checked && object.meatType[0] === "Beef") {
      return object;
    } else if (checkChicken.checked && object.meatType[0] === "Chicken") {
      return object;
    } else if (checkPork.checked && object.meatType[0] === "Pork") {
      return object;
    } else if (checkFish.checked && object.meatType[0] === "Fish") {
      return object;
    } else if (checkSeafood.checked && object.meatType[0] === "Seafood") {
      return object;
    } else if (checkPork.checked && object.meatType[1] === "Pork") {
      return object;
    } else if (checkFish.checked && object.meatType[1] === "Fish") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

//filter gluten free dishes
function filterGluten() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkGluten.checked && object.allergies[0] === "GlutenFree") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

//filter lactose free dishes
function filterLactose() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkLactose.checked && object.allergies[0] === "LactoseFree") {
      return object;
    } else if (checkLactose.checked && object.allergies[1] === "LactoseFree") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

checkVeg.addEventListener("change", () => {
  //uncheck all meat boxes if true
  if (checkVeg.checked) {
    checkBeef.checked = false;
    checkChicken.checked = false;
    checkPork.checked = false;
    checkFish.checked = false;
    checkSeafood.checked = false;
  }
  filterLogic();
});

checkBeef.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkBeef.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkChicken.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkChicken.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkPork.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkPork.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkFish.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkFish.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkSeafood.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkSeafood.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkGluten.addEventListener("change", () => {
  filterLogic();
});

checkLactose.addEventListener("change", () => {
  filterLogic();
});

//uncheck all filterboxes and display all dishes
clearFilter.addEventListener("click", () => {
  checkVeg.checked = false;
  checkBeef.checked = false;
  checkChicken.checked = false;
  checkPork.checked = false;
  checkFish.checked = false;
  checkSeafood.checked = false;
  checkGluten.checked = false;
  checkLactose.checked = false;

  currentDishes = menuAllDishes;
  displayDishes();
});

//Handels language selection and display the new choosen language
langSelect.addEventListener("change", () => {
  switch (langSelect.value) {
    case "svenska":
      langNumber = 0;
      htmlTag.setAttribute("lang", "sv");
      break;
    case "english":
      langNumber = 1;
      htmlTag.setAttribute("lang", "en");
      break;
  }

  displayLangOtherDOM();
  displayDishes();
});

//Changes the text on everything except dishes
function displayLangOtherDOM() {
  for (let i = 0; i < changeLangOtherDOM.length; i++) {
    changeLangOtherDOM[i].innerHTML =
      changeLangOtherText[i].language[langNumber];
  }
}
