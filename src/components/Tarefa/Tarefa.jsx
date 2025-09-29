import axios from "axios";
import { Hand } from 'lucide-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";

// Componente que exibe um cartão (card) de tarefa
export function Tarefa({ tarefa }) {
  // Estado para o status da tarefa (select)
  const [status, setStatus] = useState("");

  // Estado para guardar o nome do usuário responsável
  const [nomeUsuario, setNomeUsuario] = useState("");

  // Hook do React Router para redirecionar para outras rotas
  const navigate = useNavigate();

  // Hook do dnd-kit para tornar a tarefa arrastável
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tarefa.id, // cada item arrastável precisa de um id único
  });

  // Estilo inline calculado durante o arraste
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  console.log(tarefa);
  // Busca o nome do usuário ao montar o componente ou quando muda o id do usuário
  useEffect(() => {
    async function fetchNome() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/usuarios/${tarefa.id_usuario}/`);
        setNomeUsuario(response.data.nome); // preenche o estado com o nome recebido
      } catch (err) {
        console.error('Erro ao buscar nome do usuário', err);
        setNomeUsuario('Desconhecido'); // fallback caso não consiga buscar
      }
    }
    fetchNome();
  }, [tarefa.id_usuario]);

  // Exclui a tarefa atual com confirmação
  async function excluirTarefa(id) {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tarefas/${id}/`);
        alert("Tarefa excluída com sucesso!");
        window.location.reload(); // atualiza a página para refletir a exclusão
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        alert("Erro ao excluir tarefa.");
      }
    }
  }

  // Altera o status da tarefa (executado ao enviar o formulário)
  async function alterarStatus(e) {
    e.preventDefault();
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`, {
        status,
      });
      alert("Status alterado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao alterar status:", error.response?.data || error);
      alert("Erro ao alterar status. Verifique as informações e tente novamente.");
    }
  }

  return (
    <article
      className="tarefa-card"
      ref={setNodeRef}          // referência para o item arrastável
      style={style}             // aplica a transformação do arraste
      {...attributes}           // atributos do dnd-kit
      role="group"              // define um grupo para leitores de tela
      aria-labelledby={`tarefa-${tarefa.id}`} // associa o título do card
    >
      {/* Cabeçalho do card */}
      <header className="tarefa-header">
        {/* Descrição da tarefa */}
        <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>

        {/* Handle para arrastar (ícone de mão) */}
        <div
          className="drag-handle"
          {...listeners}          // listeners do dnd-kit
          title="Arraste esta tarefa"
          tabIndex={0}
          role="button"           // indica que é interativo
          aria-grabbed="false"    // muda para true quando arrastando
          aria-label={`Arraste a tarefa: ${tarefa.descricao}`}
        >
          <Hand />
        </div>
      </header>

      {/* Detalhes da tarefa */}
      <dl className="tarefa-details">
        <dt>Setor:</dt>
        <dd>{tarefa.nome_setor}</dd>
      </dl>

      <dl className="tarefa-details">
        <dt>Responsável:</dt>
        <dd>{nomeUsuario || 'Carregando...'}</dd>
      </dl>

      <dl className="tarefa-details">
        <dt>Prioridade:</dt>
        <dd>{tarefa.prioridade}</dd>
      </dl>

      {/* Ações do card */}
      <div className="tarefa-actions">
        <button
          type="button"
          className="btn edit"
          onClick={() => navigate(`/manage/tasks/${tarefa.id}`)}
          aria-label={`Editar tarefa: ${tarefa.descricao}`}
        >
          Editar
        </button>

        <button
          type="button"
          className="btn delete"
          onClick={() => excluirTarefa(tarefa.id)}
          aria-label={`Excluir tarefa: ${tarefa.descricao}`}
        >
          Excluir
        </button>
      </div>

      {/* Formulário para alterar status */}
      <form className="tarefa-status" onSubmit={alterarStatus}>
        <label htmlFor={`status-${tarefa.id}`}>Status:</label>
        <select
          id={`status-${tarefa.id}`}
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-labelledby={`tarefa-${tarefa.id}`}
        >
          <option value="">Selecione</option>
          <option value="pendente">A Fazer</option>
          <option value="em_andamento">Fazendo</option>
          <option value="concluido">Feito</option>
        </select>
        <button
          type="submit"
          className="btn status"
          aria-label={`Alterar status da tarefa: ${tarefa.descricao}`}
        >
          Alterar Status
        </button>
      </form>
    </article>
  );
}
