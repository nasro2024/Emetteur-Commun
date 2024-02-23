// Fonction pour calculer les résistances et tracer les signaux
function calculateResistances() {
    // Récupération des valeurs des champs du formulaire
    var vcc = parseFloat(document.getElementById('vcc').value);
    var beta = parseFloat(document.getElementById('beta').value);
    var icq = parseFloat(document.getElementById('icq').value);
    var amplitude = parseFloat(document.getElementById('amplitude').value);
    var frequency = parseFloat(document.getElementById('frequency').value);
    var vsSensitivity = parseFloat(document.getElementById('vsSensitivity').value);
    var veSensitivity = parseFloat(document.getElementById('veSensitivity').value);
    var horizontalSensitivity = parseInt(document.getElementById('horizontalSensitivity').value);

    // Vérification si toutes les valeurs sont valides
    if (isNaN(vcc) || isNaN(beta) || isNaN(icq) || isNaN(amplitude) || isNaN(frequency) || isNaN(vsSensitivity) || isNaN(veSensitivity) || isNaN(horizontalSensitivity)) {
        alert("Veuillez saisir des valeurs valides pour Vcc, beta, Icq, amplitude, fréquence, sensibilité de vs, sensibilité de ve et sensibilité horizontale.");
        return;
    }

    // Calcul des résistances
    var vem = 0.1 * vcc;
    var vcm = vcc - (4 * vem);
    var vbm = vem + 0.7;
    var vceq = vcm - vem;
    var re = vem / icq;
    var rc = 4 * re;
    var ip = 10 * icq / beta;
    var rb2 = vbm / ip;
    var rb1 = (vcc - vbm) / (11 * icq / beta);
    var Av = -(rc * icq) / 0.026;

    // Affichage des résultats des résistances
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "<h3>RESULTATS :</h3>" +
                            "<p>Re = " + re.toFixed(2) + " ohms</p>" +
                            "<p>Rc = " + rc.toFixed(2) + " ohms</p>" +
                            "<p>Rb1 = " + rb1.toFixed(2) + " ohms</p>" +
                            "<p>Rb2 = " + rb2.toFixed(2) + " ohms</p>" +
                            "<p>Vem = " + vem.toFixed(2) + " volts</p>" +
                            "<p>Vcm = " + vcm.toFixed(2) + " volts</p>" +
                            "<p>Vbm = " + vbm.toFixed(2) + " volts</p>" +
                            "<p>Vceq = " + vceq.toFixed(2) + " volts</p>" +
                            "<p>Gain en tension Av = " + Av.toFixed(2) + "</p>";

    // Simulation des signaux ve et vs
    var ve = generateSinusoidalSignal(amplitude, frequency, 0, 2 * Math.PI, horizontalSensitivity).map(v => v * veSensitivity);
    var vs = ve.map(v => Av * v * vsSensitivity);

    // Calcul des valeurs maximales
    var veMax = Math.max(...ve); // Calcul de la valeur maximale de ve
    var vsMax = Math.max(...vs) / vsSensitivity; // Calcul de vsMax divisé par la sensibilité de vs

    // Affichage des signaux
    drawSignalGraph(ve, vs);
}

// Fonction pour générer un signal sinusoidal
function generateSinusoidalSignal(amplitude, frequency, phase, duration, horizontalSensitivity) {
    var samples = 100000 / horizontalSensitivity;
    var time = duration / samples;
    var signal = [];
    for (var i = 0; i < samples; i++) {
        var t = i * time;
        var value = amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
        signal.push(value);
    }
    return signal;
}

// Fonction pour tracer les signaux
function drawSignalGraph(ve, vs) {
    var canvas = document.getElementById('signalCanvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner les axes
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Dessiner le signal ve
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, height / 2 - ve[0] * height / 2);
    for (var i = 1; i < ve.length; i++) {
        ctx.lineTo(i * (width / ve.length), height / 2 - ve[i] * height / 2);
    }
    ctx.stroke();

    // Dessiner le signal vs
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(0, height / 2 - vs[0] * height / 2);
    for (var i = 1; i < vs.length; i++) {
        ctx.lineTo(i * (width / vs.length), height / 2 - vs[i] * height / 2);
    }
    ctx.stroke();
}

// Fonction pour réinitialiser les champs
function resetFields() {
    document.getElementById('vcc').value = '';
    document.getElementById('beta').value = '';
    document.getElementById('icq').value = '';
    document.getElementById('amplitude').value = '';
    document.getElementById('frequency').value = '';
    document.getElementById('vsSensitivity').value = '';
    document.getElementById('veSensitivity').value = '';
    document.getElementById('horizontalSensitivity').value = '';
    document.getElementById('results').innerHTML = '';
    var canvas = document.getElementById('signalCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour ajuster la sensibilité horizontale
function adjustHorizontalSensitivity() {
    calculateResistances(); // Recalculer les résistances avec la nouvelle sensibilité horizontale
}

// Événement au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Ajout des gestionnaires d'événements pour les boutons
    document.getElementById('calculateResistances').addEventListener('click', calculateResistances);
    document.getElementById('resetFields').addEventListener('click', resetFields);
    document.getElementById('adjustHorizontalSensitivity').addEventListener('click', adjustHorizontalSensitivity);
});
