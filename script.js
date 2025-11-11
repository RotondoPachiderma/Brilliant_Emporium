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
    }

    toHTML(shopName){
        return `
            <div class="items">
                <p class="item-photo"> ${this.image}</p>
                <div class="item-text">
                    <div class="item-name-rarity">
                        <p class="item-name">${this.name}</p>
                    </div>
                    <p class="item-desc"> ${this.description}</p>
                </div>
                <button class="item-price js-${this.id}-price">${this.cost}pt</button>
                <button class="item-buy js-${this.id}-buy" onclick="${shopName}.buyButton(${this.id})">Compra</button>
            </div>`;
    }

};


class Shop {
    constructor(name, rawProductArray, balance, shopWrapperClass){
        this.name = name
        window[this.name] = this;
        this.balance = Number(balance);

        let temp = []
        rawProductArray.forEach(element => {
            const p = new Product(element)
            temp.push(p)
        });
        this.catalogProducts = temp;

        this.shopWrapperDiv = document.querySelector(shopWrapperClass);

        this.ShopHTML = `
        <div class="sections-wrapper">
            <div class="side">
                <div class="user-section">
                    <p>Player:Piccola</p>
                    <p>Points:<span class="balance"></span></p>
                </div>
                <div class="filters-section">
                    <p style="justify-self: center; height: auto; margin: 0px;">FILTRI</p>
                    <div class="filters-wrapper"></div>
                </div>
            </div>
            <div class="products-wrapper"></div>
        </div>

        <div class="obscured-overlay hidden"></div>

        <div class="checkout-overlay hidden">
            <p class="confirmation-text">Sicura di voler procedere con l'acquisto di <u class="checkout-product-name"></u>?</p>
            <div class="confirm-buttons-wrapper"></div>
        </div>

        <p class="thanks hidden">La ringraziamo per l'acquisto </p>
        <p class="broke hidden">Temo lei sia una poveraccia, non se lo puo' permettere </p>
        `

        this.shopWrapperDiv.innerHTML = this.ShopHTML

        this.productsWrapper = this.shopWrapperDiv.querySelector(".products-wrapper");
        this.filtersWrapper = this.shopWrapperDiv.querySelector(".filters-wrapper");
        this.checkoutOverlay = this.shopWrapperDiv.querySelector(".checkout-overlay");
        this.checkoutProductNameDiv = this.shopWrapperDiv.querySelector(".checkout-product-name");
        this.confirmationButtonWrapper = this.shopWrapperDiv.querySelector(".confirm-buttons-wrapper");
        this.obscuredOverlay = this.shopWrapperDiv.querySelector(".obscured-overlay");
        this.brokeOverlay = this.shopWrapperDiv.querySelector(".broke");
        this.thanksOverlay = this.shopWrapperDiv.querySelector(".thanks");
        this.balanceDiv = this.shopWrapperDiv.querySelector(".balance");

        this.shopCreator()
        this.filtersCreator()
        this.balanceDiv.innerHTML = this.balance
    };

    //It takes the element from catalogProducts and for each element creates a HTML tab, then returns a div with all tabs. If given a filter as a string it filters products
    shopCreator(filter = ""){
        let catalogShopHTML = "";
        this.catalogProducts.forEach(element =>{
            if (!filter && element.active){
                catalogShopHTML += element.toHTML(this.name)
            }
            if (filter && element.category.includes(filter) && element.active){
                catalogShopHTML += element.toHTML(this.name)
            }
        })
        this.productsWrapper.innerHTML = catalogShopHTML
    };

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
            <button class="filter-button js-${filter}-button" onclick="${this.name}.filterButtonFunction('${filter}')">${filter}</button>`
            if (activeButton === filter){
                button = `
                <button class="filter-button js-${filter}-button filter-button-active" onclick="${this.name}.filterButtonFunction('${filter}', true)">${filter}</button>`
            }   
            catalogFiltersHTML += button
        })
        this.filtersWrapper.innerHTML = catalogFiltersHTML
    };

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
    };

    buyButton(productId){
        const product = this.catalogProducts.find(product => product.id === productId);
        this.checkoutProductNameDiv.innerHTML = product.name;
        this.obscuredOverlay.classList.remove("hidden");
        this.checkoutOverlay.classList.remove("hidden");
        this.confirmationButtonWrapper.innerHTML = `
            <button class="confirm-buttons" onclick="${this.name}.confirmationButtonFunction(true, ${product.cost})">Si</button>
            <button class="confirm-buttons" onclick="${this.name}.confirmationButtonFunction(false)">No</button>
        `;
    };

    #youBroke(cost){
        if (cost > this.balance){return true}
    };

    confirmationButtonFunction(youSure, cost=0){
        this.checkoutOverlay.classList.add("hidden");
        if (!youSure){
            this.obscuredOverlay.classList.add("hidden")
            return
        }
        if (this.#youBroke(cost)){
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