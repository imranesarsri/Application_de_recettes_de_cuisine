
// search categorie
async function Categorie() {
    document.getElementById("select1").innerHTML+=`<option>Lamb</option>`
    const DataApiCategorie = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const DataJsonCategorie = await DataApiCategorie.json()
    console.log(DataJsonCategorie)
    for (let i = 0; i < DataJsonCategorie.meals.length; i++) {
        if(DataJsonCategorie.meals[i].strCategory === 'Lamb'){
        continue
        }
        document.getElementById("select1").innerHTML+=
        `<option>${DataJsonCategorie.meals[i].strCategory}</option>`;
    }
    document.getElementById("select1").innerHTML+=
    `<option class="optionAll" value="All">ALL</option>`;
}
Categorie();


// search region
async function Region() {
    document.getElementById("select2").innerHTML +=`<option>Moroccan</option>`
    const DataApiRegion = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    const DataJsonRegion = await DataApiRegion.json()
    // console.log(DataJsonRegion)
    document.getElementById("container").innerHTML =""
    for (let i = 0; i < DataJsonRegion.meals.length; i++) {
        if(DataJsonRegion.meals[i].strArea === 'Moroccan'){
            continue
            }
        document.getElementById("select2").innerHTML +=
        `<option>${DataJsonRegion.meals[i].strArea}</option>`
    }
    document.getElementById("select2").innerHTML +=
    `<option class="optionAll" value="All">ALL</option>`
}
Region()




// start Pagination

let firstIndex = 0
let lastIndex = 6
let sliderNumber = 0

let paginationElement = document.getElementById('dtaUl')
let prev = document.getElementById("prev")
let next = document.getElementById("next")


// function button Previous
function prevBtn() {
    if(prev.classList.contains('disabled')){
        return false
    }else{
        firstIndex-=6
        lastIndex-=6
        sliderNumber--
        Search()
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
        Search()
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
            Search()
        }
    }
}





