import { Link } from "react-router-dom";  

export function Header() {  // Componente Header, responsável pela navegação principal
  return (
    <header className="header">  {/* Contêiner para o cabeçalho */}
      <h1>
        {/* Link para a página inicial, onde o usuário pode gerenciar tarefas */}
        <Link to="/">Gerenciar Tarefas</Link>
      </h1>
      <nav>
        <ul>  {/* Lista de navegação */}
          <li>
            {/* Link para a página de cadastro de usuários */}
            <Link to="/users">Cadastro de Usuários</Link>
          </li>
          <li>
            {/* Link para a página de cadastro de tarefas */}
            <Link to="/tasks">Cadastro de Tarefas</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
