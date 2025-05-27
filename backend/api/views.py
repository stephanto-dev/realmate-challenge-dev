from django.shortcuts import render
from rest_framework import generics, views, response, status
from .models import Conversation, Message
from .serializers import ConversationSerializer

class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all() # De onde buscar os objetos
    serializer_class = ConversationSerializer # Qual serializer usar para o objeto encontrado
    lookup_field = 'id' # Informa qual campo na URL (e no modelo) usar para buscar a instância.

class WebhookView(views.APIView):

    def post(self, request, *args, **kwargs):
        payload = request.data
        event_type = payload.get('type')
        event_timestamp_str = payload.get('timestamp') # O timestamp do evento em si
        data_payload = payload.get('data', {}) # O objeto 'data' aninhado

        # Validação básica do payload
        if not event_type or not event_timestamp_str or not data_payload:
            return response.Response(
                {"error": "Payload incompleto. 'type', 'timestamp' e 'data' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Lógica de dispatch baseada no tipo de evento
        if event_type == 'NEW_CONVERSATION':
            return self.handle_new_conversation(data_payload, event_timestamp_str)
        elif event_type == 'NEW_MESSAGE':
            return self.handle_new_message(data_payload, event_timestamp_str)
        elif event_type == 'CLOSE_CONVERSATION':
            return self.handle_close_conversation(data_payload, event_timestamp_str)
        else:
            return response.Response(
                {"error": f"Tipo de evento desconhecido: {event_type}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def handle_new_conversation(self, data, event_timestamp):
        conversation_id = data.get('id')
        if not conversation_id:
            return response.Response(
                {"error": "ID da conversa ausente no evento NEW_CONVERSATION."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # O ID é a chave primária, então se já existir, IntegrityError será levantado.
            conversation = Conversation.objects.create(
                id=conversation_id,
                # status já tem default='OPEN' no modelo
                created_event_timestamp=event_timestamp
            )
            return response.Response(
                {"message": "Conversa criada com sucesso.", "id": conversation.id},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return response.Response(
                {"error": f"Erro ao criar conversa: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def handle_new_message(self, data, event_timestamp):
        message_id = data.get('id')
        direction = data.get('direction')
        content = data.get('content')
        conversation_id_str = data.get('conversation_id')

        if not all([message_id, direction, content, conversation_id_str]):
            return response.Response(
                {"error": "Dados da mensagem incompletos."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if direction not in [Message.TYPE_SENT, Message.TYPE_RECEIVED]:
            return response.Response(
                {"error": f"Direção da mensagem inválida: {direction}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            conversation = Conversation.objects.get(id=conversation_id_str)
        except Conversation.DoesNotExist:
            return response.Response(
                {"error": f"Conversa com ID {conversation_id_str} não encontrada."},
                status=status.HTTP_404_NOT_FOUND # Ou 400, pois o webhook enviou um ID inválido
            )

        # Regra de negócio: "Uma CLOSED Conversation não pode receber novas mensagens"
        if conversation.status == Conversation.STATUS_CLOSED:
            return response.Response(
                {"error": "Conversa está fechada e não pode receber novas mensagens."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            message = Message.objects.create(
                id=message_id,
                conversation=conversation,
                event_timestamp=event_timestamp,
                direction=direction,
                content=content
            )
            return response.Response(
                {"message": "Mensagem registrada com sucesso.", "id": message.id},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return response.Response(
                {"error": f"Erro ao registrar mensagem: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def handle_close_conversation(self, data, event_timestamp):
        conversation_id = data.get('id')
        if not conversation_id:
            return response.Response(
                {"error": "ID da conversa ausente no evento CLOSE_CONVERSATION."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            conversation = Conversation.objects.get(id=conversation_id)
            conversation.status = Conversation.STATUS_CLOSED
            conversation.save()
            return response.Response(
                {"message": "Conversa fechada com sucesso.", "id": conversation.id},
                status=status.HTTP_200_OK
            )
        except Conversation.DoesNotExist:
            return response.Response(
                {"error": f"Conversa com ID {conversation_id} não encontrada para fechar."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return response.Response(
                {"error": f"Erro ao fechar conversa: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )