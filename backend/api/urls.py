from django.urls import path
from .views import ConversationDetailView, WebhookView, ConversationsListView

app_name = 'api'

urlpatterns = [
    path('conversations/<uuid:id>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/', ConversationsListView.as_view(), name='conversation-list'),
    path('webhook/', WebhookView.as_view(), name='webhook-receiver'),
]