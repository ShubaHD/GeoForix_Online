export type Messages = {
  nav: { projects: string; users: string; map: string; company: string };
  common: {
    logout: string;
    search: string;
    save: string;
    cancel: string;
    delete: string;
    deleting: string;
    code: string;
    name: string;
    client: string;
    boreholes: string;
    back: string;
    notes: string;
    language: string;
    loading: string;
    none: string;
    edit: string;
    add: string;
    fromM: string;
    toM: string;
    depthM: string;
    type: string;
    date: string;
    menu: string;
  };
  login: {
    subtitle: string;
    password: string;
    submit: string;
    loading: string;
    error: string;
    networkError: string;
  };
  explorer: {
    title: string;
    treeHint: string;
    emptyProjects: string;
    emptyBoreholes: string;
  };
  projects: {
    crumb: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    empty: string;
    newProject: string;
    createError: string;
    deleteConfirm: string;
    deleteProject: string;
    topic: string;
    location: string;
    description: string;
    open: string;
  };
  borehole: {
    newBorehole: string;
    empty: string;
    depth: string;
    kilometraj: string;
    tipInstalatie: string;
    intocmit: string;
    categorie: string;
    coords: string;
    latitude: string;
    longitude: string;
    saveMeta: string;
    sections: {
      data: string;
      map: string;
      lithology: string;
      samples: string;
      water: string;
      equipment: string;
      photos: string;
      pmt: string;
      otv: string;
      pp: string;
      vst: string;
      rqd: string;
      fisa: string;
    };
    insituTitles: {
      pmt: string;
      otv: string;
      pp: string;
      vst: string;
      rqd: string;
    };
    lithologyEmpty: string;
    samplesEmpty: string;
    waterEmpty: string;
    equipmentEmpty: string;
    photosEmpty: string;
    insituEmpty: string;
    consistency: string;
    sandCompaction: string;
    color: string;
    sptValues: string;
    duringM: string;
    after24hM: string;
    photoName: string;
    uploadPhotos: string;
    takePhoto: string;
    pickFromGallery: string;
    downloadFisa: string;
    downloadCsv: string;
    fisaLang: string;
    fisaWarningsTitle: string;
    fisaWarningsHint: string;
    fisaDownloadAnyway: string;
    warnings: {
      noPhotos: string;
      noLayers: string;
      noDepth: string;
      noCoords: string;
      sampleDeeper: string;
      equipmentDeeper: string;
      equipmentDeeperGeneric: string;
      layerDeeper: string;
      waterDeeper: string;
      insituDeeper: string;
      layersShort: string;
      layerInverted: string;
      layerOverlap: string;
    };
    deleteLayer: string;
    deleteSample: string;
    deleteWater: string;
    deleteEquipment: string;
    deletePhoto: string;
    useMyLocation: string;
    setOnMap: string;
    openGoogleMaps: string;
  };
  map: {
    title: string;
    subtitle: string;
    pickHint: string;
    pointsCount: string;
    satellite: string;
    openBorehole: string;
  };
  admin: {
    usersTitle: string;
    usersSubtitle: string;
    email: string;
    role: string;
    newUser: string;
    password: string;
    companyTitle: string;
    companySubtitle: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    companyVat: string;
    companyLogo: string;
    removeLogo: string;
    logoHint: string;
    companySaved: string;
  };
  roles: { ADMIN: string; FIELD: string };
  pdf: {
    title: string;
    project: string;
    topic: string;
    location: string;
    client: string;
    borehole: string;
    depth: string;
    coords: string;
    kilometraj: string;
    tipInstalatie: string;
    intocmit: string;
    categorie: string;
    lithology: string;
    samples: string;
    water: string;
    equipment: string;
    photos: string;
    noEntries: string;
    fromM: string;
    toM: string;
    type: string;
    consistency: string;
    color: string;
    notes: string;
    depthM: string;
    spt: string;
    nspt: string;
    date: string;
    during: string;
    after24h: string;
    description: string;
    legend: string;
    colDepth: string;
    colLithology: string;
    colDesc: string;
    colSpt: string;
    colSamples: string;
    waterDuring: string;
    waterAfter24h: string;
    syntheticSubtitle: string;
    logContinued: string;
    pmt: string;
    otv: string;
    pp: string;
    vst: string;
    rqd: string;
  };
};

