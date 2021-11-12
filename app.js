const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const items = document.querySelector('.items')
const addToCart = document.createElement('button');
let renderer = [];
let pokesearch = [];


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
            alert('That Pokemon does not exist...Please try again.')
            return
        }
    }  
}

//Pokemon factory function that
const PokeFactory = (name, id, exp, sprite, types) =>{
    let price = exp.toFixed(2) - .01
    price = `$${String(price)}`
    name = name[0].toUpperCase() + name.substring(1);
    for(i in types){
        types[i] = types[i][0].toUpperCase() + types[i].substring(1)
    }
    return{
        name,
        id,
        exp,
        sprite,
        types,
        price
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
                console.log(res.data.types[i].type.name)
                types.push(res.data.types[i].type.name)
            }       
            const newPoke = PokeFactory(name, id, exp, sprite, types);
            renderer.push(newPoke);
            // output to UI
            renderPage();
        })
    }
}

//search box Functionality - click listener
searchBtn.addEventListener('click', async () =>{
    //reset the rendered output
    renderer = [];
    //init the search term variable
    pokesearch = [];
    //fetch all 1118 pokemon
    await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1118`)
    .then(res => {
        verifySearch(res)
        pullPokemon();
    }) 
})


const renderPage = () =>{
    items.innerHTML = '';
    for (i = 0; i < renderer.length; i++){
        const card = document.createElement('div');
        card.classList.add('card');

        let namePlate = document.createElement('section');
        namePlate.classList.add('namePlate');

        let name = document.createElement('h1')
        name.textContent = renderer[i].name;
        namePlate.appendChild(name);
        
        let idPlate = document.createElement('h3');
        idPlate.classList.add('idPlate');
        idPlate.textContent = renderer[i].id;
        namePlate.appendChild(idPlate);
        card.appendChild(namePlate);

        let sprite = document.createElement('img');
        sprite.classList.add('sprite');
        sprite.src = renderer[i].sprite;
        card.appendChild(sprite);

        let price = document.createElement('h3');
        price.classList.add('price')
        price.textContent = renderer[i].price;
        card.appendChild(price);

        let typeList = renderer[i].types
        let types = document.createElement('ul');
        types.classList.add('types')

        for (let i = 0; i < typeList.length; i++) {
            let type =  document.createElement('li');
            type.textContent = `${typeList[i]}`;
            types.appendChild(type);
        }

        let type = typeList[0]
        card.appendChild(types);
        if(type=='Normal'){
            card.classList.add('normal-type');
        } else if (type == 'Poison'){
            card.classList.add('poison-type')
        } else if (type == 'Electric'){
            card.classList.add('electric-type')
        } else if (type == 'Psychic'){
            card.classList.add('psychic-type')
        } else if (type == 'Rock'){
            card.classList.add('rock-type')
        } else if (type == 'Steel'){
            card.classList.add('steel-type')
        } else if (type == 'Water'){
            card.classList.add('water-type')
        } else if (type == 'Ice'){
            card.classList.add('ice-type')
        } else if (type == 'Ground'){
            card.classList.add('ground-type')
        } else if (type == 'Grass'){
            card.classList.add('grass-type')
        } else if (type == 'Ghost'){
            card.classList.add('ghost-type')
        } else if (type == 'Flying'){
            card.classList.add('flying-type')
        } else if (type == 'Fire'){
            card.classList.add('fire-type')
        } else if (type == 'Bug'){
            card.classList.add('bug-type')
        } else if (type == 'Dark'){
            card.classList.add('dark-type')
        } else if (type == 'Fairy'){
            card.classList.add('fairy-type')
        } else if (type == 'Fighting'){
            card.classList.add('fighting-type')
        } else if (type == 'Dragon'){
            card.classList.add('dragon-type')
        }

        let button = document.createElement('button')
        button.textContent = 'Add to Cart';
        button.classList.add('addToCartBtn');
        
        card.appendChild(button);
    
        items.appendChild(card)
    }   
}

// const sortById = (array) =>{
//     for (let i = 0; i < array.length; i++){
//         if(array[i+1].id > array[i].id)
//     }
// } 