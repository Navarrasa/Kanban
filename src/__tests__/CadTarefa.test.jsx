import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadTarefa } from '../pages/cadTarefa';
import { vi, describe, it, beforeEach, expect } from 'vitest';


// Mock global alert
global.alert = vi.fn();

describe('CadTarefa - testes de inputs malucos', () => {
  beforeEach(() => {
    render(<CadTarefa />);
    vi.clearAllMocks();
  });

  async function fillAndSubmit(descricao, nome_setor, prioridade = 'baixo', status = 'pendente', id_usuario = '') {
    const descricaoInput = screen.getByLabelText(/descrição/i);
    const nomeSetorInput = screen.getByLabelText(/nome do setor/i);
    const prioridadeSelect = screen.getByLabelText(/prioridade/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const usuarioSelect = screen.getByLabelText(/usuário/i);

    fireEvent.input(descricaoInput, { target: { value: descricao } });
    fireEvent.input(nomeSetorInput, { target: { value: nome_setor } });
    fireEvent.change(prioridadeSelect, { target: { value: prioridade } });
    fireEvent.change(statusSelect, { target: { value: status } });
    fireEvent.change(usuarioSelect, { target: { value: id_usuario } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
  }

  // it('1. descrição vazia', async () => {
  //   await fillAndSubmit('', 'SetorX', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/insira uma descrição/i)).toBeTruthy();
  // });

  // it('2. descrição só espaços', async () => {
  //   await fillAndSubmit('    ', 'SetorX', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/descrição não pode estar em branco/i)).toBeTruthy();
  // });

  // it('3. descrição só números', async () => {
  //   await fillAndSubmit('1234567890', 'SetorX', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/descrição não pode ser apenas números/i)).toBeTruthy();
  // });

  // it('4. descrição só símbolos', async () => {
  //   await fillAndSubmit('!@#$%^&*()', 'SetorX', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/descrição não pode ser apenas símbolos/i)).toBeTruthy();
  // });

  // it('5. descrição muito longa', async () => {
  //   const longText = 'a'.repeat(101);
  //   await fillAndSubmit(longText, 'SetorX', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/descrição com até 100 caracteres/i)).toBeTruthy();
  // });

  it('6. descrição com letras, números e símbolos', async () => {
    await fillAndSubmit('Tarefa #123!! @#$', 'SetorX', 'baixo', 'pendente', '1');
    // Deve passar sem erro porque contém letras
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it('7. descrição com linhas novas e tabs', async () => {
    await fillAndSubmit('Linha1\nLinha2\tLinha3', 'SetorX', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it('8. descrição com emojis', async () => {
    await fillAndSubmit('Tarefa 😎🔥', 'SetorX', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it('9. descrição com unicode estranho', async () => {
    await fillAndSubmit('任务处理', 'SetorX', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it('10. descrição com script malicioso', async () => {
    await fillAndSubmit('<script>alert("xss")</script>', 'SetorX', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  // ok
  // it('11. nome_setor vazio', async () => {
  //   await fillAndSubmit('Tarefa válida', '', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/insira o nome do setor/i)).toBeTruthy();
  // });

  // it('12. nome_setor só espaços', async () => {
  //   await fillAndSubmit('Tarefa válida', '    ', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/nome do setor não pode estar em branco/i)).toBeTruthy();
  // });

  // it('13. nome_setor muito longo', async () => {
  //   await fillAndSubmit('Tarefa válida', 'Departamento de Desenvolvimento', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/nome do setor deve ter até 20 caracteres/i)).toBeTruthy();
  // });

  // it('14. nome_setor só números', async () => {
  //   await fillAndSubmit('Tarefa válida', '123456', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/nome do setor não pode ser apenas números/i)).toBeTruthy();
  // });

  // it('15. nome_setor só símbolos', async () => {
  //   await fillAndSubmit('Tarefa válida', '!!!@@@###', 'baixo', 'pendente', '1');
  //   expect(await screen.findByText(/nome do setor não pode ser apenas símbolos/i)).toBeTruthy();
  // });

  // nok
  it('16. nome_setor com espaços no começo e fim', async () => {
    await fillAndSubmit('Tarefa válida', '  Marketing  ', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  it('17. nome_setor com maiúsculas, minúsculas e acentos', async () => {
    await fillAndSubmit('Tarefa válida', 'Desenvolvimento Ágil', 'baixo', 'pendente', '1');
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
    });
  });

  // it('18. nome_setor com unicode misturado', async () => {
  //   await fillAndSubmit('Tarefa válida', 'Департамент', 'baixo', 'pendente', '1');
  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
  //   });
  // });

  // it('19. nome_setor com script injetado', async () => {
  //   await fillAndSubmit('Tarefa válida', '<img src=x onerror=alert(1)>', 'baixo', 'pendente', '1');
  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
  //   });
  // });

  // it('20. prioridade inválida', async () => {
  //   await fillAndSubmit('Tarefa válida', 'SetorX', 'urgentissimo', 'pendente', '1');
  //   expect(await screen.findByText(/selecione uma prioridade/i)).toBeTruthy();
  // });

  // it('21. status inválido', async () => {
  //   await fillAndSubmit('Tarefa válida', 'SetorX', 'baixo', 'finalizado', '1');
  //   expect(await screen.findByText(/selecione um status/i)).toBeTruthy();
  // });

  // Extras:

  // it('id_usuario vazio', async () => {
  //   await fillAndSubmit('Tarefa válida', 'SetorX', 'baixo', 'pendente', '');
  //   expect(await screen.findByText(/selecione um usuário/i)).toBeTruthy();
  // });

  // it('id_usuario muito longo', async () => {
  //   const longId = 'a'.repeat(101);
  //   await fillAndSubmit('Tarefa válida', 'SetorX', 'baixo', 'pendente', longId);
  //   expect(await screen.findByText(/id do usuário deve ter até 100 caracteres/i)).toBeTruthy();
  // });

  // it('id_usuario com caracteres estranhos', async () => {
  //   await fillAndSubmit('Tarefa válida', 'SetorX', 'baixo', 'pendente', '<script>');
  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso');
  //   });
  // });

});
