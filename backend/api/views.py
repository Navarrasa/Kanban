from rest_framework import generics
from .models import Usuario, Tarefas
from .serializers import UsuarioSerializer, TarefasSerializer
# Create your views here.


class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class TarefasListCreateView(generics.ListCreateAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer

class TarefasRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer
