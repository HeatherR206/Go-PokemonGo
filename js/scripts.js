let pokemonRepository = (function () { 
      
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
      types: ['normal']
    }
  ];
  
  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  return {
    add: add,
    getAll: getAll
  };

})(); 
console.log(pokemonRepository.getAll());
pokemonRepository.add({ name: 'Pikachu' });

let allPokemon = pokemonRepository.getAll();

function listPokemonAndProperties(pokemon) {
  pokemon.forEach(pokemon => {
    const pokemonProperties = Object.entries(pokemon);

    pokemonProperties.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('---------------------');
  });
}
listPokemonAndProperties(allPokemon)
