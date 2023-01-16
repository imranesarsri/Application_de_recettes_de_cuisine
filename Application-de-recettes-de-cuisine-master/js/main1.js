let prev = document.getElementById("prev")
let next = document.getElementById("next")

// function Random Carte
for (let i = 0; i < 6; i++) {
  prev.style.display='none'
  next.style.display='none'
  async function randomCarte() {
    const dataRandomApi = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const dataRandomJson = await dataRandomApi.json();
    document.getElementById("container").innerHTML += `
      <div class="card" style="width: 18rem;">
        <img id="image1" src="${dataRandomJson.meals[0].strMealThumb}" class="card-img-top" alt="image_${i}">
        <div class="card-body">
          <h5 class="card-title text-center ">${dataRandomJson.meals[0].strMeal}</h5>
          <a value="val${i}" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="popupModal(${dataRandomJson.meals[0].idMeal})" class="btn btn-danger w-100 " id="btn_${i}"> Apprendre encore plus</a>
        </div>
      </div>
    `
  }
  randomCarte()
}


// function model
async function popupModal(id) {
  const dataModelApi = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const dataModelJson = await dataModelApi.json();
  let dataModel = dataModelJson.meals[0]
  document.getElementById("pup_header").innerHTML = dataModel.strMeal
  document.getElementById("Categorie").innerHTML =`Categorie : ${dataModel.strArea}`
  document.getElementById("Region").innerHTML = `Region : ${dataModel.strCategory}`
  document.getElementById("pup_img").src = dataModel.strMealThumb
  document.getElementById("pup_iframe").src= dataModel.strYoutube.replace("https://www.youtube.com/watch?v=" , "https://www.youtube.com/embed/" )
  document.getElementById("pup_parg").innerHTML = dataModel.strInstructions
  for(let k=1 ; k<=20 ; k++){
    if(dataModel["strIngredient"+k] !== null && dataModel["strIngredient"+k].length > 0 && dataModel["strIngredient"+k] !==" "){
        document.getElementById("strIngredient").innerHTML +=`<li> ${dataModel["strIngredient"+k]} </li> `
    }
  }
  for(let k=1 ; k<=20 ; k++){
    if(dataModel["strMeasure"+k] !== null && dataModel["strMeasure"+k].length > 0 && dataModel["strMeasure"+k] !==" "){
  document.getElementById("strMeasure").innerHTML += `<li> ${dataModel["strMeasure"+k]} </li>`
    }
  }
}


// start Pagination

let firstIndex = 0
let lastIndex = 6
let sliderNumber = 0


let paginationElement = document.getElementById('dtaUl')

// function button Previous
function prevBtn() {
  if(prev.classList.contains('disabled')){
      return false
  }else{
  firstIndex-=6
  lastIndex-=6
  sliderNumber--
  search()
  }
}


// function button Next
function nextBtn() {
  if(next.classList.contains('disabled')){
      return false
  }else{
  firstIndex+=6
  lastIndex+=6
  sliderNumber++
  search()
  }
}


// function button slider
function btnSlider() {
  let pginqtionUl = Array.from(document.querySelectorAll("#dtaUl li"))
  for(let i=0; i<pginqtionUl.length ; i++){
    pginqtionUl[i].onclick = function() {
      firstIndex = parseInt(this.getAttribute('data-slider')*6)
      lastIndex = firstIndex +6
      sliderNumber = parseInt(this.getAttribute('data-slider'))
      search()
    }
  }
}


// function search
async function search() {
  let inp = document.getElementById("search")
  if(inp.value.length !== 0){
    paginationElement.style.display='block'
    prev.style.display='block'
    next.style.display='block'
    const dtasearchApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inp.value}`)
    const dataSearchJson = await dtasearchApi.json()
    let dataResult = dataSearchJson.meals 

    // creer des slider

    paginationElement.style.display='block'
    paginationElement.innerHTML=''
    for(let i =0 ; i<Math.ceil(dataSearchJson.meals.length/6 );i++){
        paginationElement.innerHTML +=`<li data-slider="${i}">${i+1}</li>`
    }
    btnSlider()

    // add and remove classe disabled on button previous and next
    if(firstIndex == 0){
      prev.classList.add('disabled')
      paginationElement.children[sliderNumber].classList.add('active')
    }else {
      prev.classList.remove('disabled')
      paginationElement.children[sliderNumber].classList.add('active')
    }
    if(firstIndex <= dataSearchJson.meals.length && firstIndex >= dataSearchJson.meals.length-6){
      next.classList.add('disabled')
    }else {
      next.classList.remove('disabled')
    }


    // creer des card
    document.getElementById("container").innerHTML =""
    for (let i = firstIndex; i <lastIndex ; i++) {      
      document.getElementById("container").innerHTML +=
      `
        <div class="card" style="width: 18rem;">
          <img id="image1" src="${dataResult[i].strMealThumb}" class="card-img-top" alt="image_${i}">
          <div class="card-body">
            <h5 class="card-title text-center ">${dataResult[i].strMeal}</h5>
            <a value="val${i}" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="popupModal(${dataResult[i].idMeal})" class="btn btn-danger w-100" id="btn_${i}">Apprendre encore plus</a>
          </div>
        </div>
      `
        }

  }else {
    paginationElement.style.display='none'
    prev.style.display='none'
    next.style.display='none'
    document.getElementById("container").innerHTML = ''
    for (let i = 0; i < 6; i++) {
      async function randomCarte() {
      const dataRandomApi = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const dataRandomJson = await dataRandomApi.json();
      document.getElementById("container").innerHTML += `
        <div class="card" style="width: 18rem;">
          <img id="image1" src="${dataRandomJson.meals[0].strMealThumb}" class="card-img-top" alt="image_${i}">
          <div class="card-body">
              <h5 class="card-title text-center ">${dataRandomJson.meals[0].strMeal}</h5>
              <a value="val${i}" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="popupModal(${dataRandomJson.meals[0].idMeal})" class="btn btn-danger w-100 " id="btn_${i}">Apprendre encore plus</a>
            </div>
        </div>
        `
      }
      randomCarte()
    }
  }
}