const ro: Messages = {
  nav: { projects: "Proiecte", users: "Utilizatori", map: "Hartă", company: "Firmă" },
  common: {
    logout: "Ieșire",
    search: "Caută",
    save: "Salvează",
    cancel: "Anulează",
    delete: "Șterge",
    deleting: "Se șterge…",
    code: "Cod",
    name: "Nume",
    client: "Client",
    boreholes: "Foraje",
    back: "Înapoi",
    notes: "Observații",
    language: "Limbă",
    loading: "Se încarcă…",
    none: "—",
    edit: "Editează",
    add: "Adaugă",
    fromM: "De la (m)",
    toM: "Până la (m)",
    depthM: "Adâncime (m)",
    type: "Tip",
    date: "Dată",
    menu: "Meniu",
  },
  login: {
    subtitle: "Fișe de foraj pe teren — acces securizat",
    password: "Parolă",
    submit: "Autentificare",
    loading: "Se autentifică…",
    error: "Email sau parolă invalidă",
    networkError:
      "Nu pot contacta serverul. Reîncarcă pagina (F5) și verifică că rulează npm run dev pe http://localhost:3000",
  },
  explorer: {
    title: "Explorer",
    treeHint: "Proiect → Foraj",
    emptyProjects: "Niciun proiect",
    emptyBoreholes: "Niciun foraj",
  },
  projects: {
    crumb: "Proiecte",
    title: "Proiecte",
    subtitle: "Proiect → Foraj → litologie, probe, apă, echipament, foto, fișă PDF.",
    searchPlaceholder: "Caută cod, nume, client…",
    empty: "Niciun proiect. Creați unul nou.",
    newProject: "+ Proiect nou",
    createError: "Eroare la creare",
    deleteConfirm: "Ștergeți proiectul și toate forajele?",
    deleteProject: "Șterge proiect",
    topic: "Temă",
    location: "Locație",
    description: "Descriere",
    open: "Deschide",
  },
  borehole: {
    newBorehole: "+ Foraj nou",
    empty: "Niciun foraj. Adăugați unul.",
    depth: "Adâncime (m)",
    kilometraj: "Kilometraj",
    tipInstalatie: "Tip instalație",
    intocmit: "Întocmit",
    categorie: "Categorie",
    coords: "Coordonate WGS84",
    latitude: "Latitudine",
    longitude: "Longitudine",
    saveMeta: "Salvează date foraj",
    sections: {
      data: "Date",
      map: "GPS / Hartă",
      lithology: "Litologie",
      samples: "Probe",
      water: "Apă",
      equipment: "Echipament",
      photos: "Foto",
      pmt: "PMT",
      otv: "OTV",
      pp: "PP",
      vst: "VST",
      rqd: "RQD",
      fisa: "Fișă PDF",
    },
    insituTitles: {
      pmt: "PMT — Test presiometric",
      otv: "OTV — Televiewer optic / acustic",
      pp: "PP — Penetrometru de buzunar",
      vst: "VST — Forfecare cu palete (vane)",
      rqd: "RQD — Calitate carotă (RQD / TCR / SCR)",
    },
    lithologyEmpty: "Nicio stratificare.",
    samplesEmpty: "Nicio probă.",
    waterEmpty: "Niciun nivel de apă.",
    equipmentEmpty: "Niciun echipament.",
    photosEmpty: "Nicio fotografie.",
    insituEmpty: "Nicio înregistrare.",
    consistency: "Consistență",
    sandCompaction: "Indesare",
    color: "Culoare",
    sptValues: "Valori SPT",
    duringM: "În timpul (m)",
    after24hM: "După 24h (m)",
    photoName: "Denumire",
    uploadPhotos: "Încarcă foto",
    takePhoto: "Fă o poză",
    pickFromGallery: "Alege din galerie",
    downloadFisa: "Descarcă fișa PDF",
    downloadCsv: "Descarcă CSV (import)",
    fisaLang: "Limba raportului",
    fisaWarningsTitle: "Avertismente înainte de PDF",
    fisaWarningsHint:
      "Poți genera totuși fișa, dar verifică datele marcate mai jos.",
    fisaDownloadAnyway: "Generează oricum",
    warnings: {
      noPhotos: "Nu există fotografii atașate forajului.",
      noLayers: "Nu există straturi de litologie.",
      noDepth: "Adâncimea forajului nu este setată.",
      noCoords: "Coordonatele GPS lipsesc.",
      sampleDeeper:
        "Proba „{type}” la {depth} m depășește adâncimea forajului ({limit} m).",
      equipmentDeeper:
        "Tubaj/echipament „{type}” până la {depth} m depășește forajul ({limit} m).",
      equipmentDeeperGeneric:
        "Echipament „{type}” până la {depth} m depășește forajul ({limit} m).",
      layerDeeper:
        "Strat „{type}” ({from}–{to} m) depășește adâncimea forajului ({limit} m).",
      waterDeeper:
        "Nivel de apă ({which}) la {depth} m depășește forajul ({limit} m).",
      insituDeeper:
        "Test {test} până la {depth} m depășește forajul ({limit} m).",
      layersShort:
        "Litologia se oprește la {layerTo} m, dar forajul are {limit} m.",
      layerInverted: "Strat „{type}” are interval inversat ({from} > {to}).",
      layerOverlap: "Straturi care se suprapun parțial: {a} m și {b} m.",
    },
    deleteLayer: "Șterge strat",
    deleteSample: "Șterge probă",
    deleteWater: "Șterge nivel",
    deleteEquipment: "Șterge echipament",
    deletePhoto: "Șterge foto",
    useMyLocation: "Folosește locația dispozitivului",
    setOnMap: "Click pe hartă pentru a seta punctul",
    openGoogleMaps: "Deschide în Google Maps",
  },
  map: {
    title: "Hartă foraje",
    subtitle: "Toate punctele cu coordonate. Satelit (Esri) sau OSM; link Google Maps pe fiecare marker.",
    pickHint: "Click pe hartă pentru a plasa / muta punctul forajului.",
    pointsCount: "{count} puncte pe hartă",
    satellite: "Satelit",
    openBorehole: "Deschide foraj",
  },
  admin: {
    usersTitle: "Utilizatori",
    usersSubtitle: "Conturi de acces GeoForix Online.",
    email: "Email",
    role: "Rol",
    newUser: "+ Utilizator nou",
    password: "Parolă",
    companyTitle: "Date firmă",
    companySubtitle:
      "Logo și date de contact afișate în antetul fișei PDF de foraj.",
    companyName: "Denumire firmă",
    companyAddress: "Adresă",
    companyPhone: "Telefon",
    companyEmail: "Email firmă",
    companyWebsite: "Website",
    companyVat: "CUI / CIF",
    companyLogo: "Logo",
    removeLogo: "Șterge logo",
    logoHint: "PNG, JPG sau WEBP. Apare în colțul stâng al fișei PDF.",
    companySaved: "Salvat.",
  },
  roles: { ADMIN: "ADMIN", FIELD: "TEREN" },
  pdf: {
    title: "FIȘĂ FORAJ",
    project: "Proiect",
    topic: "Temă",
    location: "Locație",
    client: "Client",
    borehole: "FORAJ",
    depth: "Adâncime",
    coords: "Coordonate",
    kilometraj: "Kilometraj",
    tipInstalatie: "Tip instalație",
    intocmit: "Întocmit",
    categorie: "Categorie",
    lithology: "LITOLOGIE",
    samples: "PROBE",
    water: "NIVELE APĂ",
    equipment: "ECHIPAMENT",
    photos: "ANEXE — FOTOGRAFII",
    noEntries: "Nicio intrare",
    fromM: "De la (m)",
    toM: "Până la (m)",
    type: "Tip",
    consistency: "Consistență",
    color: "Culoare",
    notes: "Observații",
    depthM: "Adâncime (m)",
    spt: "Valori SPT",
    nspt: "Nspt",
    date: "Dată",
    during: "În timpul (m)",
    after24h: "După 24h (m)",
    description: "Descriere",
    legend: "Legendă litologică",
    colDepth: "Adânc. (m)",
    colLithology: "Litologie",
    colDesc: "Descriere strat",
    colSpt: "SPT N",
    colSamples: "Probe / Apă",
    waterDuring: "W — în timpul forajului",
    waterAfter24h: "W24 — după 24h",
    syntheticSubtitle: "Fișă geotehnică sintetică",
    logContinued: "continuare {from}–{to} m",
    pmt: "PMT",
    otv: "OTV / Acustic",
    pp: "Pocket penetrometer",
    vst: "Vane shear (VST)",
    rqd: "RQD / TCR / SCR",
  },
};

