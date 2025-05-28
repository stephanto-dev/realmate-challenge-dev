import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversationById } from '../services/api';
import type { ConversationDetail, Message} from "../services/api"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatToBrazilianDateTimeWithFns } from '@/lib/utils';

const POLLING_INTERVAL_DETAIL = 5000;

const ConversationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [conversation, setConversation] = useState<ConversationDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversationDetails = useCallback(async (isInitialLoad = false) => {
        if (!id) {
            setError("ID da conversa não fornecido.");
            setIsLoading(false);
            return;
        }
        if (isInitialLoad) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const data = await getConversationById(id);
            setConversation(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
            console.error(`Erro ao buscar detalhes da conversa ${id}:`, err);
        } finally {
            if (isInitialLoad) {
            setIsLoading(false);
            }
        }
        }, [id]); // 'id' é uma dependência para useCallback, pois a função depende dele

    useEffect(() => {
    if (id) {
        fetchConversationDetails(true);

        const intervalId = setInterval(() => {
        fetchConversationDetails(false);
        }, POLLING_INTERVAL_DETAIL);

        return () => {
        clearInterval(intervalId);
        };
    } else {
        // Se não houver ID, limpa o estado ou define um erro apropriado
        setConversation(null);
        setError("ID da conversa não encontrado na URL.");
        setIsLoading(false);
    }
    }, [id, fetchConversationDetails]);

    if (isLoading) {
    return (
        <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-6" />
        <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
        <div className="text-center p-10">Carregando detalhes da conversa...</div>
        </div>
    );
    }

    if (error) {
    return <div className="text-center p-10 text-red-500">Erro: {error}</div>;
    }

    if (!conversation) {
    return <div className="text-center p-10">Conversa não encontrada.</div>;
    }

    return (
    <div className="p-4 md:p-6">
        <Link to="/conversations" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Voltar para a lista de conversas
        </Link>

        <div className="bg-white shadow rounded-lg p-6 mb-6 border">
        <h1 className="text-2xl font-bold mb-2">
            {/* Conversa ID: ...{conversation.id.substring(conversation.id.length-12)} */}
            ID da conversa: {conversation.id}
        </h1>
        <p className="text-sm text-gray-600 mb-1">
            Iniciada em: {formatToBrazilianDateTimeWithFns(conversation.initiated_at)}
        </p>
        <div className="flex items-center">
            <span className="mr-2">Status:</span>
            <Badge variant={conversation.status === 'OPEN' ? 'outline' : 'destructive'}> 
            {conversation.status}
            </Badge>
        </div>
        </div>
        
        <Separator className="my-6" />

        <h2 className="text-xl font-semibold mb-4">Mensagens ({conversation.messages.length})</h2>
        {conversation.messages.length === 0 ? (
        <p>Nenhuma mensagem nesta conversa.</p>
        ) : (
        <div className="space-y-4">
            {conversation.messages.map((message: Message) => (
            <div
                key={message.id}
                className={`p-4 rounded-lg shadow ${
                message.direction === 'SENT'
                    ? 'bg-blue-100 ml-auto md:ml-[25%]'
                    : 'bg-gray-100 mr-auto md:mr-[25%]'
                } w-full md:w-3/4`}
            >
                <p className="text-sm font-medium mb-1">{message.content}</p>
                <div className="text-xs text-gray-600 flex justify-between items-center">
                <span 
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    message.direction === 'SENT' 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    {message.direction}
                </span>
                <span>{formatToBrazilianDateTimeWithFns(message.timestamp)}</span>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    );
};

export default ConversationDetailPage;