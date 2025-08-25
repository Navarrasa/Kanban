import { z } from 'zod';


export function CadUsuario() {
  
  const schemaCadUsuario = z.object({
    nome: z.string().min(1,'Insira ao menos 1 caractere').max(30,'Insira até 30 caracteres'),
    email: z.string().min(5,'Insira ao menos 5 caracteres').max(100,'Insira até 100 caracteres').email('Insira um email válido'),
    senha: z.string().min(6,'Insira ao menos 6 caracteres').max(100,'Insira até 100 caracteres'),
  })
  
  return (
    <section>
      <h1>Cadastro de Usuário</h1>
      {/* Formulário de cadastro */}
    </section>
  );
}