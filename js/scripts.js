let pokemonRepository = (function () {  // IIFE function block
      
  let pokemonList= [
    {
      name: 'Bulbasaur',
      height: 2,
      abilities: ['overgrow'],
      types: ['grass', 'poison'] 
    },

    {
      name: 'Charmander',
      height: 2,
      abilities: ['blaze'],
      types: ['fire']
    },

    {
      name: 'Squirtle',
      height: 1.7,
      abilities: ['torrent'],
      types: ['water']
    },

    {
      name: 'Gyarados',
      height: 21.3,
      abilities: ['intimidate'],
      types: ['water', 'flying']
    },

    { name: 'Eevee',
      height: 1,
      abilities: ['run away', 'adaptability'],
      types: ['normal'],
    }
  ];
  
  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) { 
    let pokemonList = document.querySelector('.pokemon-list'); // generate unordered list of pokemon objects
    let listPokemon = document.createElement('li'); // create a new list item (<li>) for each pokemon
    let button = document.createElement('button'); // create a button for each pokemon in the list
    button.innerText = pokemon.name; // set the button's innerText to pokemon's name 
    button.classList.add('button-class'); // add a class 'pokemon-name' to the button 
    listPokemon.appendChild(button); // append the button to list item
    pokemonList.appendChild(listPokemon); // append the list item to the (<ul>) in HTML
  }  

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem
  };
    
})();

console.log(pokemonRepository.getAll());

pokemonRepository.add({ 
  name: 'Pikachu',
  height: 1.3,
  abilities: ['static'],
  types: ['electric'],

});

console.log(pokemonRepository.getAll());  

pokemonRepository.getAll().forEach(function (pokemon) { 
  pokemonRepository.addListItem(pokemon); // IIFE variable calls 'addListItem' fn
});