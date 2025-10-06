  import { z } from 'zod';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import axios from 'axios';

  export function CadUsuario() {

    // Schema de validação com Zod para nome e email
    const schemaCadUsuario = z.object({
      nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .trim()
        .regex(/^(?!\s*$).+/, "Nome não pode estar em branco")
        .regex(/^(?!\d+$).*/, "Nome não pode ser apenas números")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Use apenas letras e espaços"),

      email: z.string()
        .min(5, 'Insira ao menos 5 caracteres')
        .max(40, 'Insira até 40 caracteres')
        .trim()
        .email("Formato de email inválido")
        .regex(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/, "Insira um domínio válido"),
    })

    // Configura react-hook-form com validação via zodResolver
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm({
      resolver: zodResolver(schemaCadUsuario)
    });

    // Função chamada ao submeter o formulário
    async function obterdados(data) {
      console.log('dados informados pelo user:', data)

      try {
        await axios.post("http://127.0.0.1:8000/api/usuarios/", data);
        alert("Usuário cadastrado com sucesso");
        reset(); // limpa o formulário após sucesso
      } catch (error) {
        alert("Erro ao cadastrar usuário. e-mail já cadastrado");
        console.log("Erros", error)
      }
    }

    return (
      <section className="section" aria-labelledby="cadastro-usuario-title">
        <form role='form' className='formularios' onSubmit={handleSubmit(obterdados)} noValidate>
          <h2 id="cadastro-usuario-title">Dados do usuário</h2>

          {/* Campo Nome com label associado via htmlFor e id */}
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            placeholder='Digite seu nome' 
            {...register("nome")} 
            aria-invalid={errors.nome ? "true" : "false"} // indica erro para leitores de tela
            aria-describedby={errors.nome ? "nome-error" : undefined} // aponta para a mensagem de erro
          />
          {errors.nome && (
            <span role="alert" id="nome-error" className='errors'>
              {errors.nome.message}
            </span>
          )}

          {/* Campo Email com label associado */}
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            placeholder='Digite seu email' 
            {...register("email")} 
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span role="alert" id="email-error" className='errors'>
              {errors.email.message}
            </span>
          )}

          <button type="submit" name='cadastrar'>Cadastrar</button>
        </form>
      </section>
    );
  }
