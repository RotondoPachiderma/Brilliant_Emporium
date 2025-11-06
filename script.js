//Ritorna l'oggetto di un prodotto dato il suo id in numero o stringa
function objectByUuid(id){
    id = Number(id)
    return products.find(product => product.id === id)
}


function htmlInjector(element, locationClass){
    const location = document.querySelector(locationClass)
    location.innerHTML = element
}

//Dato un oggetto prodotto ritorna l'HTML completo della tab di quel prodotto
function productHtmlGenerator(product){
    let productTab = `
        <div class="items">
            <p class="item-photo"> ${product.immagine}</p>
            <div class="item-text">
                <div class="item-name-rarity">
                    <p class="item-name">${product.name}</p>
                </div>
                <p class="item-desc"> ${product.descrizione}</p>
            </div>
            <button class="item-price js-${product.id}-price">${product.costo}pt</button>
            <button class="item-buy js-${product.id}-buy" onclick="buyButton(${product.id})">Compra</button>
        </div>`
    return productTab
}

//Dato un array di prodotti ritorna l'html dello shop
function shopCreator(products){
    let html = ""
    products.forEach(product =>{
        let productTab = productHtmlGenerator(product)
        html += productTab
    })
    return html
}

//Dato un array di prodotti ritorna l'html dei filtri
function filtersCreator(products){
    let filters = []
    let html = ""
    products.forEach(product =>{
        product.categoria.forEach(filter =>{
            if (!filters.includes(filter)) {
                filters.push(filter)
            }
        })
    })
    filters.forEach(filter =>{
        let button = `
        <button class="filter-button js-${filter}-button" onclick="filterButtonFunction('${filter}')">${filter}</button>`
        html += button
    })
    return html
}

//Data una stringa filtro prende l'array di prodotti e genera le tab solo dei prodotti con quel filtro, poi lo inietta nella pagina
function filtering(filter, products){
    let html = ""
    products.forEach(product =>{
        if (product.categoria.includes(filter)){
            let productTab = productHtmlGenerator(product)
        html += productTab
        }
    })
    htmlInjector(html, ".js-catalogo-wrapper")
}

//Data una stringa filtro prende il bottone con quel filtro nella classe e lo attiva ricreando la pagina dello shop. Disattiva gli altri bottoni
function filterButtonFunction(filter){
    let bottone = document.querySelector(`.js-${filter}-button`)
    if (!bottone.classList.contains("filter-button-active")){
        htmlInjector(filtersCreator(products), ".js-filters")
        bottone = document.querySelector(`.js-${filter}-button`)
        filtering(`${filter}`, products)
        bottone.classList.add("filter-button-active")
    }
    else{
        htmlInjector(shopCreator(products), ".js-catalogo-wrapper")
        bottone.classList.remove("filter-button-active")
    }
}

//Dato l'id di un prodotto inietta il nome del prodotto nella scheda di checkout e imposta il suo costo
function buyButton(productId){
    let popup = document.querySelector(".buy-overlay")
    let confirmationProduct = document.querySelector(".confirmation-product")
    let product = objectByUuid(productId)
    confirmationProduct.innerHTML = `${product.name}`
    popup.classList.remove("hidden")
    obscuredOverlay.classList.remove("hidden")
    currentCost = product.costo
}

function confirmationButtonFunction(youSure, cost){
    let popup = document.querySelector(".buy-overlay")
    let thankspopup = document.querySelector(".thanks")
    let brokepopup = document.querySelector(".broke")
    let balance = document.querySelector(".balance")
    popup.classList.add("hidden")
    if (!youSure){
        obscuredOverlay.classList.add("hidden")
        return
    }
    if (youBroke()){
        brokepopup.classList.remove("hidden")
        setTimeout(()=>{
            brokepopup.classList.add("hidden")
            obscuredOverlay.classList.add("hidden")
        },3000)
        return
    }
    thankspopup.classList.remove("hidden")
    setTimeout(()=>{
        thankspopup.classList.add("hidden")
        obscuredOverlay.classList.add("hidden")
    },1000)
    balance.innerHTML = Number(balance.innerHTML) - cost
    localStorage.setItem("balance", `${balance.innerHTML}`)
}

function youBroke(){
    if (currentCost > document.querySelector(".balance").innerHTML){return true}
}


function balanceSetter(){
    let balanceDisplay = document.querySelector(".balance")
    if (localStorage.getItem("balance")){
        balanceDisplay.innerHTML=Number(localStorage.getItem("balance"))
    }
    else {return}
}