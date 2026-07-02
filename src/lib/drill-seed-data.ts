import type { DrillCategory, DrillDifficulty } from "@prisma/client";

export type DrillSeed = {
  title: string;
  category: DrillCategory;
  difficulty: DrillDifficulty;
  situation: string;
  setup: string;
  execution: string;
  coachingCue: string;
  reps: string;
  focusTags: string[];
  videoQuery: string;
};

export const drillSeedData: DrillSeed[] = [
  {
    title: "Inside-Out Vorhand aus der Rückhand-Ecke",
    category: "FOREHAND",
    difficulty: "INTERMEDIATE",
    situation:
      "Der Gegner spielt einen tiefen, hohen Ball in deine Rückhand-Ecke und du willst das Spiel mit der Vorhand diktieren, statt passiv Rückhand zu spielen.",
    setup:
      "Trainingspartner oder Ballmaschine spielt gezielt tiefe Bälle in die linke Feldhälfte (Rückhand-Ecke bei Rechtshändern). Du startest mittig auf der Grundlinie.",
    execution:
      "Laufe früh um den Ball herum, sodass du ihn mit der Vorhand triffst, und spiele ihn cross-court in die gegnerische Rückhand-Ecke (Inside-Out) oder scharf ins offene Feld (Inside-In). Der Kontaktpunkt sollte leicht vor dem Körper liegen, mit klarer Gewichtsverlagerung nach vorne.",
    coachingCue:
      "Der erste Schritt entscheidet: seitlich und nach hinten, nicht nach vorne, um genug Platz für den Rundumschwung zu haben. Ellbogen locker, Beschleunigung erst im letzten Drittel des Schwungs.",
    reps: "3 Serien à 10 Bälle, davon 6 Inside-Out und 4 Inside-In",
    focusTags: ["Inside-Out", "Laufwege", "Winkelspiel", "Grundlinie"],
    videoQuery: "Patrick Mouratoglou inside out forehand tennis tip",
  },
  {
    title: "Vorhand im Vorlaufen (Approach zur Mitte)",
    category: "FOREHAND",
    difficulty: "ADVANCED",
    situation:
      "Ein kurzer, mittig platzierter Ball gibt dir die Chance, ins Feld vorzurücken und den Punkt mit der Vorhand zu beenden, statt abzuwarten.",
    setup: "Trainingspartner spielt kurze Bälle in die Feldmitte, du startest von der Grundlinie.",
    execution:
      "Erkenne den kurzen Ball früh, laufe zügig hinein und triff ihn möglichst vor der Aufstiegsphase (auf dem Ansteigen). Spiele tief und mit Tempo in eine Ecke, danach sofort Splitstep für den nächsten Ball.",
    coachingCue:
      "Nicht auf den perfekten Ball warten – der kurze Ball IST die Chance. Zielrichtung schon während des Anlaufens festlegen, nicht erst im Treffmoment.",
    reps: "4 Serien à 8 kurze Bälle, abwechselnd longline und cross",
    focusTags: ["Vorlaufen", "Frühe Ballannahme", "Punktabschluss"],
    videoQuery: "Patrick Mouratoglou approach shot forehand tennis lesson",
  },
  {
    title: "Cross-Court Rückhand-Konstanz (10er-Serie)",
    category: "BACKHAND",
    difficulty: "BEGINNER",
    situation:
      "Grundlage für jedes taktische Muster: eine stabile, wiederholbare Rückhand cross-court, die Druck aushält statt Fehler zu produzieren.",
    setup: "Zwei Spieler (oder Ballmaschine) spielen sich Rückhand cross-court zu, beide bleiben in der Rückhand-Ecke.",
    execution:
      "Ziel ist eine Serie von 10 Bällen ohne Unterbrechung, Tiefe über die gesamte Distanz zur gegnerischen Grundlinie. Kompakter Schwung, feste Handgelenksposition beim Kontakt.",
    coachingCue:
      "Konstanz vor Tempo: lieber 10 sichere, tiefe Bälle als 3 riskante. Der Ball soll über dem Netz mit klarem Sicherheitsabstand fliegen (ca. 1 Meter).",
    reps: "5 Serien, Ziel: mindestens 10 Bälle in Folge ohne Fehler",
    focusTags: ["Konstanz", "Tiefe", "Grundschlag"],
    videoQuery: "Patrick Mouratoglou backhand consistency drill tennis",
  },
  {
    title: "Rückhand-Slice zur Zeitgewinnung unter Druck",
    category: "BACKHAND",
    difficulty: "INTERMEDIATE",
    situation:
      "Wenn du unter Zeitdruck gerätst (z. B. nach einem harten, tiefen Ball), gibt dir der Slice Zeit zurück, um dich neu zu positionieren.",
    setup: "Partner spielt abwechselnd harte, tiefe Bälle und kurze Stoppbälle in die Rückhand-Ecke.",
    execution:
      "Bei Zeitdruck: flache, kontrollierte Slice-Rückhand mit offener Schlägerfläche, tief und mit Unterschnitt, um Zeit für die Rückkehr zur Grundlinienmitte zu gewinnen.",
    coachingCue:
      "Der Slice ist ein taktisches Werkzeug, kein Verlegenheitsschlag – bewusst einsetzen, um das Tempo aus dem Ballwechsel zu nehmen und selbst wieder ins Gleichgewicht zu kommen.",
    reps: "3 Serien à 8 Bälle mit wechselndem Druck-Timing",
    focusTags: ["Slice", "Zeitmanagement", "Verteidigung"],
    videoQuery: "Patrick Mouratoglou backhand slice defense tennis tip",
  },
  {
    title: "Aufschlag + 1: Das Feld öffnen",
    category: "SERVE",
    difficulty: "ADVANCED",
    situation:
      "Der erste Schlag nach dem Aufschlag entscheidet oft den Punkt. Ziel: mit dem Aufschlag eine Schwäche anspielen und den nächsten Ball offensiv nutzen.",
    setup: "Aufschlagspiel mit Fokus auf den 3. Schlag (Server-Punkt-Muster). Rückschläger steht auf einer festen Position.",
    execution:
      "Aufschlag gezielt in die Rückhand-Ecke des Gegners platzieren, den Return erwarten und den nächsten Ball (meist eine Vorhand) scharf in die offene Feldhälfte spielen.",
    coachingCue:
      "Plane den 3. Schlag schon vor dem Aufschlag – wohin der Return wahrscheinlich kommt, entscheidet, wie du dich positionierst.",
    reps: "4 Serien à 6 Aufschlagspiele, abwechselnd auf Rückhand und Vorhand des Gegners zielen",
    focusTags: ["Serve+1", "Taktik", "Punktmuster"],
    videoQuery: "Patrick Mouratoglou serve plus one pattern tennis tactics",
  },
  {
    title: "Kick-Aufschlag auf die Rückhand",
    category: "SERVE",
    difficulty: "ADVANCED",
    situation:
      "Ein hoch aufspringender Kick-Aufschlag in die Rückhand zwingt den Rückschläger zu einem unangenehmen, hohen Treffpunkt – besonders wirksam als 2. Aufschlag.",
    setup: "Aufschlagtraining ohne Gegner, Ziel-Markierung in der Rückhand-Aufschlagzone.",
    execution:
      "Von unten nach oben-links über den Ball streichen (bei Rechtshändern), Treffpunkt etwas hinter dem Kopf, für starken Topspin-Effekt und hohen Absprung.",
    coachingCue:
      "Der Ballwurf ist entscheidend: etwas weiter hinter den Kopf als beim flachen Aufschlag. Beschleunigung kommt aus dem Handgelenk im letzten Moment, nicht aus dem Arm.",
    reps: "5 Serien à 10 Aufschläge, Trefferquote in der Zielzone protokollieren",
    focusTags: ["Kick-Aufschlag", "2. Aufschlag", "Spin"],
    videoQuery: "Patrick Mouratoglou kick serve technique tennis lesson",
  },
  {
    title: "Return-Positionierung gegen starken 1. Aufschlag",
    category: "RETURN",
    difficulty: "INTERMEDIATE",
    situation:
      "Gegen einen Gegner mit hartem, präzisem 1. Aufschlag brauchst du die richtige Ausgangsposition, um überhaupt reaktionsfähig zu bleiben.",
    setup: "Partner serviert mit hohem Tempo, du variierst deine Ausgangsposition (auf der Linie, 1 Meter dahinter, 2 Meter dahinter).",
    execution:
      "Finde die Position, aus der du konstant reagieren kannst, ohne zu drängen. Splitstep exakt im Moment des gegnerischen Ballkontakts, kompakter Return-Schwung.",
    coachingCue:
      "Je härter der Aufschlag, desto weiter zurück UND desto kompakter der eigene Schwung – Return ist Reaktion, nicht Aktion.",
    reps: "4 Serien à 8 Returns pro Position, Erfolgsquote vergleichen",
    focusTags: ["Return", "Positionierung", "Splitstep"],
    videoQuery: "Patrick Mouratoglou return of serve positioning tennis",
  },
  {
    title: "Return-Block gegen schnelle Aufschläge",
    category: "RETURN",
    difficulty: "ADVANCED",
    situation:
      "Bei sehr schnellen Aufschlägen reicht die Zeit für einen vollen Schwung nicht – ein kompakter Block-Return hält den Ball im Spiel und kann sogar überraschend effektiv sein.",
    setup: "Partner oder Maschine spielt Aufschläge mit maximalem Tempo.",
    execution:
      "Kurzer, kompakter Schwung mit fester Handgelenksposition, die Energie des ankommenden Balls wird genutzt statt eigener Schwungkraft. Ziel: den Ball tief zurückspielen.",
    coachingCue:
      "Weniger ist mehr – der Schläger bewegt sich kaum, die Stabilität kommt aus fester Griffhaltung und rechtzeitigem Splitstep.",
    reps: "3 Serien à 10 Returns, Fokus auf Ballkontrolle statt Tempo",
    focusTags: ["Block-Return", "Reaktionsschnelligkeit", "Kompakter Schwung"],
    videoQuery: "Patrick Mouratoglou return fast serve block technique tennis",
  },
  {
    title: "Erster Volley nach Annäherung – tief und angewinkelt",
    category: "VOLLEY",
    difficulty: "INTERMEDIATE",
    situation:
      "Nach dem Vorlaufen ans Netz ist der erste Volley oft nicht der Punktgewinn, sondern die Vorbereitung – er muss vor allem sicher und schwer angreifbar sein.",
    setup: "Partner spielt Bälle knapp neben den vorlaufenden Spieler, der sich Richtung Netz bewegt.",
    execution:
      "Kurzer, kontrollierter Schlägerweg, Kontakt vor dem Körper, Ball tief in die Ecke oder scharf angewinkelt spielen – je nachdem, wie weit der Gegner aus der Position gedrängt wurde.",
    coachingCue:
      "Der Volley ist ein Blocken, kein Schlagen – die Bewegung kommt von den Beinen und der Schulterdrehung, nicht vom Arm.",
    reps: "4 Serien à 8 Annäherungen mit anschließendem ersten Volley",
    focusTags: ["Netzspiel", "Volley", "Tiefe"],
    videoQuery: "Patrick Mouratoglou first volley technique tennis net play",
  },
  {
    title: "Splitstep-Timing am Netz",
    category: "VOLLEY",
    difficulty: "BEGINNER",
    situation:
      "Am Netz entscheidet der Splitstep-Moment über Reaktionsfähigkeit – zu früh oder zu spät bedeutet, dass der Volley schon verloren ist, bevor er gespielt wird.",
    setup: "Partner spielt Bälle in unterschiedlichem Tempo auf einen Spieler am Netz.",
    execution:
      "Splitstep exakt im Moment, in dem der Gegner den Ball trifft – nicht davor, nicht danach. Aus der leicht gebeugten Landung sofort in Richtung Ball explodieren.",
    coachingCue:
      "Timing schlägt Schnelligkeit: ein perfekt getimter Splitstep macht auch einen langsameren Spieler reaktionsschnell.",
    reps: "5 Serien à 10 Bälle mit bewusstem Timing-Fokus, kein Schlagfokus",
    focusTags: ["Splitstep", "Reaktionsschnelligkeit", "Netzspiel"],
    videoQuery: "Patrick Mouratoglou split step timing tennis volley",
  },
  {
    title: "Annäherung auf kurze Bälle – Rückhand-Slice-Approach",
    category: "APPROACH",
    difficulty: "INTERMEDIATE",
    situation:
      "Ein kurzer Ball in die Rückhand-Ecke ist die klassische Gelegenheit, mit einem Slice-Approach ans Netz vorzurücken.",
    setup: "Partner spielt gezielt kurze Bälle in die Rückhand-Ecke, du startest von der Grundlinie.",
    execution:
      "Flacher, kontrollierter Slice mit Vorwärtsbewegung zum Netz, Ziel tief in eine Ecke, danach sofort in Splitstep-Position für den ersten Volley kommen.",
    coachingCue:
      "Der Approach muss nicht der Punktgewinn sein – Priorität ist Tiefe und die eigene Position am Netz danach.",
    reps: "4 Serien à 8 kurze Bälle mit anschließendem Vorlaufen",
    focusTags: ["Approach", "Slice", "Netzvorbereitung"],
    videoQuery: "Patrick Mouratoglou slice approach shot tennis net approach",
  },
  {
    title: "Vorhand-Approach Cross-Court",
    category: "APPROACH",
    difficulty: "ADVANCED",
    situation:
      "Ein kurzer Ball in die Vorhand-Ecke erlaubt einen offensiveren Approach mit mehr Tempo als der Slice – ideal, um direkt Druck aufzubauen.",
    setup: "Partner spielt kurze, mittelhohe Bälle in die Vorhand-Ecke.",
    execution:
      "Vorhand mit Topspin cross-court spielen, dabei den Vorwärtsschritt Richtung Netz einbauen, danach Splitstep und Bereitschaft für den ersten Volley.",
    coachingCue:
      "Cross-Court gibt mehr Sicherheitsmarge über das Netz und zwingt den Gegner zum längeren Laufweg als longline.",
    reps: "4 Serien à 8 kurze Bälle, Vorhand-Approach cross-court",
    focusTags: ["Approach", "Vorhand", "Cross-Court"],
    videoQuery: "Patrick Mouratoglou forehand approach shot tennis attacking",
  },
  {
    title: "Recovery-Schritte nach Weitwinkelball",
    category: "FOOTWORK",
    difficulty: "INTERMEDIATE",
    situation:
      "Nach einem Schlag aus einer extremen Position (weit außerhalb der Grundlinie) entscheidet die Rückkehr zur Mitte über die nächste Verteidigungschance.",
    setup: "Partner spielt abwechselnd Bälle an die äußeren Ecken, du kehrst nach jedem Schlag zurück.",
    execution:
      "Nach dem Schlag mit Seitschritten (nicht Drehung und Sprint) zurück Richtung Grundlinienmitte, dabei den Gegner im Blick behalten.",
    coachingCue:
      "Recovery beginnt schon während des Schlags – das hintere Bein leitet die Rückwärtsbewegung ein, nicht erst danach.",
    reps: "5 Serien à 10 Weitwinkelbälle abwechselnd links/rechts",
    focusTags: ["Recovery", "Seitschritte", "Positionsspiel"],
    videoQuery: "Patrick Mouratoglou recovery footwork tennis movement",
  },
  {
    title: "Splitstep-Timing bei Grundlinienduellen",
    category: "FOOTWORK",
    difficulty: "BEGINNER",
    situation:
      "Auch bei Grundlinien-Ballwechseln ist der Splitstep die Basis für schnelle Reaktion auf jeden gegnerischen Schlag.",
    setup: "Cross-Court-Rally zwischen zwei Spielern mit Fokus auf Bewegung statt Schlagqualität.",
    execution:
      "Bei jedem gegnerischen Schlag einen kleinen Splitstep timen, aus der Landung sofort Richtung Ball bewegen.",
    coachingCue:
      "Der Splitstep muss klein und leicht sein – ein zu großer Sprung macht die Reaktion langsamer, nicht schneller.",
    reps: "10 Minuten Rally mit bewusstem Splitstep bei jedem Ballkontakt des Gegners",
    focusTags: ["Splitstep", "Grundlinienspiel", "Reaktionsschnelligkeit"],
    videoQuery: "Patrick Mouratoglou split step tennis footwork basics",
  },
  {
    title: "Muster: 3 Bälle Cross, 1 Longline",
    category: "TACTICS",
    difficulty: "INTERMEDIATE",
    situation:
      "Ein klassisches taktisches Muster, um den Gegner erst zu ermüden bzw. aus der Position zu bringen, bevor man die Richtung wechselt.",
    setup: "Cross-Court-Rally mit vorher festgelegtem Muster: 3 Bälle cross-court, dann gezielt longline spielen.",
    execution:
      "Die ersten 3 Bälle konstant und tief cross-court spielen, um den Gegner in seiner Cross-Position zu halten, dann den 4. Ball longline in die offene Ecke spielen.",
    coachingCue:
      "Der Richtungswechsel funktioniert nur, wenn die vorherigen Bälle wirklich Druck aufgebaut haben – Muster nicht mechanisch abspulen, sondern auf die Ballwechsel-Situation reagieren.",
    reps: "6 Wiederholungen des Musters mit wechselnder Cross-Seite",
    focusTags: ["Taktik", "Richtungswechsel", "Punktmuster"],
    videoQuery: "Patrick Mouratoglou tennis pattern cross court then down the line",
  },
  {
    title: "Aggressive Grundlinienposition (Inside the Baseline)",
    category: "TACTICS",
    difficulty: "ADVANCED",
    situation:
      "Wer konstant 1-2 Meter hinter der Grundlinie steht, gibt dem Gegner Zeit und Raum. Diese Übung trainiert das bewusste Spielen näher an der Linie.",
    setup: "Grundlinien-Rally, bei dem ein Spieler explizit angehalten wird, näher an der Grundlinie zu stehen (max. 50 cm dahinter oder sogar leicht davor).",
    execution:
      "Bälle früher nach dem Aufspringen treffen (auf dem Ansteigen), kürzere Ausholbewegung als gewohnt, dafür mehr Beinarbeit und Rumpfrotation für die Power.",
    coachingCue:
      "Näher an der Linie zu stehen bedeutet automatisch weniger Reaktionszeit – das muss durch frühere Ballerkennung und kompaktere Technik ausgeglichen werden.",
    reps: "8 Minuten Rally mit fester Positionsvorgabe, danach Positionsvergleich besprechen",
    focusTags: ["Aggressive Position", "Frühe Ballannahme", "Taktik"],
    videoQuery: "Patrick Mouratoglou inside the baseline aggressive tennis position",
  },
  {
    title: "Mentale Reset-Routine zwischen Punkten",
    category: "TACTICS",
    difficulty: "BEGINNER",
    situation:
      "Nach einem verlorenen Punkt oder Fehler entscheidet die mentale Reaktion, ob der nächste Punkt frisch angegangen wird oder von Frustration belastet ist.",
    setup: "Trainingsmatch oder Punktespiel, bewusster Fokus auf die Zeit zwischen den Punkten (nicht auf Technik).",
    execution:
      "Nach jedem Punkt: kurzer Blick zum Schläger/Boden (Fokus-Reset), zurück zur Grundlinie gehen, ein bis zwei tiefe Atemzüge, dann bewusst mit einem konkreten Plan für den nächsten Punkt aufschauen.",
    coachingCue:
      "Die 15-20 Sekunden zwischen den Punkten sind trainierbar wie ein Schlag – eine feste Routine verhindert, dass sich Frustration über mehrere Punkte aufbaut.",
    reps: "Während eines kompletten Satzes konsequent nach jedem Punkt anwenden",
    focusTags: ["Mentales Training", "Routine", "Fokus"],
    videoQuery: "Patrick Mouratoglou mental routine between points tennis",
  },
];