async function Search() {

    let onchangeSelectCategorie = document.getElementById("select1").value
    let onchangeSelectRegion = document.getElementById("select2").value
    let result = []
    if(onchangeSelectCategorie !== 'All' && onchangeSelectRegion !== 'All'){
        const DataApiSearchCategorie =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${onchangeSelectCategorie}`)
        const DataJsonSearchCategorie =await DataApiSearchCategorie.json()
        let DataCategorie = DataJsonSearchCategorie.meals
        let arrIdCategorie = []
        for(let i=0 ; i<DataCategorie.length ;i++){
            arrIdCategorie.push(DataCategorie[i].idMeal)
        }
        console.log(arrIdCategorie)



        const DataApiSearchRegion =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${onchangeSelectRegion}`)
        const DataJsonSearchRegion =await DataApiSearchRegion.json()
        let DataRegion = DataJsonSearchRegion.meals
        let arrIdRegion = []
        for(let i=0 ; i<DataRegion.length ;i++){
            arrIdRegion.push(DataJsonSearchRegion.meals[i].idMeal)
        }
        console.log(arrIdRegion)



        let arr_categorie_region = arrIdRegion.concat(arrIdCategorie)
        result =  arr_categorie_region.filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i)
        console.log(result)


    }else if(onchangeSelectCategorie == 'All' && onchangeSelectRegion !== 'All'){

        const DataApiSearchRegion =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${onchangeSelectRegion}`)
        const DataJsonSearchRegion =await DataApiSearchRegion.json()
        let DataRegion = DataJsonSearchRegion.meals
        for(let i=0 ; i<DataRegion.length ;i++){
            result.push(DataJsonSearchRegion.meals[i].idMeal)
        }
        console.log(result)

    }else if(onchangeSelectCategorie !== 'All' && onchangeSelectRegion == 'All'){

        const DataApiSearchCategorie =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${onchangeSelectCategorie}`)
        const DataJsonSearchCategorie =await DataApiSearchCategorie.json()
        let DataCategorie = DataJsonSearchCategorie.meals
        for(let i=0 ; i<DataCategorie.length ;i++){
            result.push(DataCategorie[i].idMeal)
        }
        console.log(result)
    }else{
        const DataApiCategorie = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const DataJsonCategorie = await DataApiCategorie.json()
        console.log(DataJsonCategorie)
        arrAllAll=[]
        for(let i=0 ; i<DataJsonCategorie.meals.length ; i++){
            arrAllAll.push(DataJsonCategorie.meals[i].strCategory)

            const DataApiSearchCategorie =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${arrAllAll[i]}`)
            const DataJsonSearchCategorie =await DataApiSearchCategorie.json()
            let DataCategorie = DataJsonSearchCategorie.meals
            for(let k=0 ; k<DataCategorie.length ;k++){
                result.push(DataCategorie[k].idMeal)
            }
            
        }
        console.log(result)
    }

    paginationElement.style.display='block'
    paginationElement.innerHTML=''
    if(result.length >0){
    for(let i =0 ; i<Math.ceil(result.length/6 );i++){
        paginationElement.innerHTML +=`<li data-slider="${i}">${i+1}</li>`
    }
    btnSlider()
    console.log(result.length/6 )
    

    // add and remove classe disabled on button previous and next
    if(firstIndex == 0){
        prev.classList.add('disabled')
        paginationElement.children[sliderNumber].classList.add('active')
    }else {
        prev.classList.remove('disabled')
        paginationElement.children[sliderNumber].classList.add('active')
    }
    if(firstIndex <= result.length && firstIndex >= result.length-6){
        next.classList.add('disabled')
    }else {
        next.classList.remove('disabled')
    }
}

      // creer des card

    document.getElementById("container").innerHTML =""
    document.getElementById("image_error").src =""
    for(let i=firstIndex ; i<lastIndex; i++){
    
        if(result.length>=1){
            const daataresult =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${result[i]}`)
            const datadaataresult =await daataresult.json()
            let dataresult = datadaataresult.meals[0]
    
            document.getElementById("container").innerHTML +=
            `
            <div class="card" style="width: 18rem;">
                <img id="image1" src="${dataresult.strMealThumb}" class="card-img-top" alt="image_${i+1}">
                <div class="card-body">
                    <h5 class="card-title text-center ">${dataresult.strMeal}</h5>
                    <a value="val${i+1}" data-bs-toggle="modal" data-bs-target="#staticBackdrop"  onclick="popupModal( ${dataresult.idMeal})" class="btn btn-danger w-100 " id="btn_${i+2}">Apprendre encore plus</a>
                </div>   
            </div>
            `

        }else if(result.length ==0){
            console.log('ssssssss')
            document.getElementById("container").innerHTML =""
            document.getElementById("image_error").src ="../image/image_error.jpg"
            next.style.display='none'
            prev.style.display='none'
        }
    }
}
Search()



// model
async function popupModal(id) {
    const modelData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const mealInfo = await modelData.json();
    let data = mealInfo.meals[0]

    document.getElementById("pup_header").innerHTML = data.strMeal
    document.getElementById("Categorie").innerHTML = `Categorie : ${data.strArea}`
    document.getElementById("Region").innerHTML = `Region : ${data.strCategory}`
    document.getElementById("pup_img").src = data.strMealThumb
    document.getElementById("pup_iframe").src= data.strYoutube.replace("https://www.youtube.com/watch?v=" , "https://www.youtube.com/embed/" )
    document.getElementById("pup_parg").innerHTML = data.strInstructions
    for(let k=1 ; k<=20 ; k++ ){
        if(data["strIngredient"+k] !== null && data["strIngredient"+k].length > 0 && data["strIngredient"+k] !==" "){
            document.getElementById("strIngredient").innerHTML +=`<li> ${data["strIngredient"+k]} </li> `
        }
    }
    for(let k=1 ; k<=20 ; k++ ){
        if(data["strMeasure"+k] !== null && data["strMeasure"+k].length > 0 && data["strMeasure"+k] !==" "){
        document.getElementById("strMeasure").innerHTML += `<li> ${data["strMeasure"+k]} </li>`
        }
    }
    console.log(data)
}
