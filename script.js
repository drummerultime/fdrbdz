document.getElementById('numBands').addEventListener('change', function() {
    updateBands();
});

function updateBands() {
    const numBands = document.getElementById('numBands').value;
    const bandsContainer = document.getElementById('bandsContainer');
    bandsContainer.innerHTML = '';

    for (let i = 0; i < numBands; i++) {
        addBand(i + 1);
    }
    updateConcertEndTime();
}

function addBand(bandNumber) {
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
    bandNameLabel.textContent = `Nom du groupe ${bandNumber}:`;
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
    updateConcertEndTime();
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
    if (!concertStartTime) return;

    const bandDivs = document.querySelectorAll('.band');
    
    let totalMinutes = convertTimeToMinutes(concertStartTime);
    
    bandDivs.forEach((bandDiv) => {
        const concertDuration = parseInt(bandDiv.querySelectorAll('input[type="number"]')[0].value) || 0;
        const changeoverTime = parseInt(bandDiv.querySelectorAll('input[type="number"]')[1].value) || 0;
        totalMinutes += concertDuration + changeoverTime;
    });

    // Handle time overflow past midnight
    totalMinutes = totalMinutes % (24 * 60);

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

function toggleRunToStationFields() {
    const runToStation = document.getElementById('runToStation').value;
    const runToStationFields = document.getElementById('runToStationFields');
    if (runToStation === 'oui') {
        runToStationFields.style.display = 'block';
    } else {
        runToStationFields.style.display = 'none';
    }
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

function updateTimes() {
    const concertDate = new Date(document.getElementById('concertDate').value);
    const dayOfWeek = concertDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    if (dayOfWeek === 0) { // Sunday
        document.getElementById('publicOpeningTime').value = '19:00';
        document.getElementById('concertStartTime').value = '20:00';
    } else { // Monday to Saturday
        document.getElementById('publicOpeningTime').value = '20:00';
        document.getElementById('concertStartTime').value = '21:00';
    }
    updateConcertEndTime();
}

function generateRoadmap() {
    const concertDate = document.getElementById('concertDate').value;
    const venueName = document.getElementById('venueName').value;
    const venueAddress = document.getElementById('venueAddress').value;
    const technician = document.getElementById('technician').value;
    const technicianContact = getTechnicianContact(technician);
    const runToStation = document.getElementById('runToStation').value;
    const stationTime = document.getElementById('stationTime').value;
    const numBands = document.getElementById('numBands').value;
    const mealTime = document.getElementById('mealTime').value;
    const publicOpeningTime = document.getElementById('publicOpeningTime').value;
    const concertStartTime = document.getElementById('concertStartTime').value;
    const concertEndTime = document.getElementById('concertEndTime').value;
    const publicClosingTime = document.getElementById('publicClosingTime').value;
    const comments = document.getElementById('comments').value;

    let roadmapHtml = `<h2>Feuille de Route</h2>`;
    roadmapHtml += `<p>Date du concert: ${formatDate(concertDate)}</p>`;
    roadmapHtml += `<p>Salle: ${venueName}</p>`;
    roadmapHtml += `<p>Adresse: ${venueAddress}</p>`;
    roadmapHtml += `<p>Technicien d'accueil: ${technicianContact}</p>`;
    roadmapHtml += `<p class="italic">Merci de prévenir en cas de retard ou difficultés pendant le voyage</p>`;
    if (runToStation === 'oui') {
        roadmapHtml += `<p>Run à la gare: Oui, Horaire: ${stationTime}</p>`;
    }
    roadmapHtml += `<p>Horaire du repas: ${mealTime}</p>`;
    roadmapHtml += `<p>Ouverture public: ${publicOpeningTime}</p>`;
    roadmapHtml += `<p>Début du concert: ${concertStartTime}</p>`;
    roadmapHtml += `<p>Fin de concert: ${concertEndTime}</p>`;
    roadmapHtml += `<p>Fermeture public: ${publicClosingTime}</p>`;

    roadmapHtml += `<h3>Wifi</h3>`;
    roadmapHtml += `<p>ID : BDZ_EXT2<br>Mdp : BDZ73000</p>`;

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
    if (numBands == 1 || numBands == 2) {
        let arrivalTime = 16 * 60;
        const balanceDuration = 90; // 1h30 for each band
        bands.reverse().forEach((band) => {
            const balanceEndTime = arrivalTime + balanceDuration;
            roadmapHtml += `<p>${band.bandName} - Arrivée: ${convertMinutesToTime(arrivalTime)} - Balance: ${convertMinutesToTime(arrivalTime)} à ${convertMinutesToTime(balanceEndTime)}</p>`;
            arrivalTime = balanceEndTime;
        });
    } else if (numBands == 3) {
        let arrivalTime = 15 * 60;
        const balanceDurations = [60, 90, 90]; // 1h for last band, 1h30 for others
        bands.reverse().forEach((band, index) => {
            const balanceEndTime = arrivalTime + balanceDurations[index];
            roadmapHtml += `<p>${band.bandName} - Arrivée: ${convertMinutesToTime(arrivalTime)} - Balance: ${convertMinutesToTime(arrivalTime)} à ${convertMinutesToTime(balanceEndTime)}</p>`;
            arrivalTime = balanceEndTime;
        });
    } else if (numBands == 4) {
        let arrivalTime = 15 * 60;
        const balanceDuration = 60; // 1h for each band
        bands.reverse().forEach((band) => {
            const balanceEndTime = arrivalTime + balanceDuration;
            roadmapHtml += `<p>${band.bandName} - Arrivée: ${convertMinutesToTime(arrivalTime)} - Balance: ${convertMinutesToTime(arrivalTime)} à ${convertMinutesToTime(balanceEndTime)}</p>`;
            arrivalTime = balanceEndTime;
        });
    }

    roadmapHtml += `<h3>Ordre de passage des groupes</h3>`;
    let currentTime = convertTimeToMinutes(concertStartTime);
    bands.forEach((band, index) => {
        roadmapHtml += `<p>${index + 1}. ${band.bandName} - Début: ${convertMinutesToTime(currentTime)} - Durée: ${band.concertDuration} minutes</p>`;
        currentTime += parseInt(band.concertDuration);
        if (index < bands.length - 1) {
            roadmapHtml += `<p>Changement de plateau: ${convertMinutesToTime(currentTime)} - Durée: ${band.changeoverTime} minutes</p>`;
            currentTime += parseInt(band.changeoverTime);
        }
    });

    if (comments) {
        roadmapHtml += `<h3>Commentaires</h3>`;
        roadmapHtml += `<p class="italic">${comments}</p>`;
    }

    document.getElementById('roadmapPreview').innerHTML = roadmapHtml;
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