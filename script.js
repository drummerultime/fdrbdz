let map;
let marker;

document.getElementById('numBands').addEventListener('change', function() {
    updateBands();
});

function initMap() {
    map = L.map('map').setView([45.5646, 5.9203], 13); // Coordonnées approximatives de Barberaz

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function updateBands() {
    const numBands = document.getElementById('numBands').value;
    const bandsContainer = document.getElementById('bandsContainer');
    bandsContainer.innerHTML = '';

    for (let i = 0; i < numBands; i++) {
        addBand();
    }
    updateConcertEndTime();
}

function addBand() {
    const bandsContainer = document.getElementById('bandsContainer');
    const bandDiv = document.createElement('div');
    bandDiv.classList.add('band');

    const deleteBandButton = document.createElement('button');
    deleteBandButton.classList.add('delete-button', 'delete-band-button');
    deleteBandButton.textContent = 'Supprimer le groupe';
    deleteBandButton.addEventListener('click', function() {
        bandDiv.remove();
        updateNumBands();
        updateConcertEndTime();
    });

    const bandNameLabel = document.createElement('label');
    bandNameLabel.textContent = `Nom du groupe:`;
    const bandNameInput = document.createElement('input');
    bandNameInput.type = 'text';
    bandNameInput.required = true;

    const concertDurationLabel = document.createElement('label');
    concertDurationLabel.textContent = `Durée du concert (minutes):`;
    const concertDurationInput = document.createElement('input');
    concertDurationInput.type = 'number';
    concertDurationInput.min = '1';
    concertDurationInput.required = true;
    concertDurationInput.addEventListener('input', updateConcertEndTime);

    const changeoverTimeLabel = document.createElement('label');
    changeoverTimeLabel.textContent = `Durée de changement de plateau (minutes):`;
    const changeoverTimeInput = document.createElement('input');
    changeoverTimeInput.type = 'number';
    changeoverTimeInput.min = '1';
    changeoverTimeInput.required = true;
    changeoverTimeInput.addEventListener('input', updateConcertEndTime);

    bandDiv.appendChild(deleteBandButton);
    bandDiv.appendChild(bandNameLabel);
    bandDiv.appendChild(bandNameInput);
    bandDiv.appendChild(concertDurationLabel);
    bandDiv.appendChild(concertDurationInput);
    bandDiv.appendChild(changeoverTimeLabel);
    bandDiv.appendChild(changeoverTimeInput);

    bandsContainer.appendChild(bandDiv);
    updateNumBands();
}

function updateNumBands() {
    const numBands = document.querySelectorAll('.band').length;
    document.getElementById('numBands').value = numBands;
    updateConcertEndTime();
}

function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function updateConcertEndTime() {
    const concertStartTime = document.getElementById('concertStartTime').value;
    const bandDivs = document.querySelectorAll('.band');
    
    let totalMinutes = convertTimeToMinutes(concertStartTime);
    
    bandDivs.forEach((bandDiv) => {
        const concertDuration = parseInt(bandDiv.querySelectorAll('input[type="number"]')[0].value) || 0;
        const changeoverTime = parseInt(bandDiv.querySelectorAll('input[type="number"]')[1].value) || 0;
        totalMinutes += concertDuration + changeoverTime;
    });

    document.getElementById('concertEndTime').value = convertMinutesToTime(totalMinutes);
}

function getTechnicianContact(technician) {
    if (technician === 'Julien') {
        return 'Julien • julienbrindezinc@gmail.com • +33 6 25 98 83 50';
    } else if (technician === 'Antony') {
        return 'Antony • antonysoler@gmail.com • +33 6 42 25 88 52';
    } else if (technician === 'Autre') {
        const customName = document.getElementById('customTechnicianName').value;
        const customEmail = document.getElementById('customTechnicianEmail').value;
        const customPhone = document.getElementById('customTechnicianPhone').value;
        return `${customName} • ${customEmail} • ${customPhone}`;
    } else {
        return '';
    }
}

function toggleCustomTechnicianFields() {
    const technician = document.getElementById('technician').value;
    const customTechnicianFields = document.getElementById('customTechnicianFields');
    if (technician === 'Autre') {
        customTechnicianFields.style.display = 'block';
    } else {
        customTechnicianFields.style.display = 'none';
    }
}

function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                const latLng = [parseFloat(lat), parseFloat(lon)];
                map.setView(latLng, 15);
                if (marker) {
                    marker.setLatLng(latLng);
                } else {
                    marker = L.marker(latLng).addTo(map);
                }
            } else {
                alert('Adresse non trouvée');
            }
        })
        .catch(error => {
            console.error('Erreur lors du géocodage:', error);
            alert('Erreur lors du géocodage');
        });
}

