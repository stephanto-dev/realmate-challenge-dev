from django.urls import path
from .views import ConversationDetailView

app_name = 'api'

urlpatterns = [
    path('conversations/<uuid:id>/', ConversationDetailView.as_view(), name='conversation-detail'),

    # Mais tarde, adicionaremos a URL para o webhook aqui também, algo como:
    # path('webhook/', SuaWebhookView.as_view(), name='webhook-receiver'),
]