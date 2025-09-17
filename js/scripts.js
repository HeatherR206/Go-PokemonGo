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
function listPokemonAndProperties(pokemon) {
  pokemon.forEach(pokemon => {
    const pokemonProperties = Object.entries(pokemon);

    pokemonProperties.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('---------------------');
  });
}
listPokemonAndProperties(pokemonList);
