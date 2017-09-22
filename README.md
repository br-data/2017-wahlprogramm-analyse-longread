# Wahlprogramm-Analyse zur Bundestagswahl 2017
Wir haben ein Experiment gewagt: Ein lernender Algorithmus hat für uns die Wahlprogramme der großen Parteien zur Bundestagswahl analysiert. Per Machine-Learning haben wir 810 Textabschnitte automatisch bewertet und in Kategorien einsortiert. So lassen sich die Standpunkte der Parteien gegenüberstellen und vergleichen. Eine Analyse von [BR Data](http://br.de/data).

- **Live**: http://web.br.de/interaktiv/merkel-nach-zahlen/
- **Redirect**: http://br.de/merkelnachzahlen/

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Projekt bauen mit `npm run-script dist` oder `grunt dist`
4. Website über Apache oder einen ähnlichen HTTP-Server ausliefern

## Daten
Grundlage der Auswertung sind die Wahlprogramme deutscher Parteien zur Bundestagswahl 2017. Die Wahlprogramme wurde automatisiert pro Absatz nach politischer Einstellung (links/rechts) und Politikfeld klassifiziert. Der Einordnung liegt ein Machine-Learning-Algorithmus zugrunde, welcher mit Daten des [Manifesto-Projekts](https://manifestoproject.wzb.eu/) trainiert wurde.

Die Maschine-Learning-Klassifizierung und die Analyse finden sich [hier](https://github.com/digitalegarage/wahlprogramm-analyse).

## Elemente
Die Website baut auf dem [BR Data Longread Template](https://github.com/digitalegarage/longread-template) auf. Eine detaillierte Dokumentation der Standard-Elemente findet sich dort. Die hier dokumentierten Elemente sind projektspezifisch:

### Parteifarben
Die Farben für die einzelnen Parteien werden in `scripts/init.js` definiert und in allen Diagramme verwendet:

```javascript
var colors = {
  'CDU/CSU': '#121212',
  'SPD': '#d71f1d',
  'Die Linke': '#be3075',
  'Grüne': '#0a8000',
  'FDP': '#ffdd00',
  'AfD': '#129ee6'
};
```

Die Reihenfolge der Parteien richtet sich nach dem Ergebnis bei der letzten Bundestagswahl.

### Politische Ausrichtung im Zeitverlauf (Timeline)
Zeigt die politische Entwicklung der Parteien auf einer Links/Rechts-Achse. Die Daten finden sich in einer JSON-Datei unter `data/rileTimeline.json`.

HTML:

```html
<div id="rile-timeline" class="chart"></div>
```

Initialisierung in `scripts/init.js`:

```javascript
var timeline = new RileTimeline();

d3.json('./data/rileTimeline.json', function (data) {

  timeline.init({id: 'rile-timeline', data: data, colors: colors });
});
```


### Politische Ausrichtung im Vergleich (Boxplot)
Boxplot-ähnliches Diagramm zum Vergleichen der unterschiedlichen politischen Positionen (Links/Rechts) in einem Politikfeld. Der Punkt in der Mitte gibt den Median wieder, die Balken die Standardabweichung nach Links oder Rechts.

HTML:

```html
<div id="rile-economy" class="chart"></div>
```

Initialisierung in `scripts/init.js`:

```javascript
var economy = new RileBoxPlot();

d3.json('./data/rileBoxPlot.json', function (data) {

  economy.init({id: 'rile-economy', data: data['Economy'], colors: colors });
});
```

### Schwerpunkte der Parteiprogramme (Small Multiples)
Kleine Balkendiagramme, welche zeigen wie viele Aussagen die Parteien in jedem Politikfeld machen, gewichtet nach Textlänge.

HTML:

```html
<div id="domain-comparison" class="chart"></div>
```

Initialisierung in `scripts/init.js`:

```javascript
var comparison = new DomainComparison();

d3.json('./data/domainComparison.json', function (data) {

  comparison.init({id: 'domain-comparison', data: data, colors: colors });
});
```

## Entwickeln
Das Longread-Template ist eine Web-Anwendung basierend auf HTML, Sass und JavaScript. Als Paketmanager kommt NPM zum Einsatz. Alle anderen Abhänigkeiten, wie Grunt und PostCSS, dienen nur dazu, einen optimierten Build zu erstellen.

### Enwicklungsserver
Zum lokalen Entwickeln ist ein kleiner [HTTP-Server](https://github.com/indexzero/http-server) integriert. Diesen kann man mit dem Befehl `npm start` starten. Der Server läuft unter http://localhost:8080. Beim Starten des Entwicklungsservers sollte automatisch ein neues Browserfenster aufgehen. 

### Stylesheets
Die Stylesheets sind modular in [Sass](http://sass-lang.com/) angelegt:
- **custom**: projektspezifische Stylesheets 
- **layout**: allgemeine Layout-Komponenten (Typo, Farben, Grid ...) 
- **modules**: komponentenspezifische Komponenten (Navigation, Footer, Zitate ...)

Um die Sass-Styles bei jeder Änderungen neu zu kompilieren, kann man den Sass-Watcher laufen lassen `npm run-script watch` oder `grunt watch`. Als Kompiler kommt [LibSass](http://sass-lang.com/libSass) zum Einsatz, welcher deutlich schneller ist als der alte Ruby-Sass-Kompiler. 

*Hinweis*: Vendor-Prefixes können weggelassen werden, das diese im Grunt-Build-Task automatisch hinzugefügt werden.

### Javascript
Das Javascript is ebenfalls modular aufgebaut. Es gibt einen zentralen Einstiegspunkt `init.js`, wo alle Module initialisiert werden. Auch globale Event Listener auf das window oder document-Objekt sollten hier registriert werden.

Die Module haben folgen dem [Revealing Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) und haben folgenden Aufbau: 

```javascript
var module = (function () {

  'use strict';

  function init() {

    doSomething();
  }

  function doSomething() {

    // Do something
  }

  // Export global functions
  return {
    init: init,
  };
})();
```

In der `init.js` würde man das Modul folgendermaßen aufrufen:

```javascript
module.init()
```

Alle Module sind in Vanilla-Javascript (ohne andere Bibliotheken) geschrieben. Sollte man eine externe Bibliothek benötigen, kann man diese mit NPM installieren:

```
npm install d3 --save
```

### Grunt (Build Task)
Mithilfe des Taskrunners Grunt kann eine optimierte Version der Seite gebaut werden. Dabei wird:
- JavaScript wird minifiziert und in eine Datei zusammengefasst (uglify)
- Stylesheet werden geprefixt, minifiziert und zusammengefasst (PostCSS)
- HTML-Script und Style-Tags werden angepasst (Usemin)
- Bilder und Daten werden kopiert (copy)

Ausführen den Grunt Tasks:
- Erforderliche Module installieren `npm install`
- Task ausführen mit `npm run-script dist` oder `grunt dist`

Die optimierte Version des Webseite liegt nach Ausführen des Grunt Tasks unter `dist`. Sollten neue Bibliotheken hinzugefügt werden, müssen diese auch im Gruntfile hinzugefügt werden:

```javascript
uglify: {

  dist: {

    files: {

      'dist/scripts/main.min.js': [
        'node_modules/d3/d3.min.js', // Neue Bibliothek
        'src/scripts/classList.js',
        'src/scripts/navigation.js',
        'src/scripts/marginals.js',
        'src/scripts/intro.js',
        'src/scripts/highlights.js',
        'src/scripts/comparison.js',
        'src/scripts/ranking.js',
        'src/scripts/init.js'
      ]
    }
  }
}
```

Externe Stylesheet importiert man jedoch besser in einem Sass-Modul:

```Sass
@import url(http://web.br.de/interaktiv/assets/libraries/leaflet/leaflet.v0.min.css)
```

## Verbesserungen