const en: Messages = {
  nav: { projects: "Projects", users: "Users", map: "Map", company: "Company" },
  common: {
    logout: "Log out",
    search: "Search",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting…",
    code: "Code",
    name: "Name",
    client: "Client",
    boreholes: "Boreholes",
    back: "Back",
    notes: "Notes",
    language: "Language",
    loading: "Loading…",
    none: "—",
    edit: "Edit",
    add: "Add",
    fromM: "From (m)",
    toM: "To (m)",
    depthM: "Depth (m)",
    type: "Type",
    date: "Date",
    menu: "Menu",
  },
  login: {
    subtitle: "Field borehole logs — secure access",
    password: "Password",
    submit: "Sign in",
    loading: "Signing in…",
    error: "Invalid email or password",
    networkError:
      "Cannot reach the server. Reload (F5) and check that npm run dev is running on http://localhost:3000",
  },
  explorer: {
    title: "Explorer",
    treeHint: "Project → Borehole",
    emptyProjects: "No projects",
    emptyBoreholes: "No boreholes",
  },
  projects: {
    crumb: "Projects",
    title: "Projects",
    subtitle: "Project → Borehole → lithology, samples, water, equipment, photos, PDF log.",
    searchPlaceholder: "Search code, name, client…",
    empty: "No projects. Create one.",
    newProject: "+ New project",
    createError: "Could not create",
    deleteConfirm: "Delete project and all boreholes?",
    deleteProject: "Delete project",
    topic: "Topic",
    location: "Location",
    description: "Description",
    open: "Open",
  },
  borehole: {
    newBorehole: "+ New borehole",
    empty: "No boreholes. Add one.",
    depth: "Depth (m)",
    kilometraj: "Chainage",
    tipInstalatie: "Rig type",
    intocmit: "Prepared by",
    categorie: "Category",
    coords: "WGS84 coordinates",
    latitude: "Latitude",
    longitude: "Longitude",
    saveMeta: "Save borehole data",
    sections: {
      data: "Data",
      map: "GPS / Map",
      lithology: "Lithology",
      samples: "Samples",
      water: "Water",
      equipment: "Equipment",
      photos: "Photos",
      pmt: "PMT",
      otv: "OTV",
      pp: "PP",
      vst: "VST",
      rqd: "RQD",
      fisa: "PDF log",
    },
    insituTitles: {
      pmt: "PMT — Pressuremeter test",
      otv: "OTV — Optical / acoustic televiewer",
      pp: "PP — Pocket penetrometer",
      vst: "VST — Vane shear test",
      rqd: "RQD — Core quality (RQD / TCR / SCR)",
    },
    lithologyEmpty: "No layers.",
    samplesEmpty: "No samples.",
    waterEmpty: "No water levels.",
    equipmentEmpty: "No equipment.",
    photosEmpty: "No photos.",
    insituEmpty: "No readings.",
    consistency: "Consistency",
    sandCompaction: "Compaction",
    color: "Colour",
    sptValues: "SPT values",
    duringM: "During (m)",
    after24hM: "After 24h (m)",
    photoName: "Caption",
    uploadPhotos: "Upload photos",
    takePhoto: "Take a photo",
    pickFromGallery: "Choose from gallery",
    downloadFisa: "Download PDF log",
    downloadCsv: "Download CSV (import)",
    fisaLang: "Report language",
    fisaWarningsTitle: "Warnings before PDF",
    fisaWarningsHint:
      "You can still generate the sheet, but please review the items below.",
    fisaDownloadAnyway: "Generate anyway",
    warnings: {
      noPhotos: "No photos are attached to this borehole.",
      noLayers: "No lithology layers recorded.",
      noDepth: "Borehole depth is not set.",
      noCoords: "GPS coordinates are missing.",
      sampleDeeper:
        "Sample “{type}” at {depth} m is deeper than the borehole ({limit} m).",
      equipmentDeeper:
        "Casing/equipment “{type}” to {depth} m exceeds borehole depth ({limit} m).",
      equipmentDeeperGeneric:
        "Equipment “{type}” to {depth} m exceeds borehole depth ({limit} m).",
      layerDeeper:
        "Layer “{type}” ({from}–{to} m) exceeds borehole depth ({limit} m).",
      waterDeeper:
        "Water level ({which}) at {depth} m exceeds borehole depth ({limit} m).",
      insituDeeper:
        "{test} test to {depth} m exceeds borehole depth ({limit} m).",
      layersShort:
        "Lithology ends at {layerTo} m but borehole depth is {limit} m.",
      layerInverted: "Layer “{type}” has inverted interval ({from} > {to}).",
      layerOverlap: "Partially overlapping layers: {a} m and {b} m.",
    },
    deleteLayer: "Delete layer",
    deleteSample: "Delete sample",
    deleteWater: "Delete water level",
    deleteEquipment: "Delete equipment",
    deletePhoto: "Delete photo",
    useMyLocation: "Use device location",
    setOnMap: "Click the map to set the point",
    openGoogleMaps: "Open in Google Maps",
  },
  map: {
    title: "Borehole map",
    subtitle: "All points with coordinates. Satellite (Esri) or OSM; Google Maps link on each marker.",
    pickHint: "Click the map to place / move the borehole point.",
    pointsCount: "{count} points on map",
    satellite: "Satellite",
    openBorehole: "Open borehole",
  },
  admin: {
    usersTitle: "Users",
    usersSubtitle: "GeoForix Online accounts.",
    email: "Email",
    role: "Role",
    newUser: "+ New user",
    password: "Password",
    companyTitle: "Company details",
    companySubtitle: "Logo and contact details shown on the borehole PDF header.",
    companyName: "Company name",
    companyAddress: "Address",
    companyPhone: "Phone",
    companyEmail: "Company email",
    companyWebsite: "Website",
    companyVat: "VAT / Tax ID",
    companyLogo: "Logo",
    removeLogo: "Remove logo",
    logoHint: "PNG, JPG or WEBP. Shown in the left corner of the PDF sheet.",
    companySaved: "Saved.",
  },
  roles: { ADMIN: "ADMIN", FIELD: "FIELD" },
  pdf: {
    title: "BOREHOLE LOG",
    project: "Project",
    topic: "Topic",
    location: "Location",
    client: "Client",
    borehole: "BOREHOLE",
    depth: "Depth",
    coords: "Coordinates",
    kilometraj: "Chainage",
    tipInstalatie: "Rig type",
    intocmit: "Prepared by",
    categorie: "Category",
    lithology: "LITHOLOGY",
    samples: "SAMPLES",
    water: "WATER LEVELS",
    equipment: "EQUIPMENT",
    photos: "ANNEX — PHOTOS",
    noEntries: "No entries",
    fromM: "From (m)",
    toM: "To (m)",
    type: "Type",
    consistency: "Consistency",
    color: "Colour",
    notes: "Notes",
    depthM: "Depth (m)",
    spt: "SPT values",
    nspt: "N-SPT",
    date: "Date",
    during: "During (m)",
    after24h: "After 24h (m)",
    description: "Description",
    legend: "Lithology legend",
    colDepth: "Depth (m)",
    colLithology: "Lithology",
    colDesc: "Layer description",
    colSpt: "SPT N",
    colSamples: "Samples / Water",
    waterDuring: "W — during drilling",
    waterAfter24h: "W24 — after 24h",
    syntheticSubtitle: "Synthetic geotechnical log",
    logContinued: "continued {from}–{to} m",
    pmt: "PMT",
    otv: "OTV / Acoustic",
    pp: "Pocket penetrometer",
    vst: "Vane shear (VST)",
    rqd: "RQD / TCR / SCR",
  },
};

