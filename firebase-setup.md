# Firebase fuer Polds Taschengeld

## Was du jetzt schon machen kannst

Ja, du kannst die Firebase-Web-App schon jetzt einrichten.

## Schritt fuer Schritt

1. Auf `https://console.firebase.google.com/` gehen.
2. Neues Projekt anlegen.
3. Im Projekt eine `Web App` registrieren.
4. Die Firebase-Konfiguration kopieren.
5. `Cloud Firestore` aktivieren.
6. Bei Firestore die Sicherheitsregeln oeffnen.
7. Den Inhalt aus `firestore.rules` einfuegen.
8. Regeln veroeffentlichen.

## Firestore-Regeln

Die Regeln in `firestore.rules` erlauben nur Zugriff, wenn die App bei Firebase angemeldet ist.
Die App meldet sich dafuer automatisch anonym an.

## Danach in der App

1. In der App auf `Sync` tippen.
2. Eine Familien-ID eingeben, zum Beispiel `familie-pold`.
3. Die komplette Firebase-Konfiguration als JSON einfuegen.
4. `Synchronisation verbinden` tippen.

Alle Geraete mit derselben Familien-ID und derselben Firebase-Konfiguration teilen sich dann dieselben Eintraege.
