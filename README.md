# Doing - Site statique

Site public statique pour l'app **Doing** (HTML/CSS/JS vanilla), prêt pour une publication simple et une revue App Store.

## Structure

- `index.html` : landing page
- `privacy.html` : politique de confidentialité
- `support.html` : page de support
- `assets/css/styles.css` : styles globaux
- `assets/js/main.js` : interactions JS (scroll, FAQ, formulaire)
- `robots.txt`
- `sitemap.xml`

## Ouvrir localement

1. Ouvrir le dossier `site`.
2. Double-cliquer sur `index.html` ou servir le dossier avec un petit serveur local.

Exemple serveur local Python:

```bash
cd site
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déploiement GitHub Pages

1. Pousser le dossier `site` dans votre dépôt.
2. Dans GitHub, aller dans `Settings > Pages`.
3. Sélectionner la branche (ex: `main`) et le dossier `/(root)` ou `/site` selon votre organisation.
4. Sauvegarder, puis attendre la publication.

## Notes

- Aucun framework, aucune dépendance CDN.
- Liens internes fonctionnels entre les 3 pages publiques.
- Les visuels sont des placeholders (`.ph`) pour être remplacés plus tard.
