const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const items = document.querySelector('.items')
const addToCart = document.createElement('button');
const categorySelect = document.querySelector('.changeCategory')
const searchType = document.querySelector('.selectedSearch')
const cartBtn = document.querySelector('.cartBtn');
const mainContainer = document.querySelector('.main-container')

let renderer = [];
let pokesearch = [];
let add = document.querySelectorAll('.addToCartBtn');
let removeBtn;
let page;

function initUserData(){
    if (localStorage.cart === undefined){
        localStorage.setItem('cart', '[]');
    }
}

const checkCart =() =>{
    let cartCount = JSON.parse(localStorage.getItem('cart'))
    let counter = document.querySelector('.cartCount');
    if (cartCount.length > 0){
        console.log(cartCount.length)
        counter.textContent = cartCount.length;
    }
}
window.onload = initUserData();
window.onload = checkCart();

const addToCartBtn = () =>{
    add = document.querySelectorAll('.addToCartBtn');
    for (i of add){
        i.addEventListener('click', async function(){
            let name = this.parentElement.children[0].children[0].textContent; 
            let category = this.parentElement.parentElement.lastChild.textContent
            let sprite = this.parentElement.parentElement.children[0].src;
            const price = await axios.get(`https://pokeapi.co/api/v2/${category}/${name.toLowerCase()}`)
                .then(res => {
                    if(res.data.name === name.toLowerCase()){
                        if (res.data.base_experience){
                            return res.data.base_experience.toFixed(2) - .01
                        } else if (res.data.cost){
                            if (res.data.cost > 0){
                                return res.data.cost.toFixed(2) - .01
                            } else {
                                return 0
                            }
                        }  else {
                            return 0
                        }
                    }
                })

            let newCartItem = CartFactory(sprite, name, price)
            let cart = JSON.parse(localStorage.getItem("cart"));
            cart.push(newCartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            checkCart();     
        })
    }
}
//make sure the search matches a pokemon name
const verifySearch = res =>{
    if (searchBox.value == ''){
        alert('Please enter a search term')
        return
    }
    for (i = 0; i < res.data.results.length; i++){
        //if it is, then set search to that and break the loop.
        if (String(res.data.results[i].name).includes(String(searchBox.value.toLowerCase()))){
            pokesearch.push(res.data.results[i].name);
        }
        //if it's not in the list (or i gets above number of current pokemon)
        //stop the whole function
        if (i === 899 && pokesearch.length === 0){
            alert('Couldn\'t complet the search...Please try again.');
            return;
        }
    }  
}

//Pokemon factory function that takes the data from the aPI and make sthe pokemon objects
const PokeFactory = (name, id, exp, sprite, types) =>{
    let price = exp.toFixed(2) - .01
    price = `$${String(price)}`
    name = name[0].toUpperCase() + name.substring(1);
    for(i in types){
        types[i] = types[i][0].toUpperCase() + types[i].substring(1);
    }
    category = 'pokemon'
    return{
        name,
        id,
        exp,
        sprite,
        types,
        price,
        category
    }
}
//same but for items
const ItemFactory = (name, cost, sprite, text) =>{
    let price
    if (cost > 0){
        price = cost.toFixed(2) - .01
        price = `$${String(price)}`
    } else {
        price = 'Free!'
    }
    category = 'item'
    name = name[0].toUpperCase() + name.substring(1);
    return{
        name,
        sprite,
        price,
        text,
        category
    }
}

//Takes verified search and makes pokemon via pokefactory function. Renders them to the page.
const pullPokemon = ()=>{
    for (let i = 0; i < pokesearch.length; i++) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokesearch[i]}`)
        .then(res => {
            let name = res.data.name;
            let id = res.data.id;
            let exp = res.data.base_experience;
            let sprite = res.data.sprites.front_default;
            let types = []
            for (i = 0; i < res.data.types.length; i ++){
                types.push(res.data.types[i].type.name)
            }       
            const newPoke = PokeFactory(name, id, exp, sprite, types);
            renderer.push(newPoke);
            // output to UI
            if(renderer.length == pokesearch.length){
                renderPage();
            }
        })

    }
}

//same but for items
const pullItems = ()=>{
    for (let i = 0; i < pokesearch.length; i++) {
        axios.get(`https://pokeapi.co/api/v2/item/${pokesearch[i]}`)
        .then(res => {
            let name = res.data.name;
            let cost = res.data.cost;
            let sprite = res.data.sprites.default; 
            let text = res.data.flavor_text_entries[0].text   
            const newItem = ItemFactory(name, cost, sprite, text);
            renderer.push(newItem);
            // output to UI
            renderPage();
        })
    }
}

