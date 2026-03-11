const express = require('express');
const app = express();
const port = 8080;

app.get('/pokemon/:name.html', async (req, res) => {
  const pokemonName = req.params.name.toLowerCase();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Pokémon no encontrado</title></head>
            <body>
              <main>
                <div>
                  <p>Pokémon no encontrado en la Pokedex.</p>
                </div>
              </main>
            </body>
          </html>
        `);
      }
      throw new Error('Error fetch PokeAPI');
    }

    const pokemon = await response.json();
    
    const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${pokemon.name.toUpperCase()} - Pokedex BYOM</title>
        <meta property="og:title" content="${pokemon.name.toUpperCase()} - Pokedex BYOM">
        <meta name="description" content="Información de ${pokemon.name}">
      </head>
      <body>
        <header></header>
        <main>
          <div>
            <div class="hero">
              <div>
                <div>
                  <picture>
                    <img loading="eager" alt="Imagen de ${pokemon.name}" src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}">
                  </picture>
                  <h1 id="${pokemon.name}">${pokemon.name.toUpperCase()}</h1>
                  <p><strong>Nº de Pokedex:</strong> #${pokemon.id}</p>
                </div>
              </div>
            </div>
            
            <div class="cards">
              <div>
                <div>
                  <h2 id="stats">Estadísticas Base</h2>
                  <ul>
                    ${pokemon.stats.map(stat => `<li><strong>${stat.stat.name.toUpperCase()}:</strong> ${stat.base_stat}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <h2 id="tipos">Tipos</h2>
                  <ul>
                    ${pokemon.types.map(typeInfo => `<li>${typeInfo.type.name.toUpperCase()}</li>`).join('')}
                  </ul>
                  <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                  <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer></footer>
      </body>
    </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor BYOM');
  }
});

app.listen(port, () => {
  console.log(`BYOM PoC Server running at http://localhost:${port}`);
  console.log(`Endpoint de prueba: http://localhost:${port}/pokemon/pikachu.html`);
});
