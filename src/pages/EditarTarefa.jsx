import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Schema de validação com zod para prioridade e status da tarefa
const schemaEditarTarefas = z.object({
  prioridade: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: "Selecione uma prioridade" }),
  }).default('low'),
  status: z.enum(['pending', 'in_progress', 'completed'], {
    errorMap: () => ({ message: "Selecione um status" }),
  }).default('pending'),
});

export function EditarTarefa() {
  const { id } = useParams(); // Pega o id da tarefa pela URL
  const [tarefa, setTarefa] = useState(null);
  const navigate = useNavigate();

  // Configura o form com react-hook-form usando o schema do Zod para validação
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

  // Busca os dados da tarefa para preencher o formulário ao montar o componente
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/tarefas/${id}/`)
      .then((res) => {
        setTarefa(res.data);
        // Preenche os campos do formulário com os dados recebidos
        reset({
          prioridade: res.data.prioridade,
          status: res.data.status
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar tarefa:", err);
      });
  }, [id, reset]);

  // Função chamada ao enviar o formulário para salvar as alterações
  async function salvarEdicao(data) {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tarefas/${id}/`, data);
      alert("Tarefa atualizada com sucesso!");
      navigate("/"); // Redireciona para a página inicial após salvar
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar a tarefa. Verifique as informações e tente novamente.");
    }
  }

  return (
    <section 
      className="editar-tarefa-card" 
      aria-labelledby="editar-tarefa-title"
    >
      <h2 id="editar-tarefa-title">Editar Tarefa</h2>
      <form 
        className="editar-tarefa-form" 
        onSubmit={handleSubmit(salvarEdicao)} 
        noValidate // desativa a validação nativa do navegador para usar a do Zod
      >
        {/* Descrição somente leitura */}
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={tarefa?.descricao || ""}
          readOnly
          aria-readonly="true" // informa tecnologias assistivas que o campo é somente leitura
          rows={4}
        />

        {/* Setor somente leitura */}
        <label htmlFor="setor">Setor</label>
        <input
          type="text"
          id="setor"
          value={tarefa?.nome_setor || ""}
          readOnly
          aria-readonly="true"
        />

        {/* Campo de seleção para prioridade com tratamento de erro */}
        <label htmlFor="prioridade">Prioridade</label>
        <select 
          id="prioridade"
          className="active_select" 
          {...register("prioridade")} 
          aria-invalid={errors.prioridade ? "true" : "false"} // indica se o campo está inválido
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
        {errors.prioridade && (
          <span role="alert" className="editar-tarefa-error">
            {errors.prioridade.message}
          </span> // role alert para que leitores de tela anunciem o erro automaticamente
        )}

        {/* Campo de seleção para status com tratamento de erro */}
        <label htmlFor="status">Status</label>
        <select 
          id="status"
          className="active_select" 
          {...register("status")} 
          aria-invalid={errors.status ? "true" : "false"}
        >
          <option value="pending">A Fazer</option>
          <option value="in_progress">Fazendo</option>
          <option value="completed">Feito</option>
        </select>
        {errors.status && (
          <span role="alert" className="editar-tarefa-error">
            {errors.status.message}
          </span>
        )}

        {/* Botões para salvar ou cancelar a edição */}
        <button type="submit" className="editar-tarefa-btn">Salvar</button>
        <button 
          type="button" 
          className="cancelar-tarefa-btn" 
          onClick={() => navigate("/")}
        >
          Cancelar
        </button>
      </form>
    </section>
  );
}
