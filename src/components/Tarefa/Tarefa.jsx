import axios from "axios";
import { Hand } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";

export function Tarefa({ tarefa }) {  // Função que renderiza uma tarefa, recebendo dados da tarefa via props
  const [status, setStatus] = useState("");  // Estado para armazenar o status da tarefa
  const navigate = useNavigate();  // Hook para navegação entre páginas

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tarefa.id,  // Tornar a tarefa arrastável, passando o ID da tarefa como chave
  });

  // Estilo condicional para mover o item conforme ele é arrastado
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  // Função para excluir a tarefa após confirmação
  async function excluirTarefa(id) {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tarefas/${id}/`);  // Envia requisição DELETE para excluir a tarefa
        alert("Tarefa excluída com sucesso!");  // Alerta em caso de sucesso
        window.location.reload();  // Atualiza a página após exclusão
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);  // Exibe o erro no console caso a exclusão falhe
        alert("Erro ao excluir tarefa.");  // Alerta em caso de erro
      }
    }
  }

  // Função para alterar o status da tarefa
  async function alterarStatus(e) {
    e.preventDefault();  // Impede o comportamento padrão do formulário
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`, {
        status,  // Envia o novo status da tarefa para a API
      });
      alert("Status alterado com sucesso!");  // Alerta em caso de sucesso
      window.location.reload();  // Atualiza a página após alteração
    } catch (error) {
      console.error("Erro ao alterar status:", error.response?.data || error);  // Exibe o erro no console
      alert("Erro ao alterar status.");  // Alerta em caso de erro
    }
  }

  return (
    <article
      className="tarefa-card"  // Estilo do cartão de tarefa
      ref={setNodeRef}  // Referência para o nó de arraste
      style={style}  // Aplica o estilo de transformação durante o arraste
      {...attributes}  // Atributos necessários para tornar o elemento arrastável
    >
      <header className="tarefa-header">
        <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>  {/* Exibe a descrição da tarefa */}

        {/* Handle de arraste (ícone de mão) */}
        <div 
          className="drag-handle"
          {...listeners}  // Listeners necessários para o arraste
          role="button"
          aria-label="Arraste esta tarefa"
          title="Arraste esta tarefa"
          tabIndex={0}  // Torna o componente acessível via teclado
        >
          <Hand />  {/* Exibe o ícone de mão */}
        </div>
      </header>

      <dl className="tarefa-details">
        <dt>Setor:</dt>
        <dd>{tarefa.nome_setor}</dd>  {/* Exibe o nome do setor relacionado à tarefa */}
      </dl>

      <div className="tarefa-actions">
        {/* Botão para editar a tarefa, que redireciona para a página de edição */}
        <button
          type="button"
          className="btn edit"
          onClick={() => navigate(`/manage/tasks/${tarefa.id}`)}
        >
          Editar
        </button>

        {/* Botão para excluir a tarefa */}
        <button
          type="button"
          className="btn delete"
          onClick={() => excluirTarefa(tarefa.id)}
        >
          Excluir
        </button>
      </div>

      {/* Formulário para alterar o status da tarefa */}
      <form className="tarefa-status" onSubmit={alterarStatus}>
        <label htmlFor={`status-${tarefa.id}`}>Status:</label>
        <select
          id={`status-${tarefa.id}`}
          name="status"
          value={status}  // Valor selecionado do status
          onChange={(e) => setStatus(e.target.value)}  // Atualiza o estado ao selecionar novo valor
        >
          <option value="">Selecione</option>
          <option value="pending">A Fazer</option>
          <option value="in_progress">Fazendo</option>
          <option value="completed">Feito</option>
        </select>
        <button type="submit" className="btn status">
          Alterar Status
        </button>
      </form>
    </article>
  );
}
