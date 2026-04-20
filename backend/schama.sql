
CREATE TABLE IF NOT EXISTS aerei (
    id SERIAL PRIMARY KEY, -- ID univoco dell'aereo
    capienza INTEGER NOT NULL, -- Numero massimo di passeggeri
    stato BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = operativo, FALSE = manutenzione
    modello VARCHAR(255) NOT NULL -- Modello dell'aereo
);

CREATE TABLE IF NOT EXISTS aeroporti (
    id SERIAL PRIMARY KEY, -- ID univoco dell'aeroporto
    nome VARCHAR(255) NOT NULL, -- Nome dell'aeroporto
    citta VARCHAR(255) NOT NULL, -- CittÃ  dell'aeroporto
)

CREATE TABLE IF NOT EXISTS gates (
    id SERIAL PRIMARY KEY, -- ID univoco del gate
    numero VARCHAR(255) NOT NULL, -- Numero del gate
    aeroporto_id INTEGER NOT NULL, -- ID dell'aeroporto
    FOREIGN KEY (aeroporto_id) REFERENCES aeroporti(id)
)

CREATE TABLE IF NOT EXISTS voli (
    id SERIAL PRIMARY KEY, -- ID univoco della tratta
    aeroporto_partenza_id INTEGER NOT NULL, -- ID dell'aeroporto di partenza
    aeroporto_arrivo_id INTEGER NOT NULL, -- ID dell'aeroporto di arrivo
    data_partenza DATE NOT NULL, -- Data di partenza
	data_arrivo DATE NOT NULL, -- Data di arrivo
    ora_partenza TIME NOT NULL, -- Ora di partenza
    ora_arrivo TIME NOT NULL, -- Ora di arrivo
	FOREIGN KEY (aeroporto_partenza_id) REFERENCES aeroporti(id), 
    FOREIGN KEY (aeroporto_arrivo_id) REFERENCES aeroporti(id)
)

CREATE TABLE IF NOT EXISTS tratte (
    id SERIAL PRIMARY KEY, -- ID univoco del volo
    volo_id INTEGER NOT NULL, -- ID della tratta
    aereo_id INTEGER NOT NULL, -- ID dell'aereo
    FOREIGN KEY (volo_id) REFERENCES voli(id),
    FOREIGN KEY (aereo_id) REFERENCES aerei(id) 
)

CREATE TABLE IF NOT EXISTS passeggeri (
    id SERIAL PRIMARY KEY, -- ID univoco del passeggero
    nome VARCHAR(255) NOT NULL, -- Nome del passeggero
    cognome VARCHAR(255) NOT NULL, -- Cognome del passeggero
    email VARCHAR(255) NOT NULL, -- Email del passeggero
    telefono VARCHAR(255) NOT NULL, -- Telefono del passeggero
)

CREATE TABLE IF NOT EXISTS prenotazioni (
	id SERIAL PRIMARY KEY, -- ID univoco della prenotazione
	passeggero_id INTEGER NOT NULL, -- ID dell'utente
	volo_id INTEGER NOT NULL, -- ID della tratta
	data_prenotazione DATE NOT NULL, -- Data della prenotazione
	prezzo DECIMAL(10, 2) NOT NULL, -- Prezzo della prenotazione
	posto VARCHAR(255) NOT NULL, -- Posto della prenotazione
	classe VARCHAR(255) NOT NULL, -- Classe della prenotazione
	tipo_bagaglio VARCHAR(255) NOT NULL, -- Tipo di bagaglio
	FOREIGN KEY (passeggero_id) REFERENCES passeggeri(id),
	FOREIGN KEY (volo_id) REFERENCES voli(id)
)

