const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const items = document.querySelector('.items')
let renderer = []
let pokesearch = '';


//make sure the search matches a pokemon name
const verifySearch = res =>{
    for (i = 0; i < res.data.results.length; i++){
        //if it is, then set search to that and break the loop.
        if (searchBox.value.toLowerCase() === res.data.results[i].name){
            pokesearch = res.data.results[i].name;
            break
        }
        //if it's not in the list (or i gets above number of current pokemon)
        //stop the whole function
        if (i === 899){
            alert('That Pokemon does not exist...Please try again.')
            return
        }
    }  
}

//Pokemon factory function that
const PokeFactory = (name, id, exp, height, sprite, types) =>{
    let price = exp.toFixed(2) - .01
    price = `$${String(price)}`
    name = name[0].toUpperCase() + name.substring(1);
    return{
        name,
        id,
        exp,
        height,
        sprite,
        types,
        price
    }
}

//search box Functionality - click listener
searchBtn.addEventListener('click', async () =>{
    //reset the rendered output
    renderer = [];
    //init the search term variable
    pokesearch = '';
    //fetch all 1118 pokemon
    await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1118`)
    .then(res => {
        verifySearch(res)
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokesearch}`)
        .then(res => {
            let name = res.data.name;
            console.log(res.data.name);
            let id = res.data.id;
            console.log(res.data.id);
            let exp = res.data.base_experience;
            console.log(res.data.base_experience);
            let height = res.data.height;
            console.log(res.data.height)
            let sprite = res.data.sprites.front_default;
            console.log(res.data.sprites.front_default);
            let types = []
            for (i = 0; i < res.data.types.length; i ++){
                console.log(res.data.types[i].type.name)
                types.push(res.data.types[i].type.name)
            }       
            const newPoke = PokeFactory(name, id, exp, height, sprite, types);
            console.log(newPoke);
            renderer.push(newPoke);
            // output to UI
            renderPage();
        })
    }) 
    
})


const renderPage = () =>{
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

        let height = document.createElement('span');
        height.classList.add('height')
        height.textContent = `${renderer[i].height} Units Tall`;
        card.appendChild(height);
        items.appendChild(card)
    }   
}