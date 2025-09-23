import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

export function CadTarefa() {
  // Schema de validação para a tarefa usando Zod
  const schemaCadTarefa = z.object({
    descricao: z.string()
      .min(1, "Insira uma descrição")
      .max(100, "Descrição com até 100 caracteres")
      .regex(/^(?!\d+$).*/, "Descrição não pode ser apenas números")
      .regex(/^(?![^\w\s]+$).*/, "Descrição não pode ser apenas símbolos")
      .regex(/^(?!\s*$).+/, "Descrição não pode estar em branco"),

    nome_setor: z.string()
      .min(1, "Insira o nome do setor")
      .max(30, "Nome do setor deve ter até 30 caracteres")
      .regex(/^(?!\d+$).*/, "Nome do setor não pode ser apenas números")
      .regex(/^(?![^\w\s]+$).*/, "Nome do setor não pode ser apenas símbolos")
      .regex(/^(?!\s*$).+/, "Nome do setor não pode estar em branco"),

    prioridade: z.enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: "Selecione uma prioridade" })
    }).default('low'),

    status: z.enum(['pending', 'in_progress', 'completed'], {
      errorMap: () => ({ message: "Selecione um status" })
    }).default('pending'),

    id_usuario: z.string()
      .min(1, "Insira ID do usuário")
      .max(100, "ID do usuário deve ter até 100 caracteres")
      .regex(/^(?![^\w\s]+$).*/, "ID do usuário não pode ser apenas símbolos")
      .regex(/^(?!\s*$).+/, "ID do usuário não pode estar em branco"),
  });

  // Configuração do react-hook-form com validação do schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadTarefa),
    defaultValues: {
      prioridade: "low",
      status: "pending"
    }
  });

  // Função para enviar os dados para a API ao submeter o formulário
  async function obterdados(data) {
    console.log('dados informados pelo user:', data);

    try {
      // Atenção: tinha um espaço extra na URL que removi
      await axios.post("http://127.0.0.1:8000/api/tarefas/", data);
      alert("Tarefa cadastrada com sucesso");
      reset(); // limpa formulário após cadastro bem-sucedido
    } catch (error) {
      alert("Éeee, não rolou, na próxima talvez");
      console.log("Erros", error);
    }
  }

  return (
    // Usa section com aria-labelledby para ajudar leitores de tela
    <section className="section" aria-labelledby="cad-tarefa-title">
      <form className='formularios' onSubmit={handleSubmit(obterdados)} noValidate>
        <h2 id="cad-tarefa-title">Dados da Tarefa</h2>

        {/* LABELS associados aos inputs via htmlFor e id */}
        <label htmlFor="descricao">Descrição:</label>
        <input
          type="text"
          id="descricao"
          placeholder='Digite a descrição da tarefa'
          {...register("descricao")}
          aria-invalid={errors.descricao ? "true" : "false"}
          aria-describedby={errors.descricao ? "descricao-error" : undefined}
        />
        {errors.descricao && (
          <span role="alert" id="descricao-error" className='errors'>
            {errors.descricao.message}
          </span>
        )}

        <label htmlFor="nome_setor">Nome do Setor:</label>
        <input
          type="text"
          id="nome_setor"
          placeholder='Digite o nome do setor'
          {...register("nome_setor")}
          aria-invalid={errors.nome_setor ? "true" : "false"}
          aria-describedby={errors.nome_setor ? "nome_setor-error" : undefined}
        />
        {errors.nome_setor && (
          <span role="alert" id="nome_setor-error" className='errors'>
            {errors.nome_setor.message}
          </span>
        )}

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          {...register("prioridade")}
          aria-invalid={errors.prioridade ? "true" : "false"}
          aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
        {errors.prioridade && (
          <span role="alert" id="prioridade-error" className='errors'>
            {errors.prioridade.message}
          </span>
        )}

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          {...register("status")}
          aria-invalid={errors.status ? "true" : "false"}
          aria-describedby={errors.status ? "status-error" : undefined}
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>
        {errors.status && (
          <span role="alert" id="status-error" className='errors'>
            {errors.status.message}
          </span>
        )}

        <label htmlFor="id_usuario">Usuário:</label>
        <input
          type="text"
          id="id_usuario"
          placeholder='Digite o ID do usuário'
          {...register("id_usuario")}
          aria-invalid={errors.id_usuario ? "true" : "false"}
          aria-describedby={errors.id_usuario ? "id_usuario-error" : undefined}
        />
        {errors.id_usuario && (
          <span role="alert" id="id_usuario-error" className='errors'>
            {errors.id_usuario.message}
          </span>
        )}

        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
