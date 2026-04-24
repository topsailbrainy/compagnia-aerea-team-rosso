export type Aereo = {
    id: number;
    capienza: number;
    stato: boolean;
    modello: string;
}

export type Aeroporto = {
    id: number;
    nome: string;
    citta: string;
}

export type Gate = {
    id: number;
    numero: string;
    aeroporto_id: number;
}

export type Volo = {
    id: number;
    aeroporto_partenza_id: number;
    aeroporto_arrivo_id: number;
    aereo_id: number;
    data_partenza: string;
    data_arrivo: string;
    ora_partenza: string;
    ora_arrivo: string;
    prezzo_base: number;
}

export type Utente = {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    password?: string;
    telefono?: string;
    ruolo: 'user' | 'admin';
}

export type Prenotazione = {
    id: number;
    utente_id: number;
    volo_id: number;
    data_prenotazione: string;
    prezzo_finale: number;
    posto: string;
    classe: string;
    tipo_bagaglio: string;
}
