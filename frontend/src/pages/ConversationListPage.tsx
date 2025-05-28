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
        <div className="space-y-6"> {/* Adiciona espaçamento vertical geral */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Conversas</h1>
        {error && <p className="text-destructive bg-destructive/10 p-3 rounded-md">Erro ao atualizar: {error}. Exibindo últimos dados carregados.</p>}
        
        {conversations.length === 0 && !isLoading ? (
          <p className="text-muted-foreground">Nenhuma conversa encontrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] sm:w-[300px]">ID da Conversa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Iniciada em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((convo) => (
                <TableRow key={convo.id}>
                  <TableCell className="font-medium">
                    <Link to={`/conversations/${convo.id}`} className="text-primary hover:underline">
                      {convo.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        convo.status === 'OPEN' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' 
                          : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                      }`}
                    >
                      {convo.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatToBrazilianDateTimeWithFns(convo.initiated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
};

export default ConversationListPage;