const catalog = {

    catalogProducts: undefined,
    productDiv: undefined,
    filtersDiv: undefined,
    checkoutOverlay: undefined,
    checkoutProductNameDiv: undefined,
    confirmationButtonDiv: undefined,
    obscuredOverlay: undefined,
    brokeOverlay: undefined,
    thanksOverlay: undefined,
    balance: undefined,
    balanceDiv: undefined,

    //Given an array of products, it makes them of the Product class and insert each inside the catalogProducts array
    init(rawProductArray, productDivClass, filtersDivClass, checkoutOverlayClass, checkoutProductNameDivClass, confirmationButtonDivClass, obscuredOverlayClass, brokeOverlayClass, thanksOverlayClass, balance, balanceDivClass){
        let temp = []
        rawProductArray.forEach(element => {
            const p = new Product(element)
            temp.push(p)
        });
        this.catalogProducts = temp;
        this.productDiv = document.querySelector(productDivClass);
        this.filtersDiv = document.querySelector(filtersDivClass);
        this.checkoutOverlay = document.querySelector(checkoutOverlayClass);
        this.checkoutProductNameDiv = document.querySelector(checkoutProductNameDivClass);
        this.confirmationButtonDiv = document.querySelector(confirmationButtonDivClass);
        this.obscuredOverlay = document.querySelector(obscuredOverlayClass);
        this.brokeOverlay = document.querySelector(brokeOverlayClass);
        this.thanksOverlay = document.querySelector(thanksOverlayClass);
        this.balance = Number(balance);
        this.balanceDiv = document.querySelector(balanceDivClass);
        this.shopCreator()
        this.filtersCreator()
        this.balanceDiv.innerHTML = balance
    },

    //It takes the element from catalogProducts and for each element creates a HTML tab, then returns a div with all tabs. If given a filter as a string it filters products
    shopCreator(filter = ""){
        let catalogShopHTML = "";
        this.catalogProducts.forEach(element =>{
            if (!filter && element.active){
                catalogShopHTML += element.productHTML
            }
            if (filter && element.category.includes(filter) && element.active){
                catalogShopHTML += element.productHTML
            }
        })
        this.productDiv.innerHTML = catalogShopHTML
    },

    //It takes the element from catalogProducts and for each category of each element creates a HTML button, then returns a div with all buttons.
    //If given a string of a filter it will create that button with the active class and with the true parameter in the onclick function 
    filtersCreator(activeButton=""){
        let catalogFiltersHTML = "";
        let filtersArray = [];
        this.catalogProducts.forEach(element =>{
            element.category.forEach(filter =>{
                if (!filtersArray.includes(filter) && element.active){
                    filtersArray.push(filter)
                }
            })
        })
        filtersArray.forEach(filter =>{
            let button = `
            <button class="filter-button js-${filter}-button" onclick="catalog.filterButtonFunction('${filter}')">${filter}</button>`
            if (activeButton === filter){
                button = `
                <button class="filter-button js-${filter}-button filter-button-active" onclick="catalog.filterButtonFunction('${filter}', true)">${filter}</button>`
            }   
            catalogFiltersHTML += button
        })
        this.filtersDiv.innerHTML = catalogFiltersHTML
    },

    //It creates a shop based on the filter string given. If also given true it deactivate the filter button and restores the default shop
    filterButtonFunction(filter, active=false){
        if (!active){
            this.shopCreator(filter)
            this.filtersCreator(filter)
        }
        else{
            this.shopCreator()
            this.filtersCreator()
        }
    },
    
    buyButton(productId){
        const product = this.catalogProducts.find(product => product.id === productId);
        this.checkoutProductNameDiv.innerHTML = product.name;
        this.obscuredOverlay.classList.remove("hidden");
        this.checkoutOverlay.classList.remove("hidden");
        this.confirmationButtonDiv.innerHTML = `
            <button class="confirm-buttons" onclick="catalog.confirmationButtonFunction(true, ${product.cost})">Si</button>
            <button class="confirm-buttons" onclick="catalog.confirmationButtonFunction(false)">No</button>
        `;
    },


    youBroke(cost){
        if (cost > this.balance){return true}
    },

    confirmationButtonFunction(youSure, cost=0){
        this.checkoutOverlay.classList.add("hidden");
        if (!youSure){
            this.obscuredOverlay.classList.add("hidden")
            return
        }
        if (this.youBroke(cost)){
            this.brokeOverlay.classList.remove("hidden")
            setTimeout(()=>{
                this.brokeOverlay.classList.add("hidden")
                this.obscuredOverlay.classList.add("hidden")
            },2000)
            return
        }
        this.thanksOverlay.classList.remove("hidden")
        setTimeout(()=>{
            this.thanksOverlay.classList.add("hidden")
            this.obscuredOverlay.classList.add("hidden")
        },1000)
        this.balance -= cost
        this.balanceDiv.innerHTML = this.balance
        }

}

class Product {
    constructor({id, name, cost, description, rarity, repeatable, image, category, active} ){
        this.id = Number(id);
        this.name = name;
        this.cost = Number(cost);
        this.description = description;
        this.rarity = rarity;
        this.repeatable = Boolean(repeatable);
        this.image = image;
        this.category = category;
        this.active = Boolean(active);

        this.productHTML = `
            <div class="items">
                <p class="item-photo"> ${this.image}</p>
                <div class="item-text">
                    <div class="item-name-rarity">
                        <p class="item-name">${this.name}</p>
                    </div>
                    <p class="item-desc"> ${this.description}</p>
                </div>
                <button class="item-price js-${this.id}-price">${this.cost}pt</button>
                <button class="item-buy js-${this.id}-buy" onclick="catalog.buyButton(${this.id})">Compra</button>
            </div>`;
    }

}
