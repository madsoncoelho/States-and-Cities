import { promises as fs } from 'fs';

let states = null;
let cities = null;

async function readStates() {
    try {
        states = JSON.parse(await fs.readFile('Estados.json'));
    } catch (error) {
        console.log(error);
    }
}

async function readCities() {
    try {
        cities = JSON.parse(await fs.readFile('Cidades.json'));
    } catch (error) {
        console.log(error);
    }
}

async function fillCities() {
    try {
        await readStates();
        await readCities();
    
        states.forEach(async (state) => {
            const fileName = state.Sigla;
            const stateCities = cities.filter((city) => state.ID === city.Estado);
            
            await fs.writeFile(`./data/${fileName}.json`, JSON.stringify(stateCities, null, ' '));    
        });
    } catch (error) {
        console.log(error);
    }
}

async function getNumberOfCitiesByState(state) {
    try {
        const stateCities = JSON.parse(await fs.readFile(`./data/${state}.json`));
        return stateCities.length;
    }
    catch (error) {
        console.log(error);
    }    
}

async function getNumberOfCities() {
    try {
        const numberOfCities = [];

        for (let i = 0; i < states.length; i++) {
            const numberOfCitiesByState = await getNumberOfCitiesByState(states[i].Sigla);
            numberOfCities.push({sigla: states[i].Sigla, cities: numberOfCitiesByState});
        }

        return numberOfCities;
    } catch (error) {
        console.log(error);
    }
}

async function showStatesWithMoreCities() {
    try {
        let numberOfCities = await getNumberOfCities();
        
        numberOfCities = numberOfCities
            .sort((previous, current) => current.sigla.localeCompare(previous.sigla))
            .sort((previous, current) => current.cities - previous.cities)
            .map((state) => `${state.sigla} - ${state.cities}`)
            .splice(0, 5);
        
        console.log(`Estados com maior número de cidades:\n${numberOfCities}\n`);
    } catch (error) {
        console.log(error);
    }
}

async function showStatesWithLessCities() {
    try {
        let numberOfCities = await getNumberOfCities();

        numberOfCities = numberOfCities
            .sort((previous, current) => current.sigla.localeCompare(previous.sigla))
            .sort((previous, current) => previous.cities - current.cities)
            .map((state) => `${state.sigla} - ${state.cities}`)
            .splice(0, 5);
        
        console.log(`Estados com menor número de cidades:\n${numberOfCities}\n`);
    } catch (error) {
        console.log(error);
    }
}

async function getLargerCityNameByState(state) {
    try {
        const cities = JSON.parse(await fs.readFile(`./data/${state}.json`));
        const largestCityName = cities.map(city => city.Nome)
            .sort((previous, current) => current.length - previous.length);

        return largestCityName[0]; 
    } catch (error) {
        console.log(error);
    }
}

async function showLargerCityNames() {
    try {
        const largestCityNames = [];

        for (let i = 0; i < states.length; i++) {
            const cityName  = await getLargerCityNameByState(states[i].Sigla);
            largestCityNames.push(`${cityName} - ${states[i].Sigla}`);
        }

        console.log('Maior nome de cidade de cada Estado:\n');
        console.log(largestCityNames);
        console.log('\n');
    } catch (error) {
        console.log(error);
    }
}

async function getShorterCityNameByState(state) {
    try {
        const cities = JSON.parse(await fs.readFile(`./data/${state}.json`));
        const shortestCityName = cities.map(city => city.Nome)
            .sort((previous, current) => previous.length - current.length);

        return shortestCityName[0];
    } catch (error) {
        console.log(error);
    }
}

async function showShorterCityNames() {
    try {
        const shortestCityNames = [];

        for (let i = 0; i < states.length; i++) {
            const cityName = await getShorterCityNameByState(states[i].Sigla);
            shortestCityNames.push(`${cityName} - ${states[i].Sigla}`);
        }

        console.log('Menor nome de cidade de cada Estado:\n');
        console.log(shortestCityNames);
        console.log('\n');
    } catch (error) {
        console.log(error);
    }
}

async function showLargestCityName() {
    try {
        const largerCityNames = [];
        
        for (let i = 0; i < states.length; i++) {
            const cityName = await getLargerCityNameByState(states[i].Sigla);
            largerCityNames.push(cityName);
        }

        largerCityNames
            .sort((previous, current) => previous.localeCompare(current))
            .sort((previous, current) => current.length - previous.length);
        
        const largestCityName = largerCityNames[0];
        console.log(`Maior nome de cidade:\n${largestCityName}\n`);
    } catch (error) {
        console.log(error);
    }
}

async function showShortestCityName() {
    try {
        const shorterCityNames = [];

        for (let i = 1; i < states.length; i++) {
            const cityName = await getShorterCityNameByState(states[i].Sigla);
            shorterCityNames.push(cityName);            
        }

        shorterCityNames.sort((previous, current) => previous.localeCompare(current))
            .sort((previous, current) => previous.length - current.length);
        
        const shortestCityName = shorterCityNames[0];
        console.log(`Menor nome de cidade:\n${shortestCityName}\n`);
    } catch (error) {
        console.log(error);
    }
}

async function start() {
    try {
        await fillCities();
        await showStatesWithMoreCities();
        await showStatesWithLessCities();
        await showLargerCityNames();
        await showShorterCityNames();
        await showLargestCityName();
        await showShortestCityName();

    } catch (error) {
        console.log(error);
    }
}

start();
