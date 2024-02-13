let shopData ={}
let selectedColor, selectedModel, selectedStorage ,trimSelectedModel

window.onload = () => {
    fetchProducts("./iphone-15.json")
    .then(productData=>{
        shopData = productData
        renderingShop(productData)
    })
    //若找到錯誤資料會跳提示
    .catch((err)=>{
        alert(`error:${err}`)
    })
}

function fetchProducts(url){
    return fetch(url).then((Response)=>Response.json())
}

function renderingShop(shop){
    const minPrice = Math.min(...shop.specifications.map(spec=>spec.price))
    const title = shop.title

    document.querySelector(".shop-content .title-area").innerHTML =
    `<h1 style="font-weight: 1000;">
        ${title}
    </h1>
    <div class="total-price" id="minPrice">
        Starting Price From:${minPrice}
    </div>`
    const defaultImages = Object.values(shop.images['iPhone 15']).reduce((acc,cur)=>{
        return acc.concat(cur)
    },[])

    createCarousel(defaultImages)
    
    let widgetHTML=''
    shop.widgets.forEach(widget=>{
        widgetHTML += createWidgetHTML(widget)
    })
    document.querySelector(".spec-widget").innerHTML = widgetHTML
}

function createWidgetHTML(widget){

    const items = getWidgetItem(widget.type)
    let itemHTMLs = ''
    items.forEach(item=>{
        if(widget.type==='color'){
            const theColorImg = shopData.colors.find(c=>c.colorCode===item)
            itemHTMLs +=
            `<div class="col">
                <div class="colorOpt ${item} border border-secondary-subtle rounded-3 p-3 text-center" role="button" onclick="clickHandler(this,'${widget.type}')" data-color="${item}">
                    <img class="w-100" src="${theColorImg.colorImg}"
                alt="${item}"></div>
            </div>`

        } else if(widget.type==='model'){
            itemHTMLs +=    
            `<div class="col">
                <div class="model border border-secondary-subtle rounded-3 p-4" role="button" onclick="clickHandler(this,'${widget.type}')" data-model="${item}">${item}</div>
            </div>
            `
        } else if(widget.type==='storage'){
            itemHTMLs+=
            `<div class="storage ${item} border border-secondary-subtle rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')" data-storage="${item}">
                <div class="storage-spec">${item}</div>
                <div class="price" id="${item}"></div>
            </div>`
        } 
        else{
            itemHTMLs+=
            `<div class="col-">
                <div class="border border-3 rounded-3 p-4" role="button">${item}</div>
            </div>`
        }
    })
    
    const HTML =`
    <section class="widget-item mb-4 mx-lg-3">
    <h2 class="fs-5 fw-bold">${widget.title}<span class="text-black-50">${widget.subTitle}</span></h2>
    ${widget.type === 'color' ? '<div id="color">Color - </div>' : ''}
        <div class="row row-cols-${widget.col} gy-3">
            ${itemHTMLs}
        </div>
    </section>`

    return HTML
}

function getWidgetItem(type){
    return new Set(shopData.specifications.map(spec=>spec[type]))
}

function createCarousel(images){
    const imgArea = document.querySelector(".main-img-area")
    
    const carouselIndicatorHTML = createCarouselIndicatorsHTML(images)

    const carouselInnerHTML = createCarouselHTML(images)
    
    imgArea.innerHTML=
    `<div id="carouselExampleAutoplaying" class="carousel slide  sticky-top" data-bs-ride="carousel">
        <div class="carousel-indicators">
            ${carouselIndicatorHTML}
        </div>
        <div class="carousel-inner">
            ${carouselInnerHTML}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>`
}

function createCarouselIndicatorsHTML(images) {
    //     let html = `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0"
    //     class="active" aria-current="true" aria-label="Slide 1"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1"
    //     aria-label="Slide 2"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2"
    //     aria-label="Slide 3"></button>`
    let html = "";
    images.forEach((img, idx) => {
    html += `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="${idx}"
        class="${
        idx === 0 ? "active" : ""
        }" aria-current="true" aria-label="Slide ${idx + 1}"></button>`;
    });
    return html;
}

