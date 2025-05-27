from rest_framework import serializers
from .models import Message, Conversation

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='event_timestamp', read_only=True)

    class Meta:
        model = Message
        # Lista de campos do modelo Message que queremos incluir na representação JSON.
        fields = [
            'id',             # O ID da mensagem (UUID)
            'timestamp',      # O timestamp do evento da mensagem (renomeado de event_timestamp)
            'direction',      # 'SENT' ou 'RECEIVED'
            'content',        # O conteúdo da mensagem
        ]
        read_only_fields = ['id']

class ConversationSerializer(serializers.ModelSerializer):

    # Aninhando o MessageSerializer para incluir as mensagens da conversa.
    # 'many=True' indica que 'messages' é uma lista de objetos Message.
    # 'read_only=True' porque as mensagens são criadas/gerenciadas através dos webhooks
    # de NEW_MESSAGE, não diretamente através da serialização de uma Conversation.
    messages = MessageSerializer(many=True, read_only=True)

    # Para expor o 'created_event_timestamp' do modelo Conversation
    # como 'initiated_at' no JSON de saída. Este é o timestamp
    # do evento NEW_CONVERSATION.
    initiated_at = serializers.DateTimeField(source='created_event_timestamp', read_only=True)

    class Meta:
        model = Conversation
        # Campos do modelo Conversation que queremos incluir na representação JSON.
        fields = [
            'id',               # O ID da conversa (UUID)
            'status',           # O estado da conversa ('OPEN' ou 'CLOSED')
            'initiated_at',     # Timestamp de quando a conversa foi efetivamente iniciada (do webhook)
            'messages',         # A lista de mensagens aninhadas
        ]