const search = async()=>{
    //reset the rendered output
    renderer = [];
    //init the search term variable
    pokesearch = [];
    //fetch all 1118 pokemon
    if (searchType.dataset.value === 'pokemon'){
        await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1118`)
        .then(res => {
            verifySearch(res)
            pullPokemon();
            console.log(renderer)
        }) 
    } else if (searchType.dataset.value === 'items'){
        await axios.get(`https://pokeapi.co/api/v2/item/?limit=954`)
        .then(res => {
            verifySearch(res)
            pullItems();
        }) 
    }
}
//search box Functionality - click listener
searchBtn.addEventListener('click', search)
searchBox.addEventListener('keypress', (e)=> {
    if (e.key === 'Enter'){
        search();
    }
})

//the BIG one that puts the search results on the page
const renderPage = () =>{
    console.log(renderer)
    items.innerHTML = '';
    page = 1
    if (searchType.dataset.value === 'pokemon'){
        renderer.sort( compareId );
        for (i = 0; i < renderer.length; i++){
            const card = document.createElement('div');
            card.classList.add('card');

            let sprite = document.createElement('img');
            sprite.classList.add('sprite');
            sprite.src = renderer[i].sprite;
            card.appendChild(sprite);

            let info = document.createElement('div');
            info.classList.add('info');

            let namePlate = document.createElement('section');
            namePlate.classList.add('namePlate');

            let name = document.createElement('h1')
            name.textContent = renderer[i].name;
            namePlate.appendChild(name);
            
            let idPlate = document.createElement('h3');
            idPlate.classList.add('idPlate');
            idPlate.textContent = renderer[i].id;
            namePlate.appendChild(idPlate);
            info.appendChild(namePlate);

            let typeList = renderer[i].types
            let types = document.createElement('ul');
            types.classList.add('types')

            for (let i = 0; i < typeList.length; i++) {
                let type =  document.createElement('li');
                type.textContent = `${typeList[i]}`;
                types.appendChild(type);
            }
            let type = typeList[0]
            info.appendChild(types);

            let price = document.createElement('h3');
            price.classList.add('price')
            price.textContent = renderer[i].price;
            info.appendChild(price);

            if(type=='Normal'){
                sprite.classList.add('normal-type');
            } else if (type == 'Poison'){
                sprite.classList.add('poison-type')
            } else if (type == 'Electric'){
                sprite.classList.add('electric-type')
            } else if (type == 'Psychic'){
                sprite.classList.add('psychic-type')
            } else if (type == 'Rock'){
                sprite.classList.add('rock-type')
            } else if (type == 'Steel'){
                sprite.classList.add('steel-type')
            } else if (type == 'Water'){
                sprite.classList.add('water-type')
            } else if (type == 'Ice'){
                sprite.classList.add('ice-type')
            } else if (type == 'Ground'){
                sprite.classList.add('ground-type')
            } else if (type == 'Grass'){
                sprite.classList.add('grass-type')
            } else if (type == 'Ghost'){
                sprite.classList.add('ghost-type')
            } else if (type == 'Flying'){
                sprite.classList.add('flying-type')
            } else if (type == 'Fire'){
                sprite.classList.add('fire-type')
            } else if (type == 'Bug'){
                sprite.classList.add('bug-type')
            } else if (type == 'Dark'){
                sprite.classList.add('dark-type')
            } else if (type == 'Fairy'){
                sprite.classList.add('fairy-type')
            } else if (type == 'Fighting'){
                sprite.classList.add('fighting-type')
            } else if (type == 'Dragon'){
                sprite.classList.add('dragon-type')
            }

            let button = document.createElement('button')
            button.textContent = 'Add to Cart';
            button.classList.add('addToCartBtn');

            let category = document.createElement('span')
            category.textContent = renderer[i].category
            category.style.display = 'none';

            info.appendChild(button);
            card.appendChild(info);
            card.appendChild(category)
            items.appendChild(card)
        } 
    } else if (searchType.dataset.value === 'items'){
        renderer.sort( compareId );
        for (i = 0; i < renderer.length; i++){
            const card = document.createElement('div');
            card.classList.add('card');

            let sprite = document.createElement('img');
            sprite.classList.add('itemSprite');
            sprite.src = renderer[i].sprite;

            let info = document.createElement('div');
            info.classList.add('itemInfo');

            let namePlate = document.createElement('section');
            namePlate.classList.add('namePlate');
            

            let name = document.createElement('h1')
            name.textContent = renderer[i].name;
            namePlate.appendChild(name);
            info.appendChild(namePlate)

            let flavorText = document.createElement('p')
            flavorText.classList.add('flavorText')
            flavorText.textContent = renderer[i].text;
            info.appendChild(flavorText)

            let price = document.createElement('h3');
            price.classList.add('price')
            price.textContent = renderer[i].price;
            info.appendChild(price);

            let button = document.createElement('button')
            button.textContent = 'Add to Cart';
            button.classList.add('addToCartBtn');

            let category = document.createElement('span')
            category.textContent = renderer[i].category
            category.style.display = 'none';

            info.appendChild(button);
            card.appendChild(sprite);
            card.appendChild(info);
            card.appendChild(category)
            items.appendChild(card)
            
        }
    }
    items.style.display = 'grid';
    addToCartBtn();
}

