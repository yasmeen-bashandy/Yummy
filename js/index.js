//!>>>>>>>>>>>> Global >>>>>>>>>>
let links = document.querySelectorAll(".links li");
let rowData = document.getElementById("rowData");
let searchContent = document.getElementById("searchContent");
const mode = document.getElementById("mode");

//! >>>>>>>>>> when start >>>>>>>>>>>>>>>>>

// last mode
if (localStorage.getItem("theme") != null) {
  const themeData = localStorage.getItem("theme"); // light Or dark

  if (themeData === "light") {
    mode.classList.replace("fa-toggle-on", "fa-toggle-off"); // sun to moon
  } else {
    mode.classList.replace("fa-toggle-off", "fa-toggle-on"); // moon to sun
  }

  document.querySelector("html").setAttribute("data-theme", themeData); // light Or dark
}

// first display on website
getHomeMeals();

// close navbar when open website
closeSideNav();
$(".side-nav i.sidebarBtn").click(() => {
  if ($(".side-nav").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

// links
$(document).ready(function () {
  $("#categoriesLink").click(function () {
    getCategories();
    closeSideNav();
  });

  $("#AreaLink").click(function () {
    getArea();
    closeSideNav();
  });

  $("#IngredientsLink").click(function () {
    getIngredients();
    closeSideNav();
  });

  $("#Search").click(function () {
    showSearchInputs();
    closeSideNav();
  });

  $("#Contact").click(function () {
    showContacts();
    closeSideNav();
  });
});

//! >>>>>>>>>>>>>>>>> Events >>>>>>>>>>>>>>>
// when click on nav links change color
links.forEach(function (link) {
  link.addEventListener("click", function () {
    document.querySelector(".links .active").classList.remove("active");
    link.classList.add("active");
    //  console.log(link[i]);
  });
});

//  light and dark mode
mode.addEventListener("click", function (e) {
  if (mode.classList.contains("fa-toggle-on")) {
    document.querySelector("html").setAttribute("data-theme", "light");
    mode.classList.replace("fa-toggle-on", "fa-toggle-off"); // change icon -->light
    localStorage.setItem("theme", "light");
  } else {
    mode.classList.replace("fa-toggle-off", "fa-toggle-on"); //change icon -->dark
    document.querySelector("html").setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

// loader when start website
$(document).ready(() => {
  $("#loader").fadeOut(500);
});

//!>>>>>>>>>>>>>>>>>>> Function >>>>>>>>>>>>>>>>>>

function openSideNav() {
  $(".side-nav").animate({
      left: 0
  }, 500)


  $(".sidebarBtn").removeClass("fa-align-justify");
  $(".sidebarBtn").addClass("fa-x");


  for (let i = 0; i < 5; i++) {
      $(".links li").eq(i).animate({
          top: 0
      }, (i + 5) * 100)
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav .nav-tab").outerWidth()
  $(".side-nav").animate({
      left: -boxWidth
  }, 500)

  $(".sidebarBtn").addClass("fa-align-justify");
  $(".sidebarBtn").removeClass("fa-x");


  $(".links li").animate({
      top: 300
  }, 500)
}

// function display Meals command between Api
function displayMeals(arr) {
  let cartona = "";

  for (let i = 0; i < arr.length; i++) {
    cartona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartona;
}

// Categories API
async function getCategories() {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();

  displayCategories(response.categories);
  $("#loader").fadeOut(300);
}
// Categories display
function displayCategories(arr) {
  let cartona = "";

  for (let i = 0; i < arr.length; i++) {
    cartona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${
                  arr[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${
                  arr[i].strCategoryThumb
                }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
               </div>
        </div>
        `;
  }

  rowData.innerHTML = cartona;
}

// Categories meals API
async function getCategoryMeals(category) {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $("#loader").fadeOut(300);
}

// Home meals API
async function getHomeMeals() {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  response = await response.json();
  // console.log(response);

  displayMeals(response.meals.slice(0, 20));
  $("#loader").fadeOut(300);
}

// Area API
async function getArea() {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  // console.log(response.meals);

  $("#loader").fadeOut(300);
  displayArea(response.meals);
}

// Area display
function displayArea(arr) {
  let cartona = "";

  for (let i = 0; i < arr.length; i++) {
    cartona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer area">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartona;
}

// AreaMeals API
async function getAreaMeals(area) {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $("#loader").fadeOut(300);
}

// Ingredients API
async function getIngredients() {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  // console.log(response.meals);

  $("#loader").fadeOut(300);
  displayIngredients(response.meals.slice(0, 20));
}

// Ingredients display
function displayIngredients(arr) {
  let cartona = "";

  for (let i = 0; i < arr.length; i++) {
    cartona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer area">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = cartona;
}

// Ingredients Meals API
async function getIngredientsMeals(ingredients) {
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $("#loader").fadeOut(300);
}

// Meals Details API
async function getMealDetails(mealID) {
  closeSideNav();
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();

  displayMealDetails(response.meals[0]);
  $("#loader").fadeOut(300);
}

// display Meals Details
function displayMealDetails(meal) {
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");

  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartona = `
                <div onclick="getHomeMeals()" class="icon  d-flex justify-content-end p-4 " >
                <i  class="fa-solid fa-xmark fa-2x"></i>
            </div>
            <div class="col-md-4">
            
                <h2 class="ms-2">${meal.strMeal}</h2>
                <img class="w-75 m-auto rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    
            </div>
            <div class="col-md-8">
            
                <h2 >Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder text-danger">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder text-danger">Category : </span>${meal.strCategory}</h3>
                <h3 class="text-danger">Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3 class="text-danger">Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
            `;
            rowData.innerHTML = cartona;
           
}



function showSearchInputs() {
  searchContent.innerHTML = `
    <div class="row pt-5 pb-2 ">
        <div class="col-md-6 ">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;

  rowData.innerHTML = "";
}

async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $("#loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $("#loader").fadeOut(300);
}

async function searchByFirstLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $("#loader").fadeIn(300);

  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $("#loader").fadeOut(300);
}

function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-3 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
