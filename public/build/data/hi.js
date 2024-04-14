// async function getAllPokemonNames() {
//   try {
//       const response = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1024');
//       const data = await response.json();
//       const pokemonNames = data.results.map(pokemon => pokemon.name);
//       return pokemonNames;
//   } catch (error) {
//       console.error('Error fetching Pokémon names:', error);
//       return [];
//   }
// }

// let allPokemonNames = [];

// (async () => {
//   allPokemonNames = await getAllPokemonNames();
//   allPokemonNames.forEach(x => allPokemonNames.push(x));
//   console.log(allPokemonNames);
// })();

