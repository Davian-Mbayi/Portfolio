let notes = []

function afficherNotes() {
    const zone = document.getElementById("listeNotes")
    if (notes.length === 0) {
        zone.textContent = "Aucune note ajoutée."
    } else {
        zone.textContent = "Notes : " + notes.join(", ")
    }
}

function ajouterNote() {
    const champ = document.getElementById("note")
    const valeur = parseFloat(champ.value)

    if (!isNaN(valeur) && valeur >= 0 && valeur <= 20) {
        notes.push(valeur)
        champ.value = ""
        afficherNotes()}
}

function calculerMoyenne() {
    if (notes.length === 0) {
        alert("Ajoutez d'abord des notes avant de calculer.")
        return
    }
    const somme = notes.reduce((a, b) => a + b, 0)
    const moyenne = (somme / notes.length).toFixed(2)
    document.getElementById("resultat").textContent = `Moyenne : ${moyenne}/20`
}
