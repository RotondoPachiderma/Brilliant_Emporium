function shopCreator(){
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
                <button class="item-buy">Compra</button>
            </div>
        `
        html += productTab
    })
    return html
}