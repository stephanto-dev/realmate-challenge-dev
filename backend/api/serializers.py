from rest_framework import serializers
from .models import Message, Conversation

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='event_timestamp', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'timestamp',
            'direction',
            'content',
        ]
        read_only_fields = ['id']

class ConversationSerializer(serializers.ModelSerializer):

    messages = MessageSerializer(many=True, read_only=True)

    initiated_at = serializers.DateTimeField(source='created_event_timestamp', read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id',
            'status',
            'initiated_at',
            'messages',
        ]

class ConversationListSerializer(serializers.ModelSerializer):
    initiated_at = serializers.DateTimeField(source='created_event_timestamp', read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id',
            'status',
            'initiated_at',
        ]