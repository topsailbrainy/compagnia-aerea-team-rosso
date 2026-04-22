export type Aereo = {
    id: string;
    capienza: number;
    stato: boolean;
    modello: string;
}

export type Aeroporto = {
    id: string;
    nome: string;
    citta: string;
}

export type Gate = {
    id: string;
    numero: string;
    aeroporto_id: string;
}

export type Volo = {
    id: string;
    aeroporto_partenza_id: string;
    aeroporto_arrivo_id: string;
    data_partenza: string;
    data_arrivo: string;
    ora_partenza: string;
    ora_arrivo: string;
}

export type Tratta = {
    id: string;
    volo_id: string;
    aereo_id: string;
}

export type Passeggero = {
    id: string;
    nome: string;
    cognome: string;
    email: string;
    telefono: string;
}

export type Prenotazione = {
    id: string;
    passeggero_id: string;
    volo_id: string;
    data_prenotazione: string;
    prezzo: number;
    posto: string;
    classe: string;
    tipo_bagaglio: string;
}
