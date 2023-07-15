const cuerpo_tabla = document.querySelector('tbody');

// Función que obtiene los datos de la API
const obtener_Datos = async (url) => {
	const respuesta = await fetch(url);
	const datos = await respuesta.json();
	return datos.results;
};

// Función que imprime los datos en el DOM
const pintar_Fila = (personaje,contenedor,imagen2) => {
	let fila = document.createElement('tr');
	fila.setAttribute('id', personaje.id);
	fila.innerHTML = `
    ${
		imagen2
			? `
            <td class="ch-name">${personaje.name}</td>
            <td class="ch-caracteristics">
                ${
					personaje.status == 'Alive'
						? '<i class="green-dot"></i>'
						: personaje.status == 'Dead'
						? '<i class="red-dot"></i>'
						: '<i class="grey-dot"></i>'
				}
                • ${personaje.species} • ${personaje.gender} • ${
					personaje.origin.name
			  } • ${personaje.location.name}
            </td>
                <td class="ch-images">
                    <img src="${personaje.image}" alt="${personaje.name}">
                    <img src="${imagen2}" alt="${personaje.name}">
                </td>
    `
			: ''
	}`;
contenedor.appendChild(fila);
	if (imagen2) return true;
	else return false;
};

// Obtener imagen del personaje con el mismo nombre pero que no sea el mismo personaje (si existe) y buscar la imagen desde el personaje actual por id
const buscar_Imagen_Personaje = (personaje, datos) => {
	const imagen_Personaje = datos.find((personaje2) => {
		const nombre_Personaje = personaje2.name.toLowerCase();
		const buscar_Nombre = personaje.name.toLowerCase();
		return (
			nombre_Personaje != buscar_Nombre &&
			nombre_Personaje.includes(buscar_Nombre.split(' ')[0]) &&
			personaje.species == personaje2.species &&
			personaje.gender == personaje2.gender
		);
	});
	return imagen_Personaje ? imagen_Personaje.image : false;
};

// Obtener datos de la API de forma asíncrona
const obtener_fech = async () => {
	const results = [];
	for (let page = 1; page <= 42; page++) {
		const url = `https://rickandmortyapi.com/api/character?page=${page}`;
		const datos = await obtener_Datos(url);
		results.push(...datos);
	}
	return results;
};

// Obtener un número aleatorio entre 0 y el número máximo de personajes
const obtenerIndiceAleatorio = (max, indixesUsados) => {
	let indiceRamdon = Math.floor(Math.random() * max);

	while (indixesUsados.includes(indiceRamdon))
		indiceRamdon = Math.floor(Math.random() * max);
	return indiceRamdon;
};

// Imprimir la tabla con los datos obtenidos
obtener_fech() //results
	.then((vectorCaracteres) => {
		// Data pero renderizando aleatoriamente
		console.log(vectorCaracteres);
		const indixesUsados = [];
		let filaImpresa = false;
		for (let i = 0; i < 10; filaImpresa ? i++ : i) {
			const indiceRamdon = obtenerIndiceAleatorio(
				vectorCaracteres.length,
				indixesUsados
			);
			const character = vectorCaracteres[indiceRamdon];
			const imagen_Personaje = buscar_Imagen_Personaje(
				character,
				vectorCaracteres
			);
			filaImpresa = pintar_Fila(character, cuerpo_tabla, imagen_Personaje);
			console.log(filaImpresa)
			indixesUsados.push(indiceRamdon);
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
