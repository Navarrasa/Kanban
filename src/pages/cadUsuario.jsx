import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

export function CadUsuario() {

  const schemaCadUsuario = z.object({
  nome: z.string()
    .min(1, 'Insira ao menos 1 caractere')
    .max(30, 'Insira até 30 caracteres')
    .regex(/^(?!\s*$).+/, "Nome não pode estar em branco")
    .regex(/^(?!\d+$).*/, "Nome não pode ser apenas números")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Use apenas letras e espaços"),

  email: z.string()
    .min(5, 'Insira ao menos 5 caracteres')
    .max(100, 'Insira até 100 caracteres')
    .trim()
    .email("Formato de email inválido")
    .regex(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/, "Insira um domínio válido"),
  })

 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadUsuario)
  });

  async function obterdados(data) {
      console.log('dados informados pelo user:', data)

      try {
          await axios.post("http://127.0.0.1:8000/api/usuarios/", data);
          alert("Usuário cadastrado com sucesso");
          reset();
      } catch (error) {
          alert("Éeee, não rolou, na proxima talvez")
          console.log("Erros", error)
      }
  }

  return (
    <section className="section">
      <form className='formularios' onSubmit={handleSubmit(obterdados)}>
        <h2>Dados do usuário</h2>

        <label>Nome:</label>
        <input type="text" placeholder='Digite seu nome' {...register("nome")} />
        {errors.nome && <span className='errors'>{errors.nome.message}</span>}

        <label>Email:</label>
        <input type="email" placeholder='Digite seu email' {...register("email")} />
        {errors.email && <span className='errors'>{errors.email.message}</span>}

        <button type="submit">Cadastrar </button>
      </form>
    </section>
  );
}