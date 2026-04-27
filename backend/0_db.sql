-- Schema del Database (come fornito)
-- Tabella Aerei
CREATE TABLE IF NOT EXISTS aerei (
    id SERIAL PRIMARY KEY,
    capienza INTEGER NOT NULL,
    stato BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = operativo, FALSE = manutenzione
    modello VARCHAR(255) NOT NULL
);

-- Tabella Aeroporti
CREATE TABLE IF NOT EXISTS aeroporti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    citta VARCHAR(255) NOT NULL
);

-- Tabella Gates
CREATE TABLE IF NOT EXISTS gates (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(255) NOT NULL,
    aeroporto_id INTEGER NOT NULL REFERENCES aeroporti(id)
);

-- Tabella Voli
CREATE TABLE IF NOT EXISTS voli (
    id SERIAL PRIMARY KEY,
    aeroporto_partenza_id INTEGER NOT NULL REFERENCES aeroporti(id),
    aeroporto_arrivo_id INTEGER NOT NULL REFERENCES aeroporti(id),
    aereo_id INTEGER NOT NULL REFERENCES aerei(id),
    data_partenza DATE NOT NULL,
    data_arrivo DATE NOT NULL,
    ora_partenza TIME NOT NULL,
    ora_arrivo TIME NOT NULL,
    prezzo_base DECIMAL(10, 2) NOT NULL,
    stato VARCHAR(50) NOT NULL DEFAULT 'Scheduled' -- 'On Time', 'Delayed', 'Scheduled', 'Departed'
);

-- Tabella Analytics (for Admin Panel)
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    valore VARCHAR(255) NOT NULL,
    variazione VARCHAR(50),
    icona VARCHAR(50),
    colore VARCHAR(50),
    bg_colore VARCHAR(50),
    categoria VARCHAR(50) -- 'stats', 'revenue_trend', etc.
);

-- Tabella Utenti
CREATE TABLE IF NOT EXISTS utenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(255),
    ruolo VARCHAR(50) NOT NULL DEFAULT 'user' -- 'user' o 'admin'
);

-- Tabella Prenotazioni
CREATE TABLE IF NOT EXISTS prenotazioni (
    id SERIAL PRIMARY KEY,
    utente_id INTEGER NOT NULL REFERENCES utenti(id),
    volo_id INTEGER NOT NULL REFERENCES voli(id),
    data_prenotazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prezzo_finale DECIMAL(10, 2) NOT NULL,
    posto VARCHAR(10) NOT NULL,
    classe VARCHAR(50) NOT NULL, -- es. 'Economy', 'Business'
    tipo_bagaglio VARCHAR(50) NOT NULL,
    UNIQUE(volo_id, posto)
);

CREATE TABLE IF NOT EXISTS passeggeri (
    id SERIAL PRIMARY KEY,
    prenotazione_id INTEGER NOT NULL REFERENCES prenotazioni(id),
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    data_nascita DATE,
    nazionalita VARCHAR(255),
    UNIQUE(prenotazione_id, nome, cognome)
);
