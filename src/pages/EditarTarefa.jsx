import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const schemaEditarTarefas = z.object({
    prioridade: z.enum(['low', 'medium', 'high'], {
        errorMap: () => ({ message: "Selecione uma prioridade" })
    }).default('low'),
    status: z.enum(['pending', 'in_progress', 'completed'], {
        errorMap: () => ({ message: "Selecione um status" })
    }).default('pending'),

});


export function EditarTarefa() {
    const { id } = useParams();
    const [tarefa, setTarefa] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schemaEditarTarefas),
        defaultValues: {
            prioridade: "low",
            status: "pending"
        }
    });

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/tarefas/${id}/`)
        .then((res) => {
            console.log(res)
            setTarefa(res.data);
            reset({
                prioridade: res.data.prioridade,
                status: res.data.status
            });
        })
        .catch((err) => {
            console.error("Erro ao buscar tarefa:", err);
        });
    }, [id,reset]);

    async function salvarEdicao(data) {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/tarefas/${id}/`, data);
            console.log("Tarefa atualizada com sucesso", data);
            alert("Tarefa atualizada com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            alert("Erro ao atualizar a tarefa. Tente novamente.");
        }
    }

    return (
        <section className="editar-tarefa-card">
            <h2>Editar Tarefa</h2>
            <form className="editar-tarefa-form" onSubmit={handleSubmit(salvarEdicao)}>
            <label>Descrição</label>
            <textarea value={tarefa?.descricao || ""} readOnly />

            <label>Setor</label>
            <input type="text" value={tarefa?.nome_setor || ""} readOnly />

            <label>Prioridade</label>
            <select {...register("prioridade")}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
            </select>
            {errors.prioridade && (
                <span className="editar-tarefa-error">{errors.prioridade.message}</span>
            )}

            <label>Status</label>
            <select {...register("status")}>
                <option value="pending">A Fazer</option>
                <option value="in_progress">Fazendo</option>
                <option value="completed">Feito</option>
            </select>
            {errors.status && (
                <span className="editar-tarefa-error">{errors.status.message}</span>
            )}

            <button type="submit" className="editar-tarefa-btn">Salvar</button>
            <button type="button" className="cancelar-tarefa-btn" onClick={() => navigate("/")}>Cancelar</button>
            </form>
        </section>
    );
}