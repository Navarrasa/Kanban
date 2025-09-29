# 📝 Kanban Life

Um **Kanban online** feito em **React + Vite + JavaScript**, para simular o fluxo de tarefas da vida real!
Organize tarefas, atribua responsáveis, defina prioridades e acompanhe o status de cada item, tudo em uma interface simples e intuitiva.

---

## 💻 Tecnologias Utilizadas

* **Frontend:** React, Vite, JavaScript, Tailwind CSS (opcional)
* **Backend:** Django, Django REST Framework
* **Validação/Formulários:** React Hook Form + Zod
* **Banco de Dados:** SQLite (padrão Django)
* **Controle de Estado:** React Hooks

---

## 🚀 Rodando o Projeto

### 1️⃣ Backend (Django)

1. Clone o repositório e vá para a pasta do backend:

```bash
cd backend
```

2. Crie e ative um ambiente virtual:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Rode as migrações do Django:

```bash
python manage.py migrate
```

5. Inicie o servidor:

```bash
python manage.py runserver
```

O backend estará disponível em `http://127.0.0.1:8000/`.

---

### 2️⃣ Frontend (React + Vite)

1. Vá para a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências do Node:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173/` (ou na porta que o Vite indicar).

---

## 🛠️ Funcionalidades

* Criar, editar e excluir tarefas.
* Arrastar e soltar tarefas entre colunas (Drag & Drop).
* Filtrar por prioridade e status.
* Selecionar responsável entre os usuários cadastrados.
* Interface responsiva e acessível (ARIA).

---

## ⚡ Dicas

* Para testar o Kanban, crie alguns usuários no backend primeiro.
* Use os filtros para simular diferentes fluxos de trabalho.
* Os cards possuem atributos ARIA para acessibilidade, podendo ser usados com leitores de tela.

---

## 📂 Estrutura do Projeto

```
kanban-life/
│
├─ backend/        # Django + DRF
├─ src/            # React + Vite
├─ README.md       # Este arquivo
```

---

