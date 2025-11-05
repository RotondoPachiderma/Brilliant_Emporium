function shopCreator(products){
    let html = ""
    products.forEach(product =>{
        let productTab = `
        <div class="items">
            <p class="item-photo"> ${product.immagine}</p>
            <div class="item-text">
                <div class="item-name-rarity">
                    <p class="item-name">${product.name}</p>
                </div>
                <p class="item-desc"> ${product.descrizione}</p>
            </div>
            <button class="item-price">${product.costo}pt</button>
            <button class="item-buy js-${product.name}-buy" onclick="productButtonFunction('${product.name}')">Compra</button>
        </div>`
        html += productTab
    })
    return html
}

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

function filtering(filter, products){
    let html = ""
    products.forEach(product =>{
        if (product.categoria.includes(filter)){
            let productTab = `
            <div class="items">
                <p class="item-photo"> ${product.immagine}</p>
                <div class="item-text">
                    <div class="item-name-rarity">
                        <p class="item-name">${product.name}</p>
                    </div>
                    <p class="item-desc"> ${product.descrizione}</p>
                </div>
                <button class="item-price">${product.costo}pt</button>
                <button class="item-buy js-${product.name}-buy">Compra</button>
            </div>`
        html += productTab
        }
    })
    htmlInjector(html, ".js-catalogo-wrapper")
}

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

function productButtonFunction(product){
    let bottone = document.querySelector(`.js-${product}-button`)
}


function htmlInjector(element, locationClass){
    const location = document.querySelector(locationClass)
    location.innerHTML = element
}