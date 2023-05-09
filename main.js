const pokemonContainer = document.querySelector(".pokemon-container");
const button = document.querySelector(".loadMore");
const circle = document.querySelector('.circle');
const tekst = document.querySelector('.tekst');
const poleSearch = document.querySelector('.pole-search');

let url = "https://pokeapi.co/api/v2/pokemon/";
const pokemony = [];

const getPokemons = async () => {
    const request = await fetch(url);
    return await request.json();
};

const fetchPokemons = async () => {
    const pokemons = await getPokemons();

    url = pokemons.next;
    
    for (const pokemon of pokemons.results) {
        const res = await fetch(pokemon.url);
        const data = await res.json();

        pokemony.push(data);

        createPokemon(data);
    }
};

function createPokemon(pokemon) {

    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    
    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("img-container");
    
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.front_default;
    
    spriteContainer.appendChild(sprite);
    
    const name = document.createElement("p");
    name.classList.add("name-of-pokemon");
    name.textContent = pokemon.name;
    
    spriteContainer.appendChild(name);
    
    card.appendChild(spriteContainer);
    pokemonContainer.appendChild(card);

}

fetchPokemons();

const loadMore = async () => {
    button.disabled = true;
    const res = await fetch(url);
    const data = await res.json();

    url = data.next;
    
    for (pokemon of data.results) {
        const res = await fetch(pokemon.url);
        const data = await res.json();

        pokemony.push(data);

        createPokemon(data);
        
    }

    button.classList.remove('loadMoreActive');

    circle.classList.remove('loading');
    tekst.style.display = 'inline'
    button.disabled = false;
};

button.addEventListener('click', async () => {
        button.classList.add('loadMoreActive');
        tekst.style.display = 'none';
        circle.classList.add('loading');

        await loadMore();

        poleSearch.dispatchEvent(new Event('input'));
        }
    );

poleSearch.addEventListener('input', e => {
    const value = e.target.value

    const filtrowanie = pokemony.filter(pokemon => pokemon.name.toLowerCase().includes(value));
    pokemonContainer.innerHTML = '';
    filtrowanie.forEach(pokemon => {
        createPokemon(pokemon);
    })

    if(filtrowanie.length === 0) {
        pokemonContainer.classList.remove('pokemon-container');
        const emptySearchContainer = document.createElement('div');
        emptySearchContainer.classList.add('empty-search-container');
        pokemonContainer.appendChild(emptySearchContainer);
        const emptySearchAlert = document.createElement('span');
        emptySearchAlert.textContent = 'Pokemon o tej nazwie nie istnieje, spróbuj ponownie :)';
        emptySearchAlert.classList.add('empty-search-alert');
        emptySearchContainer.appendChild(emptySearchAlert);
    } else {
        pokemonContainer.classList.add('pokemon-container');
    }
})


