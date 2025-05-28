import axios from 'axios';


const API_BASE_URL = 'http://localhost:8000';

export interface Message {
    id: string;
    timestamp: string;
    direction: 'SENT' | 'RECEIVED';
    content: string;
}


export interface ConversationListItem {
    id: string;
    status: 'OPEN' | 'CLOSED';
    initiated_at: string; 
}


export interface ConversationDetail extends ConversationListItem {
    messages: Message[];
}


export const getConversations = async (): Promise<ConversationListItem[]> => {
    try {
    const response = await axios.get<ConversationListItem[]>(`${API_BASE_URL}/conversations/`);
    return response.data;
    } catch (error) {
    console.error("Erro ao buscar lista de conversas:", error);
    return []; 
    }
};


export const getConversationById = async (id: string): Promise<ConversationDetail> => {
    try {
    const response = await axios.get<ConversationDetail>(`${API_BASE_URL}/conversations/${id}/`);
    return response.data;
    } catch (error) {
    console.error(`Erro ao buscar conversa com ID ${id}:`, error);
    throw error;
    }
};