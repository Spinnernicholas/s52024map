const fs = require('fs');

// Function to load JSON file into an object
function loadJsonFile(filePath) {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonObject = JSON.parse(data);
		return jsonObject;
	} catch (err) {
		console.error('Error reading or parsing file:', err);
		return null;
	}
}

function saveJsonFile(filePath, jsonObject) {
    try {
        const jsonString = JSON.stringify(jsonObject, null, 2);
        fs.writeFileSync(filePath, jsonString);
    }
    catch (err) {
        console.error('Error writing file:', err);
    }
}

// Example usage
const data = loadJsonFile('public/data/data0.json');
let c0 = data['contests'][0];
let c1 = data['contests'][1];
let s = {
    "index": 2,
    "id": "10008",
    "label": "11/08/2024 New Votes",
    "voteFor": 1,
    "choices": c1.choices,
    "precincts": {}
};

/*
Precinct Record:
"ALHA101": {
    "label": "ALHA101",
    "total": 24,
    "winner": 0,
    "results": [
    14,
    10
    ],
    "percentage": [
    0.5833,
    0.4167
    ],
    "registeredVoters": 67,
    "totalVoters": 27
}
*/
for (const [key, value] of Object.entries(c1.precincts)) {
    const c0Value = c0.precincts[key];
    const total = value.total - c0Value.total;
    const totalVoters = value.totalVoters - c0Value.totalVoters;
    const registeredVoters = value.registeredVoters;

    let newResults;
    let winner;
    let percentage;
    if(value.results !== undefined && c0Value.results !== undefined)
    {
        newResults = value.results.map((result, index) => result - c0Value.results[index]);
        winner = newResults.indexOf(Math.max(...newResults));
        percentage = newResults.map(result => result / total);
    }

    s.precincts[key] = {
        label: value.label,
        total: total,
        winner: winner,
        results: newResults,
        percentage: percentage,
        registeredVoters: registeredVoters,
        totalVoters: totalVoters
    };
}

data['contests'][2] = s;

saveJsonFile('public/data/data.json', data);