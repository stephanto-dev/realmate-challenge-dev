from django.shortcuts import render
from rest_framework import generics
# from rest_framework.response import Response # Não é necessário para RetrieveAPIView básica
# from rest_framework import status # Para erros, mas RetrieveAPIView já lida com 404
from .models import Conversation # Nosso modelo de Conversa
from .serializers import ConversationSerializer # Nosso serializer para Conversa

class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all() # De onde buscar os objetos
    serializer_class = ConversationSerializer # Qual serializer usar para o objeto encontrado
    lookup_field = 'id' # Informa qual campo na URL (e no modelo) usar para buscar a instância.