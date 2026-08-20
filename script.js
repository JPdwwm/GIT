const navbar = document.querySelector('.navbar');
const links = navbar.querySelectorAll('a');
const highlight = navbar.querySelector('.highlight');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const linkRect = link.getBoundingClientRect();
        const navRect = navbar.getBoundingClientRect();

        highlight.style.left = (linkRect.left - navRect.left) + 'px';
        highlight.style.width = linkRect.width + 'px';
    });
});
navbar.addEventListener('mouseleave', () => {
    highlight.style.width = '0px';
});

document.getElementById('btnGet').addEventListener('click', async () => {
      const resultatEl = document.getElementById('resultat');
      resultatEl.textContent = 'Chargement...';

      try {
        // fetch = fonction native du navigateur pour faire une requête HTTP
        const reponse = await fetch('https://jsonplaceholder.typicode.com/users/5');

        // On vérifie que la requête s'est bien passée
        if (!reponse.ok) {
          throw new Error(`Erreur HTTP: ${reponse.status}`);
        }

        // On convertit la réponse (texte brut) en objet JavaScript
        const donnees = await reponse.json();

        // On affiche le résultat de façon lisible
        resultatEl.textContent = JSON.stringify(donnees, null, 2);
      } catch (erreur) {
        resultatEl.textContent = 'Erreur: ' + erreur.message;
      }
    });