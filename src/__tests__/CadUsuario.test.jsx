import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadUsuario } from '../pages/cadUsuario';
import { expect, it, vi } from 'vitest';

// Mock global para o alert()
global.alert = vi.fn();

describe('CadUsuario', () => {

  beforeEach(() => {
    render(<CadUsuario />);
  });

  it('a tela é renderizada', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const botao = screen.getAllByRole("button", {name:/Cadastrar/i });

    expect(nomeInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(botao).toBeTruthy();
  });

  it('não permitir mais que 40 caracteres no campo email', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Preenche os campos com valores
    fireEvent.input(nomeInput, { target: { value: 'bruno' } });
    fireEvent.input(emailInput, { target: { value: 'exacsaasdgvew4332413refwdvwrt4234ewrqdafsgh42rewfdsvgrw4t232rewqfdgrw43t23erwfdsg4243ewqrfdst4234ewrq3143#$#@$@##$@!$#mple@email.com' } });

    // Clica no botão de submit
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Verificar se o alert foi chamado com a mensagem esperada
    await waitFor(() => {
      expect(screen.getByText('Insira até 40 caracteres')).toBeTruthy();
    });
  });

  it('não permitir mais que 30 caracteres no campo nome', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Preenche os campos com valores
    fireEvent.input(nomeInput, { target: { value: 'A linda rosa juvenil, juvenil, juvenil A linda rosa juvenil, juvenil A linda rosa juvenil, juvenil A linda rosa juvenil, juvenil Mas uma feiticeira má, muito má, muito má Mas uma feiticeira má, muito má Adormeceu a rosa assim, bem assim, bem assim dormeceu a rosa assim, bem assim' } });
    fireEvent.input(emailInput, { target: { value: 'example@email.com' } });

    // Clica no botão de submit
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Verificar se o alert foi chamado com a mensagem esperada
    await waitFor(() => {
      expect(screen.getByText('Insira até 30 caracteres')).toBeTruthy();
    });
  });

  it('deve resetar os campos após submissão', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Preenche os campos com valores
    fireEvent.input(nomeInput, { target: { value: 'Maria' } });
    fireEvent.input(emailInput, { target: { value: 'maria@email.com' } });

    // Clica no botão de submit
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    // Verificar se o alert foi chamado com a mensagem esperada
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso');
    });

    // Espera que os campos sejam resetados
    expect(nomeInput.value).toBe(''); // Verifica se o campo de nome foi limpo
    expect(emailInput.value).toBe(''); // Verifica se o campo de email foi limpo
  });

  it('não deve permitir nome contendo apenas espaços', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: '     ' } }); // Só espaços
    fireEvent.input(emailInput, { target: { value: 'email@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Nome não pode estar em branco')).toBeTruthy();
    });
  });

  it('não deve permitir nome contendo apenas números', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: '123456' } }); // Apenas números
    fireEvent.input(emailInput, { target: { value: 'email@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Nome não pode ser apenas números')).toBeTruthy();
    });
  });

  it('não deve permitir nome com números entre letras', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: 'Maria123' } }); // Letras e números
    fireEvent.input(emailInput, { target: { value: 'email@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Use apenas letras e espaços')).toBeTruthy();
    });
  });

  it('não deve permitir email sem domínio', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: 'Maria' } });
    fireEvent.input(emailInput, { target: { value: 'email@' } }); // Email sem domínio

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Formato de email inválido')).toBeTruthy();
    });
  });

  it('não deve permitir email sem o "@"', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: 'Maria' } });
    fireEvent.input(emailInput, { target: { value: 'email.com' } }); // Email sem "@"

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Formato de email inválido')).toBeTruthy();
    });
  });

  it('não deve permitir campos vazios', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: '' } }); // Nome vazio
    fireEvent.input(emailInput, { target: { value: '' } }); // Email vazio

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Insira ao menos 1 caractere')).toBeTruthy(); // Para nome
      expect(screen.getByText('Insira ao menos 5 caracteres')).toBeTruthy(); // Para email
    });
  });

  it('não deve permitir campo email vazio', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);

    fireEvent.input(nomeInput, { target: { value: 'bruno' } }); // Nome válido

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Insira ao menos 5 caracteres')).toBeTruthy(); // Para email
    });
  });

  it('não deve permitir campo nome vazio', async () => {
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.input(emailInput, { target: { value: 'example@gmail.com' } }); // Email válido

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Insira ao menos 1 caractere')).toBeTruthy(); // Para nome
    });
  });

  it('deve permitir o cadastro com dados válidos', async () => {

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: 'Maria' } });
    fireEvent.input(emailInput, { target: { value: 'maria@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso');
    });
  });
});
