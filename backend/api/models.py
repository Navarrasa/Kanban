from django.db import models

PRIORITY_CHOICES = [
    ('baixo', 'Baixo'),
    ('medio', 'Médio'),
    ('alto', 'Alto'),
]

STATUS_CHOICES = [
    ('pendente', 'Pendente'),
    ('em_andamento', 'Em Andamento'),
    ('concluido', 'Concluído'),
]

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)

    def __str__(self):
        return self.nome

class Tarefas(models.Model):
    descricao = models.CharField(max_length=255)    
    nome_setor = models.CharField(max_length=255)
    prioridade = models.CharField(max_length=50, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    data_cadastro = models.DateTimeField(auto_now_add=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.descricao