//selecting between searching pokemon and items
categorySelect.addEventListener('click', ()=> {
    if (categorySelect.dataset.value ==='items'){
        searchType.dataset.value = 'items';
        searchType.src = "./img/potion.png"
        categorySelect.src = "./img/poke-ball.png"
        categorySelect.dataset.value = 'pokemon';
        searchBox.placeholder ="< Item Search..."
    } else if (categorySelect.dataset.value ==='pokemon'){
        searchType.dataset.value = 'pokemon';
        searchType.src = "./img/poke-ball.png"
        categorySelect.src = "./img/potion.png"
        categorySelect.dataset.value = 'items';
        searchBox.placeholder = "< Poke Search..."
    }
})

//makes items for the cart
const CartFactory = (sprite, name, price) =>{
    return{
        sprite,
        name,
        price
    }
}

//TBH i'm not 100% sure how this works. I have an Idea but it doesn't make sense.
const compareId= ( a, b ) =>{
    if ( a.id < b.id ){
      return -1;
    }
    if ( a.id > b.id ){
      return 1;
    }
    return 0;
}

//pushes cart to the dom... still needs some tweeking
const renderCart = () =>{
    renderer = [];
    const cartContent = JSON.parse(localStorage.getItem('cart'));
    for (i = 0; i < cartContent.length; i++){
        renderer.push(cartContent[i]);   
    }
    items.innerHTML = ''
    items.style.display = 'flex';
    items.style.flexDirection = 'column';
    let total = 0;
    let title = document.createElement('h1')
    title.textContent = `You currently have ${renderer.length} Items in your cart!`
    items.appendChild(title)
    for (i = 0; i < renderer.length; i++){
        let sprite = renderer[i].sprite
        let name = renderer[i].name;
        let price = renderer[i].price;
        total += renderer[i].price


        let cartItem = document.createElement('div')
        cartItem.classList.add('cartItem')

        let itemMain = document.createElement('div')
        cartItem.appendChild(itemMain)
        itemMain.classList.add('item-main')

        let cartImg = document.createElement('img')
        cartImg.src = sprite

        let printName = document.createElement('span')
        printName.textContent = name;
        cartItem.appendChild(printName)

        let printPrice = document.createElement('span')
        if (price > 0){
            printPrice.textContent = `$${price}`
        } else {
            printPrice.textContent = 'FREE!'
        }

        let removeItem = document.createElement('span')
        removeItem.dataset.count = i;
        removeItem.classList.add('remove-from-cart')
        removeItem.textContent = '- Remove'
        
        removeItem.addEventListener('click', deleteItem);

        itemMain.appendChild(cartImg)
        itemMain.appendChild(printName)
        itemMain.appendChild(removeItem)
        cartItem.appendChild(printPrice)
        items.appendChild(cartItem)
        

    }

    let summary = document.createElement('div');
    summary.classList.add('order-summary')
    summary.textContent = `Total: $${total.toFixed(2)}`

    let checkOutBtn = document.createElement('button')
    checkOutBtn.classList.add('checkoutBtn')
    checkOutBtn.textContent = 'Checkout'
    items.appendChild(summary);
    summary.appendChild(checkOutBtn);

    
}

cartBtn.addEventListener('click', () =>{
    renderCart();
})



function deleteItem(e){
    let cart = JSON.parse(localStorage.getItem("cart"));
    let index = e.target.dataset.count
    cart.splice(index, 1);
    localStorage.setItem('cart',JSON.stringify(cart))
    renderCart();
    checkCart();
}