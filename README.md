# Aachener Trompetenforum — Website

Statische Website des Aachener Trompetenforums, gehostet über **GitLab Pages auf git.nrw**.

## Dateien

```
website/
├── index.html            ← Startseite (inkl. Über uns, Karte)
├── news.html              ← News
├── ensembles.html          ← Ensembles & Buchung
├── barockorchester.html
├── foerderer.html
├── kontakt.html            ← Kontaktformular
├── impressum.html
├── datenschutz.html
├── 404.html
├── _redirects              ← GitLab Pages Weiterleitungen
├── .gitlab-ci.yml          ← Build-/Deploy-Pipeline für GitLab Pages
├── styles/
│   └── main.css
├── scripts/
│   └── main.js
├── images/                 ← Alle Bilder (inkl. images/logos, images/gallery)
└── en/                     ← Englische Version aller Seiten
```

## Deployment auf git.nrw (GitLab Pages)

1. Auf [gitlab.git.nrw](https://gitlab.git.nrw) einloggen (DFN-AAI / RWTH-Account) und ein neues Projekt anlegen.
2. Dieses Repository als neuen Remote hinzufügen und pushen:
   ```
   git remote add gitnrw https://gitlab.git.nrw/<namespace>/<projekt>.git
   git push gitnrw main
   ```
3. Unter **Deploy → Pages** im Projekt prüfen, ob der `pages`-Job aus der `.gitlab-ci.yml` erfolgreich läuft.
4. Die Seite ist danach unter einer automatisch generierten Adresse erreichbar, z. B.:
   `https://website-abcde1.pages.git.nrw/`

Die `.gitlab-ci.yml` kopiert bei jedem Push auf `main` automatisch alle `*.html`-Dateien, `_redirects`, `styles/`, `scripts/`, `images/` und `en/` in den von GitLab Pages erwarteten `public/`-Ordner.

## Eigene Domain (trompetenforum.rwth-aachen.de)

1. Im git.nrw-Projekt unter **Settings → Pages → New Domain** die Domain `trompetenforum.rwth-aachen.de` eintragen. GitLab zeigt daraufhin einen Verifizierungs-Code (TXT-Record) an.
2. Ein eigenes TLS-Zertifikat für die Domain hochladen — git.nrw stellt für Custom Domains **kein** automatisches Let's-Encrypt-Zertifikat aus.
3. Beim RWTH IT Center (z. B. per Ticket an service@itc.rwth-aachen.de) folgendes beantragen:
   - einen **CNAME-Record** für `trompetenforum.rwth-aachen.de`, der auf die git.nrw-Pages-Adresse aus Schritt 3 der Deployment-Anleitung zeigt
   - den **TXT-Record** zur Domain-Verifizierung aus Schritt 1
   - Unterstützung bei der Zertifikatsausstellung (z. B. über ein DFN-Zertifikat)
4. Nach erfolgreicher DNS-Verifizierung und Zertifikatshinterlegung ist die Seite unter `https://trompetenforum.rwth-aachen.de` erreichbar.

## Kontaktformular aktivieren

1. Auf **formspree.io** registrieren (kostenlos).
2. Neues Formular erstellen → Form-ID notieren (z. B. `xpzgkldw`).
3. In `kontakt.html` (und `en/kontakt.html`) ersetzen:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   durch die echte ID.

## News aktualisieren

In `news.html` (und `en/news.html`) den HTML-Block eines News-Eintrags kopieren und mit neuen Inhalten füllen.

## Impressum

Bitte `[Platzhalter]` in `impressum.html` mit den echten Vereinsdaten ersetzen, falls noch nicht geschehen.
