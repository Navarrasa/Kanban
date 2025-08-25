import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <h1><Link to="/">Gerenciar Tarefas</Link></h1>
      <nav>
        <ul>
          <li>
            <Link to="/users">Cadastro de Usuários</Link>
          </li>
          <li>
            <Link to="/tasks">Cadastro de Tarefas</Link>
          </li>
          <li>
            <Link to="/manage/tasks">Gerenciamento de Tarefas</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}