const de: Messages = {
  nav: { projects: "Projekte", users: "Benutzer", map: "Karte", company: "Firma" },
  common: {
    logout: "Abmelden",
    search: "Suchen",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    deleting: "Wird gelöscht…",
    code: "Code",
    name: "Name",
    client: "Auftraggeber",
    boreholes: "Bohrungen",
    back: "Zurück",
    notes: "Bemerkungen",
    language: "Sprache",
    loading: "Laden…",
    none: "—",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    fromM: "Von (m)",
    toM: "Bis (m)",
    depthM: "Tiefe (m)",
    type: "Art",
    date: "Datum",
    menu: "Menü",
  },
  login: {
    subtitle: "Bohrprofile im Feld — geschützter Zugang",
    password: "Passwort",
    submit: "Anmelden",
    loading: "Anmeldung…",
    error: "Ungültige E-Mail oder Passwort",
    networkError:
      "Server nicht erreichbar. Seite neu laden (F5) und prüfen, ob npm run dev auf http://localhost:3000 läuft",
  },
  explorer: {
    title: "Explorer",
    treeHint: "Projekt → Bohrung",
    emptyProjects: "Keine Projekte",
    emptyBoreholes: "Keine Bohrungen",
  },
  projects: {
    crumb: "Projekte",
    title: "Projekte",
    subtitle: "Projekt → Bohrung → Lithologie, Proben, Wasser, Ausbau, Fotos, PDF.",
    searchPlaceholder: "Code, Name, Auftraggeber…",
    empty: "Keine Projekte. Legen Sie eines an.",
    newProject: "+ Neues Projekt",
    createError: "Anlegen fehlgeschlagen",
    deleteConfirm: "Projekt und alle Bohrungen löschen?",
    deleteProject: "Projekt löschen",
    topic: "Thema",
    location: "Standort",
    description: "Beschreibung",
    open: "Öffnen",
  },
  borehole: {
    newBorehole: "+ Neue Bohrung",
    empty: "Keine Bohrungen. Fügen Sie eine hinzu.",
    depth: "Tiefe (m)",
    kilometraj: "Kilometrierung",
    tipInstalatie: "Bohrgerät",
    intocmit: "Erstellt von",
    categorie: "Kategorie",
    coords: "WGS84-Koordinaten",
    latitude: "Breite",
    longitude: "Länge",
    saveMeta: "Bohrdaten speichern",
    sections: {
      data: "Daten",
      map: "GPS / Karte",
      lithology: "Lithologie",
      samples: "Proben",
      water: "Wasser",
      equipment: "Ausbau",
      photos: "Fotos",
      pmt: "PMT",
      otv: "OTV",
      pp: "PP",
      vst: "VST",
      rqd: "RQD",
      fisa: "PDF-Profil",
    },
    insituTitles: {
      pmt: "PMT — Pressiometerversuch",
      otv: "OTV — Optischer / akustischer Televiewer",
      pp: "PP — Taschenpenetrometer",
      vst: "VST — Flügelscherversuch",
      rqd: "RQD — Kernqualität (RQD / TCR / SCR)",
    },
    lithologyEmpty: "Keine Schichten.",
    samplesEmpty: "Keine Proben.",
    waterEmpty: "Keine Wasserstände.",
    equipmentEmpty: "Kein Ausbau.",
    photosEmpty: "Keine Fotos.",
    insituEmpty: "Keine Einträge.",
    consistency: "Konsistenz",
    sandCompaction: "Lagerungsdichte",
    color: "Farbe",
    sptValues: "SPT-Werte",
    duringM: "Während (m)",
    after24hM: "Nach 24h (m)",
    photoName: "Bezeichnung",
    uploadPhotos: "Fotos hochladen",
    takePhoto: "Foto aufnehmen",
    pickFromGallery: "Aus Galerie wählen",
    downloadFisa: "PDF-Profil herunterladen",
    downloadCsv: "CSV herunterladen (Import)",
    fisaLang: "Berichtssprache",
    fisaWarningsTitle: "Hinweise vor dem PDF",
    fisaWarningsHint:
      "Sie können das Blatt trotzdem erzeugen — bitte prüfen Sie die Punkte unten.",
    fisaDownloadAnyway: "Trotzdem erzeugen",
    warnings: {
      noPhotos: "Keine Fotos an dieser Bohrung.",
      noLayers: "Keine lithologischen Schichten erfasst.",
      noDepth: "Bohrtiefe ist nicht gesetzt.",
      noCoords: "GPS-Koordinaten fehlen.",
      sampleDeeper:
        "Probe „{type}“ bei {depth} m ist tiefer als die Bohrung ({limit} m).",
      equipmentDeeper:
        "Verrohrung/Ausbau „{type}“ bis {depth} m überschreitet die Bohrtiefe ({limit} m).",
      equipmentDeeperGeneric:
        "Ausbau „{type}“ bis {depth} m überschreitet die Bohrtiefe ({limit} m).",
      layerDeeper:
        "Schicht „{type}“ ({from}–{to} m) überschreitet die Bohrtiefe ({limit} m).",
      waterDeeper:
        "Wasserstand ({which}) bei {depth} m überschreitet die Bohrtiefe ({limit} m).",
      insituDeeper:
        "{test}-Versuch bis {depth} m überschreitet die Bohrtiefe ({limit} m).",
      layersShort:
        "Lithologie endet bei {layerTo} m, Bohrtiefe ist {limit} m.",
      layerInverted: "Schicht „{type}“ hat umgekehrtes Intervall ({from} > {to}).",
      layerOverlap: "Teilweise überlappende Schichten: {a} m und {b} m.",
    },
    deleteLayer: "Schicht löschen",
    deleteSample: "Probe löschen",
    deleteWater: "Wasserstand löschen",
    deleteEquipment: "Ausbau löschen",
    deletePhoto: "Foto löschen",
    useMyLocation: "Gerätestandort verwenden",
    setOnMap: "Klicken Sie auf die Karte, um den Punkt zu setzen",
    openGoogleMaps: "In Google Maps öffnen",
  },
  map: {
    title: "Bohrungskarte",
    subtitle: "Alle Punkte mit Koordinaten. Satellit (Esri) oder OSM; Google-Maps-Link je Marker.",
    pickHint: "Klicken Sie auf die Karte, um den Bohrpunkt zu setzen/zu verschieben.",
    pointsCount: "{count} Punkte auf der Karte",
    satellite: "Satellit",
    openBorehole: "Bohrung öffnen",
  },
  admin: {
    usersTitle: "Benutzer",
    usersSubtitle: "Zugänge zu GeoForix Online.",
    email: "E-Mail",
    role: "Rolle",
    newUser: "+ Neuer Benutzer",
    password: "Passwort",
    companyTitle: "Firmendaten",
    companySubtitle:
      "Logo und Kontaktdaten im Kopf der Bohrprofil-PDF.",
    companyName: "Firmenname",
    companyAddress: "Adresse",
    companyPhone: "Telefon",
    companyEmail: "Firmen-E-Mail",
    companyWebsite: "Website",
    companyVat: "USt-IdNr.",
    companyLogo: "Logo",
    removeLogo: "Logo entfernen",
    logoHint: "PNG, JPG oder WEBP. Links oben auf dem PDF-Blatt.",
    companySaved: "Gespeichert.",
  },
  roles: { ADMIN: "ADMIN", FIELD: "FELD" },
  pdf: {
    title: "BOHRPROFIL",
    project: "Projekt",
    topic: "Thema",
    location: "Standort",
    client: "Auftraggeber",
    borehole: "BOHRUNG",
    depth: "Tiefe",
    coords: "Koordinaten",
    kilometraj: "Kilometrierung",
    tipInstalatie: "Bohrgerät",
    intocmit: "Erstellt von",
    categorie: "Kategorie",
    lithology: "LITHOLOGIE",
    samples: "PROBEN",
    water: "WASSERSTÄNDE",
    equipment: "AUSBAU",
    photos: "ANHANG — FOTOS",
    noEntries: "Keine Einträge",
    fromM: "Von (m)",
    toM: "Bis (m)",
    type: "Art",
    consistency: "Konsistenz",
    color: "Farbe",
    notes: "Bemerkungen",
    depthM: "Tiefe (m)",
    spt: "SPT-Werte",
    nspt: "N-SPT",
    date: "Datum",
    during: "Während (m)",
    after24h: "Nach 24h (m)",
    description: "Beschreibung",
    legend: "Lithologie-Legende",
    colDepth: "Tiefe (m)",
    colLithology: "Lithologie",
    colDesc: "Schichtbeschreibung",
    colSpt: "SPT N",
    colSamples: "Proben / Wasser",
    waterDuring: "W — während Bohrung",
    waterAfter24h: "W24 — nach 24h",
    syntheticSubtitle: "Synthetisches geotechnisches Profil",
    logContinued: "Fortsetzung {from}–{to} m",
    pmt: "PMT",
    otv: "OTV / Akustik",
    pp: "Taschenpenetrometer",
    vst: "Flügelscherversuch (VST)",
    rqd: "RQD / TCR / SCR",
  },
};

const dictionaries: Record<"ro" | "en" | "de", Messages> = { ro, en, de };

export function getMessages(locale: "ro" | "en" | "de"): Messages {
  return dictionaries[locale];
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}
