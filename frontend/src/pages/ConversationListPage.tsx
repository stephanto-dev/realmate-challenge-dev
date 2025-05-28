import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConversations } from '../services/api';
import type { ConversationListItem } from '../services/api'; 
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { formatToBrazilianDateTimeWithFns } from '@/lib/utils';


const POLLING_INTERVAL = 10000;

const ConversationListPage: React.FC = () => {
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useCallback para evitar recriar a função em cada renderização,
    const fetchConversations = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
        setIsLoading(true); 
    }
    // Para polling subsequente, não mostramos o loading de página inteira para não piscar a tela.
    // Você poderia ter um indicador de loading mais sutil para polling.
    setError(null); 
    try {
        const data = await getConversations();
        setConversations(data);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
        setError(errorMessage);
        console.error("Erro ao buscar conversas:", err);
    } finally {
        if (isInitialLoad) {
        setIsLoading(false);
        }
    }
    }, [])

    useEffect(() => {
        // Busca inicial
        fetchConversations(true);

        // Configura o polling
        const intervalId = setInterval(() => {
            fetchConversations(false); // 'false' para não mostrar o loading de página inteira
        }, POLLING_INTERVAL);

        // Função de limpeza para quando o componente for desmontado
        return () => {
            clearInterval(intervalId);
        };
        }, [fetchConversations]);

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
            <h1 className="text-3xl font-bold mb-6"><Skeleton className="h-8 w-48" /></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
            </div>
        );
    }	

    if (error) {
    return <div className="text-center p-10 text-red-500">Erro: {error}</div>;
    }

    return (
    <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">Conversas</h1>
        {conversations.length === 0 ? (
        <p>Nenhuma conversa encontrada.</p>
        ) : (
        <Table>
            <TableCaption>Uma lista das suas conversas recentes.</TableCaption>
            <TableHeader>
            <TableRow>
                <TableHead>ID da Conversa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Iniciada em</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {conversations.map((convo) => (
                <TableRow key={convo.id}>
                <TableCell className="font-medium">
                    <Link to={`/conversations/${convo.id}`} className="hover:underline">
                    ...{convo.id.substring(convo.id.length - 12)}
                    </Link>
                </TableCell>
                <TableCell>{convo.status}</TableCell>
                <TableCell>{formatToBrazilianDateTimeWithFns(convo.initiated_at)}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        )}
    </div>
    );
};

export default ConversationListPage;