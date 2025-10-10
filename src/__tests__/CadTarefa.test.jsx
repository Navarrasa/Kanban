import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CadTarefa } from '../pages/cadTarefa.jsx';
import axios from 'axios';

vi.mock('axios');
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe("Cadastro de Tarefas", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: [{ id: 1, nome: 'Gustavo' }] });
    render(<CadTarefa />);
    await waitFor(() => screen.getByText('Gustavo'));
  });

  it("1. A tela é exibida", () => {
    expect(screen.getByLabelText(/Descrição/i)).toBeTruthy();
    expect(screen.getByLabelText(/Nome do Setor/i)).toBeTruthy();
    expect(screen.getByLabelText(/Prioridade/i)).toBeTruthy();
    expect(screen.getByLabelText(/Status/i)).toBeTruthy();
    expect(screen.getByLabelText(/Usuário/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeTruthy();
  });

  it("2. deve resetar os campos após submissão bem-sucedida", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    fireEvent.change(descricaoInput, { target: { value: "Fazer relatório semanal" } });
    fireEvent.change(setorInput, { target: { value: "Administração" } });
    fireEvent.change(prioridadeSelect, { target: { value: "alto" } });
    fireEvent.change(usuarioSelect, { target: { value: "1" } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/tarefas/",
        expect.objectContaining({
          descricao: "Fazer relatório semanal",
          nome_setor: "Administração",
          prioridade: "alto",
          id_usuario: "1",
          status: "pendente"
        })
      );

      expect(descricaoInput.value).toBe("");
      expect(setorInput.value).toBe("");
      expect(usuarioSelect.value).toBe("");
      expect(screen.getByLabelText(/Prioridade/i).value).toBe("baixo"); // valor padrão (default)
      expect(screen.getByLabelText(/Status/i).value).toBe("pendente"); // valor padrão
    });
  });

  it("3. mostra mensagem de sucesso ao cadastrar", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Nova tarefa' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'alto' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it("4. permite cadastrar múltiplas tarefas seguidas", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    // Primeira tarefa
    fireEvent.change(descricaoInput, { target: { value: 'Tarefa 1' } });
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    fireEvent.change(prioridadeSelect, { target: { value: 'alto' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });
    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.value).toBe('');
      expect(setorInput.value).toBe('');
      expect(usuarioSelect.value).toBe('');
    });

    // Segunda tarefa
    fireEvent.change(descricaoInput, { target: { value: 'Tarefa 2' } });
    fireEvent.change(setorInput, { target: { value: 'TI' } });
    fireEvent.change(prioridadeSelect, { target: { value: 'medio' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });
    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.value).toBe('');
      expect(setorInput.value).toBe('');
      expect(usuarioSelect.value).toBe('');
    });
  });

  it("5. exibe erro apenas na descrição quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'medio' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).classList.contains('errors')).toBe(true);
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('errors')).toBe(false);
      expect(screen.getByLabelText(/Prioridade/i).classList.contains('errors')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('errors')).toBe(false);
    });
  });

  it("6. exibe erro apenas no nome do setor quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Revisar relatórios' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('errors')).toBe(true);
    });
  });

  it("7. exibe erro apenas no usuário quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Atualizar site' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i).classList.contains('errors')).toBe(true);
    });
  });

  it("8. não permite números no campo Nome do Setor", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), {
    target: { value: 'Tarefa de teste' },
    });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), {
      target: { value: '1234' },
    });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), {
      target: { value: 'medio' },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: 'pendente' },
    });
    fireEvent.change(screen.getByLabelText(/Usuário/i), {
      target: { value: '1' }, // ID válido
    });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Nome do setor não pode ser apenas números/i)
      ).toBeTruthy();
    });
  }); 

  it("9. limita caracteres da descrição entre 1 e 100", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    fireEvent.change(descricaoInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira uma descrição/i)).toBeTruthy());

    fireEvent.change(descricaoInput, { target: { value: 'a'.repeat(101) } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Descrição com até 100 caracteres/i)).toBeTruthy());
  });

  it("10. limita caracteres do Nome do Setor entre 1 e 20", async () => {
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    fireEvent.change(setorInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira o nome do setor/i)).toBeTruthy());

    fireEvent.change(setorInput, { target: { value: 'a'.repeat(21) } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/deve ter até 20 caracteres/i)).toBeTruthy());
  });

  it("11. deve permitir apenas prioridades válidas", () => {
    const select = screen.getByLabelText(/Prioridade/i);
    fireEvent.change(select, { target: { value: 'alto' } });
    expect(select.value).toBe('alto');
  });

  it("12. deve mostrar erro para prioridade inválida", async () => {
    const select = screen.getByLabelText(/Prioridade/i);
    fireEvent.change(select, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).classList.contains('errors')).toBe(true);
    });
  });

  it("13. deve resetar prioridade e status após submissão", async () => {
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'medio' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Nova tarefa' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).value).toBe('baixo'); // volta para default
      expect(screen.getByLabelText(/Status/i).value).toBe('pendente'); // default
    });
  });

  it("14. adiciona classe de erro na descrição quando inválida e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).classList.contains('errors')).toBe(true);
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('errors')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('errors')).toBe(false);
    });
  });

  it("15. adiciona classe de erro no nome do setor quando inválido e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Relatório' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('errors')).toBe(true);
      expect(screen.getByLabelText(/Descrição/i).classList.contains('errors')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('errors')).toBe(false);
    });
  });

  it("16. adiciona classe de erro no usuário quando inválido e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Relatório' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i).classList.contains('errors')).toBe(true);
      expect(screen.getByLabelText(/Descrição/i).classList.contains('errors')).toBe(false);
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('errors')).toBe(false);
    });
  });

  it("17. exibe erro para campo descrição vazio específico", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira uma descrição/i)).toBeTruthy());
  });

  it("18. exibe erro para campo nome do setor vazio específico", async () => {
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira o nome do setor/i)).toBeTruthy());
  });

  it("19. mantém a prioridade padrão quando não selecionada", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).value).toBe('baixo');
    });
  });

  it("20. mantém o status padrão quando não alterado", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Status/i).value).toBe('pendente');
    });
  });

  it("21. adiciona classe de erro em todos os campos obrigatórios quando vazios", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);

    fireEvent.change(descricaoInput, { target: { value: '' } });
    fireEvent.change(setorInput, { target: { value: '' } });
    fireEvent.change(usuarioSelect, { target: { value: '' } });
    fireEvent.change(prioridadeSelect, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.classList.contains('errors')).toBe(true);
      expect(setorInput.classList.contains('errors')).toBe(true);
      expect(usuarioSelect.classList.contains('errors')).toBe(true);
      expect(prioridadeSelect.classList.contains('errors')).toBe(true);
    });
  });

});