function generateRoadmap() {
    const concertDate = document.getElementById('concertDate').value;
    const venueName = document.getElementById('venueName').value;
    const venueAddress = document.getElementById('venueAddress').value;
    const technician = document.getElementById('technician').value;
    const technicianContact = getTechnicianContact(technician);
    const numBands = document.getElementById('numBands').value;
    const mealTime = document.getElementById('mealTime').value;
    const publicOpeningTime = document.getElementById('publicOpeningTime').value;
    const concertStartTime = document.getElementById('concertStartTime').value;
    const concertEndTime = document.getElementById('concertEndTime').value;
    const publicClosingTime = document.getElementById('publicClosingTime').value;

    geocodeAddress(venueAddress);

    let roadmapHtml = `<h2>Feuille de Route</h2>`;
    roadmapHtml += `<p>Date du concert: ${concertDate}</p>`;
    roadmapHtml += `<p>Salle: ${venueName}</p>`;
    roadmapHtml += `<p>Adresse: ${venueAddress}</p>`;
    roadmapHtml += `<div id="mapCapture" style="text-align: center; margin-top: 20px;"></div>`;
    roadmapHtml += `<p>Technicien d'accueil: ${technicianContact}</p>`;
    roadmapHtml += `<p>Horaire du repas: ${mealTime}</p>`;
    roadmapHtml += `<p>Ouverture public: ${publicOpeningTime}</p>`;
    roadmapHtml += `<p>Début du concert: ${concertStartTime}</p>`;
    roadmapHtml += `<p>Fin de concert: ${concertEndTime}</p>`;
    roadmapHtml += `<p>Fermeture public: ${publicClosingTime}</p>`;

    const bands = [];
    const bandDivs = document.querySelectorAll('.band');
    bandDivs.forEach((bandDiv, index) => {
        const bandName = bandDiv.querySelector('input[type="text"]').value;
        const concertDuration = bandDiv.querySelector('input[type="number"]').value;
        const changeoverTime = bandDiv.querySelectorAll('input[type="number"]')[1].value;

        bands.push({ bandName, concertDuration, changeoverTime });
    });

    // Calcul des horaires d'arrivée et de balance
    roadmapHtml += `<h3>Horaires d'arrivée et de balance</h3>`;
    const arrivalBands = [...bands].reverse();
    if (numBands == 1) {
        roadmapHtml += `<p>${arrivalBands[0].bandName} - Arrivée: 16:00 - Balance: 16:00 à 17:30</p>`;
    } else if (numBands == 2) {
        roadmapHtml += `<p>${arrivalBands[0].bandName} - Arrivée: 16:00 - Balance: 16:00 à 17:30</p>`;
        roadmapHtml += `<p>${arrivalBands[1].bandName} - Arrivée: 17:30 - Balance: 17:30 à 19:00</p>`;
    } else if (numBands == 3) {
        roadmapHtml += `<p>${arrivalBands[0].bandName} - Arrivée: 15:00 - Balance: 15:00 à 16:30</p>`;
        roadmapHtml += `<p>${arrivalBands[1].bandName} - Arrivée: 16:30 - Balance: 16:30 à 18:00</p>`;
        roadmapHtml += `<p>${arrivalBands[2].bandName} - Arrivée: 18:00 - Balance: 18:00 à 19:30</p>`;
    } else {
        let currentTime = convertTimeToMinutes(concertEndTime);
        arrivalBands.forEach((band) => {
            currentTime -= parseInt(band.changeoverTime);
            roadmapHtml += `<p>${band.bandName} - Arrivée: ${convertMinutesToTime(currentTime)} - Balance: ${convertMinutesToTime(currentTime)} (${band.concertDuration} minutes)</p>`;
            currentTime -= parseInt(band.concertDuration);
        });
    }

    roadmapHtml += `<h3>Ordre de passage des groupes</h3>`;
    currentTime = convertTimeToMinutes(concertStartTime);
    bands.forEach((band, index) => {
        roadmapHtml += `<p>${index + 1}. ${band.bandName} - Début: ${convertMinutesToTime(currentTime)} - Durée: ${band.concertDuration} minutes</p>`;
        currentTime += parseInt(band.concertDuration);
        if (index < bands.length - 1) {
            roadmapHtml += `<p>Changement de plateau: ${convertMinutesToTime(currentTime)} - Durée: ${band.changeoverTime} minutes</p>`;
            currentTime += parseInt(band.changeoverTime);
        }
    });

    document.getElementById('roadmapPreview').innerHTML = roadmapHtml;

    html2canvas(document.getElementById('map')).then(canvas => {
        const mapCapture = document.getElementById('mapCapture');
        mapCapture.appendChild(canvas);
    });
}

function saveAsPDF() {
    const roadmapPreview = document.getElementById('roadmapPreview').innerHTML;
    const pdfWindow = window.open('', '', 'width=800,height=600');
    pdfWindow.document.write('<html><head><title>Feuille de Route</title>');
    pdfWindow.document.write('</head><body>');
    pdfWindow.document.write(roadmapPreview);
    pdfWindow.document.write('</body></html>');
    pdfWindow.document.close();
    pdfWindow.print();
}

// Initialize the map when the window loads
window.onload = initMap;