function createCarouselHTML(images) {
    //     let html = `<div class="carousel-item active">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV1.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV2.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>`
    let html = "";
    images.forEach((img, idx) => {
    html += `<div class="carousel-item ${idx === 0 ? "active" : ""}">
                        <img src="${img}" class="d-block w-100" alt="...">
                    </div>`;
    });
    return html;
}

function changeMinPrice(){
    const selectedSpec = shopData.specifications.filter(spec => spec.model === selectedModel);
    const minPrice = Math.min(...selectedSpec.map(spec => spec.price))
    document.getElementById("minPrice").innerHTML=`Starting Price From: NT$${minPrice}`
}

function changeColorTitle(){
    document.getElementById("color").innerHTML = `Color - ${selectedColor}`
}

function changeStoragePrice(){
    const selectedSpec = shopData.specifications.filter(spec => spec.model === selectedModel);
    const spec128 = selectedSpec.find(spec => spec.storage==="128GB").price.toLocaleString()
    document.getElementById("128GB").innerHTML = `From NT$ ${spec128}`
    const spec256 = selectedSpec.find(spec => spec.storage==="256GB").price.toLocaleString()
    document.getElementById("256GB").innerHTML = `From NT$ ${spec256}`
    const spec512 = selectedSpec.find(spec => spec.storage==="512GB").price.toLocaleString()
    document.getElementById("512GB").innerHTML = `From NT$ ${spec512}`
}

function clickHandler(element, type){

    if(type === 'color' && selectedModel){
        selectedColor = element.dataset[type]
        createCarousel(shopData.images[selectedModel][selectedColor])
        changeColorTitle()
    } else if(type === 'color' && selectedModel === undefined){
        selectedColor = element.dataset[type]
        createCarousel(shopData.images['iPhone 15'][selectedColor])
        changeColorTitle()

    } else if(type === 'model' && selectedColor){
        selectedModel = element.dataset[type]
        createCarousel(shopData.images[selectedModel][selectedColor])
        changeMinPrice()
        changeStoragePrice()
    } else if(type === 'model' && selectedColor === undefined){
        selectedModel = element.dataset[type]
        createCarousel(shopData.images[selectedModel].blue)
        changeMinPrice()
        changeStoragePrice()
    } else if(type === 'storage'){
        selectedStorage = element.dataset[type]
    }
    document.querySelectorAll('.model').forEach(col=>{
        col.classList.remove('border-primary','border-3', 'border-secondary-subtle')
        if(col.innerText === selectedModel){
            col.classList.add('border-primary','border-3')
        } else{
            col.classList.add('border-secondary-subtle')
        }
    })

    document.querySelectorAll('.colorOpt').forEach(col=>{
        col.classList.remove('border-primary','border-3', 'border-secondary-subtle')
        if(col.classList.contains(selectedColor)){
            col.classList.add('border-primary','border-3')
        } else{
            col.classList.add('border-secondary-subtle')
        }
    })

    document.querySelectorAll('.storage').forEach(col=>{
        col.classList.remove('border-primary','border-3', 'border-secondary-subtle')
        if(col.classList.contains(selectedStorage)){
            col.classList.add('border-primary','border-3')
        } else{
            col.classList.add('border-secondary-subtle')
        }
    })

    getSummary()
}

function getSummary(){
        if(selectedColor && selectedModel && selectedStorage){
            const spec = shopData.specifications.find(spec=>spec.color === selectedColor && spec.model === selectedModel && selectedStorage === spec.storage)
            
            const price = spec.price.toLocaleString()
            document.querySelector('.summary-area .product-item').innerHTML =
            `<div class="title">${selectedModel} ${selectedStorage} ${selectedColor}</div>
            <div class="price fw-bold">NT$${price}</div>`
        }
    }