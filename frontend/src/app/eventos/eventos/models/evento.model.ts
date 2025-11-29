export interface Evento {
  id?: string;
  titulo: string;
  descricao?: string;
  dataEvento: string; // ISO string
  tipo: string;
  cor?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  userId: string;
}

export interface EventoList {
  id: string;
  titulo: string;
  descricao?: string;
  dataEvento: string;
  tipo: string;
  cor?: string;
}