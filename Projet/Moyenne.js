let notes = [];
let noteIdCounter = 0;

function afficherNotes() {
    const liste = document.getElementById("listeNotes");
    liste.innerHTML = ""; // Vider la liste actuelle

    if (notes.length === 0) {
        liste.innerHTML = '<li class="empty-msg">Aucune note ajoutée pour le moment.</li>';
        return;
    }

    notes.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>Note : <strong>${item.valeur}</strong> (Coef: ${item.coef})</span>
            <button class="btn-delete" onclick="supprimerNote(${item.id})">❌</button>
        `;
        liste.appendChild(li);
    });
}

function ajouterNote() {
    const champNote = document.getElementById("note");
    const champCoef = document.getElementById("coef");
    
    const valeur = parseFloat(champNote.value);
    const coef = parseFloat(champCoef.value);

    // Vérification des données
    if (!isNaN(valeur) && valeur >= 0 && valeur <= 20 && !isNaN(coef) && coef > 0) {
        notes.push({ id: noteIdCounter++, valeur: valeur, coef: coef });
        
        // Réinitialiser les champs
        champNote.value = "";
        champCoef.value = "1";
        champNote.focus(); // Remettre le curseur sur la note
        
        afficherNotes();
    } else {
        alert("Veuillez entrer une note valide (0-20) et un coefficient > 0.");
    }
}

function supprimerNote(id) {
    notes = notes.filter(n => n.id !== id);
    afficherNotes();
    document.getElementById("resultat").textContent = "Moyenne : --/20";
    document.getElementById("resultat").style.color = "#fff";
}

function reinitialiser() {
    notes = [];
    afficherNotes();
    document.getElementById("resultat").textContent = "Moyenne : --/20";
    document.getElementById("resultat").style.color = "#fff";
}

function calculerMoyenne() {
    if (notes.length === 0) {
        alert("Ajoutez d'abord des notes avant de calculer.");
        return;
    }
    
    let sommeNotes = 0;
    let sommeCoefs = 0;

    notes.forEach(item => {
        sommeNotes += item.valeur * item.coef;
        sommeCoefs += item.coef;
    });

    const moyenne = (sommeNotes / sommeCoefs).toFixed(2);
    const elementResultat = document.getElementById("resultat");
    
    elementResultat.textContent = `Moyenne : ${moyenne}/20`;
    
    // Changement de couleur dynamique
    if (moyenne >= 10) {
        elementResultat.style.color = "#a8e6cf"; // Vert (succès)
    } else {
        elementResultat.style.color = "#ff8b94"; // Rouge (échec)
    }
}

// Permettre de valider avec la touche "Entrée" du clavier
document.getElementById("note").addEventListener("keypress", function(event) {
    if (event.key === "Enter") ajouterNote();
});
document.getElementById("coef").addEventListener("keypress", function(event) {
    if (event.key === "Enter") ajouterNote();
});
