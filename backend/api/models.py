from django.db import models

class Conversation(models.Model):
    """
    Representa uma conversa no sistema.
    """
    # Estados possíveis para uma conversa
    STATUS_OPEN = 'OPEN'
    STATUS_CLOSED = 'CLOSED'
    STATUS_CHOICES = [
        (STATUS_OPEN, 'Aberta'),
        (STATUS_CLOSED, 'Fechada'),
    ]

    # O ID virá do webhook e será um UUID.
    # primary_key=True já implica unique=True e null=False.
    id = models.UUIDField(primary_key=True, editable=False) # Usaremos o ID do webhook

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_OPEN, # "Toda conversa começa no estado “OPEN”"
        verbose_name="Estado"
    )

    # Este campo armazenará o 'timestamp' do evento NEW_CONVERSATION
    created_event_timestamp = models.DateTimeField(
        verbose_name="Timestamp do Evento de Criação"
    )
    
    # Timestamps para rastreamento no banco de dados
    db_created_at = models.DateTimeField(auto_now_add=True, verbose_name="Registrado no DB em")


    def __str__(self):
        return f"Conversa {self.id} ({self.get_status_display()})"

    class Meta:
        verbose_name = "Conversa"
        verbose_name_plural = "Conversas"
        ordering = ['-db_created_at']

class Message(models.Model):
    """
    Representa uma mensagem dentro de uma conversa.
    """
    # Tipos/Direções possíveis para uma mensagem
    TYPE_SENT = 'SENT'
    TYPE_RECEIVED = 'RECEIVED'
    DIRECTION_CHOICES = [
        (TYPE_SENT, 'Enviada'),
        (TYPE_RECEIVED, 'Recebida'),
    ]

    # O ID virá do webhook e será um UUID.
    id = models.UUIDField(primary_key=True, editable=False) # Usaremos o ID do webhook

    # Relacionamento com a Conversa
    # related_name='messages' permite acessar as mensagens de uma instância de Conversation: conversation.messages.all()
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name="Conversa"
    )

    # Timestamp da mensagem, conforme o webhook NEW_MESSAGE
    event_timestamp = models.DateTimeField(
        verbose_name="Timestamp do Evento"
    )

    direction = models.CharField(
        max_length=10,
        choices=DIRECTION_CHOICES,
        verbose_name="Direção"
    )

    content = models.TextField(verbose_name="Conteúdo")
    
    # Timestamp para rastreamento no nosso banco de dados
    db_created_at = models.DateTimeField(auto_now_add=True, verbose_name="Registrado no DB em")

    def __str__(self):
        return f"Mensagem {self.id} ({self.get_direction_display()}) em {self.event_timestamp.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"
        ordering = ['event_timestamp']