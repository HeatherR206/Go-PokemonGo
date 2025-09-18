let pokemonList = [
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

pokemonList.forEach(function (pokemon){
  //height value greater than 20 designates a special Pokemon
  if (pokemon.height > 20) {
  //<p> used to assign each Pokemon it's own line  
  document.write('<p>',pokemon.name + ' (height: ' + pokemon.height,')' + ' - Wow, that\'s big!</p>');  
  } else {
  document.write('<p>',pokemon.name + ' (height: ' + pokemon.height,')</p>');
  }  
});