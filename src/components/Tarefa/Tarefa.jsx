import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";

export function Tarefa({ tarefa }) {
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    async function excluirTarefa() {
        if (confirm("Deseja realmente excluir essa tarefa?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`);
                alert("Tarefa excluída com sucesso!");
                window.location.reload();
            } catch (erro) {
                alert("Erro ao excluir a tarefa. Tente novamente.");
                console.error(erro);
            }
        }
    }

    async function alterarStatus(novoStatus) {
        try {
        await axios.patch(
            `http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`,
            { status: novoStatus }
        );
        alert("Status alterado com sucesso!");
        window.location.reload();
        } catch (erro) {
        alert("Erro ao alterar o status. Tente novamente.");
        console.error(erro);
        }
    }

    return (
        <article className="tarefa-card">
        <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>

        <dl className="tarefa-details">
            <dt>Setor:</dt>
            <dd >{tarefa.nome_setor}</dd>
        </dl>

        <div className="tarefa-actions">
            <button className="btn edit" onClick={() => navigate(`/manage/tasks/${tarefa.id}`)}>Editar</button>
            <button className="btn delete" onClick={() => excluirTarefa(tarefa.id)}>
            Excluir
            </button>
        </div>

        <form
            className="tarefa-status"
            onSubmit={(e) => {
            e.preventDefault();
            alterarStatus(status);
            }}
        >
            <label htmlFor={`status-${tarefa.id}`}>Status:</label>
            <select
            id={`status-${tarefa.id}`}
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
