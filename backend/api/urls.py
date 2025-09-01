from django.urls import path
from .views import UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView, TarefasListCreateView, TarefasRetrieveUpdateDestroyView

urlpatterns = [
    # TODO LIST

    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuario-retrieve-update-destroy'),
    path('tarefas/', TarefasListCreateView.as_view(), name='tarefas-list-create'),
    path('tarefas/<int:pk>/', TarefasRetrieveUpdateDestroyView.as_view(), name='tarefas-retrieve-update-destroy'),

]
