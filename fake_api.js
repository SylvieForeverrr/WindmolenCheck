document.addEventListener('DOMContentLoaded', function() {
    let windSlider = document.getElementById("windSlider");
    let windValue = document.getElementById("windValue");
    let tableBody = document.getElementById('data-body');
    let avgRpmDisplay = document.getElementById('avgRpm');
    let avgEnergyDisplay = document.getElementById('avgEnergy');

    let previousData = [
        { rpm: 0, energy: 0 },
        { rpm: 0, energy: 0 },
        { rpm: 0, energy: 0 }
    ];

    let rpmHistory = [];
    let energyHistory = [];

    function updateBackground(windkracht) {
        let body = document.body;
        if (windkracht < 3) body.style.backgroundColor = "#a0d8ff"; // Kalm weer
        else if (windkracht < 7) body.style.backgroundColor = "#ffc107"; // Winderig
        else body.style.backgroundColor = "#dc3545"; // Storm
    }

    windSlider.addEventListener("input", function() {
        windValue.innerText = windSlider.value;
        updateBackground(parseFloat(windSlider.value));
    });

    function calculateAverage(array) {
        let sum = array.reduce((a, b) => a + b, 0);
        return array.length > 0 ? (sum / array.length).toFixed(2) : 0;
    }

    function fetchFakeData() {
        let windkracht = parseFloat(windSlider.value);
        let rpmBase = windkracht * 5;
        let energyBase = windkracht * 20;

        const fakeData = [
            { rpm: Math.floor(rpmBase + Math.random() * 10), energy: Math.floor(energyBase + Math.random() * 50) },
            { rpm: Math.floor(rpmBase + Math.random() * 10), energy: Math.floor(energyBase + Math.random() * 50) },
            { rpm: Math.floor(rpmBase + Math.random() * 10), energy: Math.floor(energyBase + Math.random() * 50) }
        ];

        tableBody.innerHTML = '';
        
        fakeData.forEach((molen, index) => {
            let prevRpm = previousData[index].rpm;
            let prevEnergy = previousData[index].energy;

            let rpmArrow = molen.rpm > prevRpm ? "🔼" : molen.rpm < prevRpm ? "🔽" : "➡";
            let energyArrow = molen.energy > prevEnergy ? "🔼" : molen.energy < prevEnergy ? "🔽" : "➡";

            let row = `<tr>
                <td>Windmolen ${index + 1}</td>
                <td>${molen.rpm} RPM ${rpmArrow}</td>
                <td>${molen.energy} W ${energyArrow}</td>
            </tr>`;
            tableBody.innerHTML += row;

            previousData[index] = { rpm: molen.rpm, energy: molen.energy };
        });

        // Voeg de nieuwe waarden toe aan de geschiedenis
        let totalRpm = fakeData.reduce((sum, molen) => sum + molen.rpm, 0);
        let totalEnergy = fakeData.reduce((sum, molen) => sum + molen.energy, 0);

        rpmHistory.push(totalRpm / fakeData.length);
        energyHistory.push(totalEnergy / fakeData.length);

        if (rpmHistory.length > 10) rpmHistory.shift();  // Beperk tot de laatste 10 metingen
        if (energyHistory.length > 10) energyHistory.shift();

        avgRpmDisplay.innerText = calculateAverage(rpmHistory);
        avgEnergyDisplay.innerText = calculateAverage(energyHistory);
    }

    setInterval(fetchFakeData, 2000);
    fetchFakeData();
});
