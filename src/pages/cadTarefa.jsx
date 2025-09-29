import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

export function CadTarefa() {
  
  // Schema de validação
  const schemaCadTarefa = z.object({
    descricao: z.string()
      .min(1, "Insira uma descrição")
      .max(100, "Descrição com até 100 caracteres")
      .regex(/^(?!\d+$).*/, "Descrição não pode ser apenas números")
      .regex(/^(?![^\w\s]+$).*/, "Descrição não pode ser apenas símbolos")
      .regex(/^(?!\s*$).+/, "Descrição não pode estar em branco"),
    nome_setor: z.string()
      .min(1, "Insira o nome do setor")
      .max(20, "Nome do setor deve ter até 20 caracteres")
      .trim()
      .regex(/^(?!\d+$).*/, "Nome do setor não pode ser apenas números")
      .regex(/^(?![^\w\s]+$).*/, "Nome do setor não pode ser apenas símbolos")
      .regex(/^(?!\s*$).+/, "Nome do setor não pode estar em branco"),
    prioridade: z.enum(['baixo', 'medio', 'alto'], { errorMap: () => ({ message: "Selecione uma prioridade" }) }).default('baixo'),
    status: z.enum(['pendente', 'em_andamento', 'concluido'], { errorMap: () => ({ message: "Selecione um status" }) }).default('pendente'),
    id_usuario: z.string()
      .min(1, "Selecione um usuário")
      .max(100, "ID do usuário deve ter até 100 caracteres")
  });


  const [usuarios, setUsuarios] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("");


  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schemaCadTarefa),
    defaultValues: {
      prioridade: "baixo",
      status: "pendente"
    }
  });


  // Busca todos os usuários ao montar o componente
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/usuarios/");
        setUsuarios(response.data); // Espera um array de {id, nome}
      } catch (err) {
        console.error("Erro ao buscar usuários", err);
        setUsuarios([]);
      }
    }
    fetchUsuarios();
  }, []);

  
  // Atualiza o nome do usuário selecionado
  useEffect(() => {
    const selectedId = watch("id_usuario");
    const usuarioSelecionado = usuarios.find(u => u.id === selectedId);
    setNomeUsuario(usuarioSelecionado ? usuarioSelecionado.nome : "");
  }, [watch("id_usuario"), usuarios]);


  // Submissão do formulário
  async function obterdados(data) {
    try {
      await axios.post("http://127.0.0.1:8000/api/tarefas/", data);
      alert("Tarefa cadastrada com sucesso");
      reset();
    } catch (error) {
      alert("Ocorreu um erro ao cadastrar a tarefa. Tente novamente.");
      console.error("Erro ao cadastrar tarefa:", error);
    }
  }

  // Renderiza o formulário
  return (
    <section className="section">
      <form className='formularios' onSubmit={handleSubmit(obterdados)} noValidate>
        <h2 id="cad-tarefa-title">Dados da Tarefa</h2>

        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          placeholder='Digite a descrição da tarefa'
          {...register("descricao")}
        />
        {errors.descricao && <span role="alert" className='errors'>{errors.descricao.message}</span>}

        <label htmlFor="nome_setor">Nome do Setor:</label>
        <input
          type="text"
          id="nome_setor"
          placeholder='Digite o nome do setor'
          {...register("nome_setor")}
        />
        {errors.nome_setor && <span role="alert" className='errors'>{errors.nome_setor.message}</span>}

        <label htmlFor="prioridade">Prioridade:</label>
        <select id="prioridade" {...register("prioridade")}>
          <option value="baixo">Baixa</option>
          <option value="medio">Média</option>
          <option value="alto">Alta</option>
        </select>
        {errors.prioridade && <span role="alert" className='errors'>{errors.prioridade.message}</span>}

        <label htmlFor="status">Status:</label>
        <select id="status" {...register("status")}>
          <option value="pendente">Pendente</option>
        </select>
        {errors.status && <span role="alert" className='errors'>{errors.status.message}</span>}

        <label htmlFor="id_usuario">Usuário:</label>
        <select id="id_usuario" {...register("id_usuario")}>
          <option value="">Selecione um usuário</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </option>
          ))}
        </select>
        {errors.id_usuario && <span role="alert" className='errors'>{errors.id_usuario.message}</span>}

        {/* Mostrar nome do usuário selecionado */}
        {nomeUsuario && <p>Selecionado: {nomeUsuario}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
