import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

export function CadTarefa() {
    
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

  prioridade: z.enum(['1', '2', '3'], {
    errorMap: () => ({ message: "Selecione uma prioridade" })
  }).default('1'),

  status: z.enum(['1', '2', '3'], {
    errorMap: () => ({ message: "Selecione um status" })
  }).default('1'),

  usuario: z.string()
    .min(1, "Insira ID do usuário")
    .max(100, "ID do usuário deve ter até 100 caracteres")
    .regex(/^(?![^\w\s]+$).*/, "ID do usuário não pode ser apenas símbolos")
    .regex(/^(?!\s*$).+/, "ID do usuário não pode estar em branco"),

  })


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadTarefa),
    defaultValues: {
      prioridade: "1",
      status: "1"
    }
  });


  async function obterdados(data) {
      console.log('dados informados pelo user:', data)

      try {
          await axios.post("http://127.0.0.1:8000/api/tarefas/", data);
          alert("Tarefa cadastrada com sucesso");
          reset();
      } catch (error) {
          alert("Éeee, não rolou, na proxima talvez")
          console.log("Erros", error)
      }
  }

  return (
    <section className="section">
      <form className='formularios' onSubmit={handleSubmit(obterdados)}>
        <h2>Dados da Tarefa</h2>

        <label>Descrição:</label>
        <input type="text" placeholder='Digite a descrição da tarefa' {...register("descricao")} />
        {errors.descricao && <span className='errors'>{errors.descricao.message}</span>}

        <label>Nome do Setor:</label>
        <input type="text" placeholder='Digite o nome do setor' {...register("nome_setor")} />
        {errors.nome_setor && <span className='errors'>{errors.nome_setor.message}</span>}

        <label>Prioridade:</label>
        <select {...register("prioridade")}>
          <option value="1">Baixa</option>
          <option value="2">Média</option>
          <option value="3">Alta</option>
        </select>
        {errors.prioridade && <span className='errors'>{errors.prioridade.message}</span>}

        <label>Status:</label>
        <select {...register("status")}>
          <option value="1">Pendente</option>
          <option value="2">Em Progresso</option>
          <option value="3">Concluída</option>
        </select>
        {errors.status && <span className='errors'>{errors.status.message}</span>}

        <label>Usuário:</label>
        <input type="text" placeholder='Digite o ID do usuário' {...register("usuario")} />
        {errors.usuario && <span className='errors'>{errors.usuario.message}</span>}

        <button type="submit">Cadastrar </button>
      </form>
    </section>
  );
}