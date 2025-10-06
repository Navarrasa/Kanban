import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadUsuario } from '../pages/cadUsuario'; // Ajuste o caminho conforme necessário
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

// Mock global para o alert()
global.alert = vi.fn();

describe('CadUsuario', () => {
  it('deve resetar os campos após submissão', async () => {
    // Mock da resposta da requisição
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<CadUsuario />);

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
    render(<CadUsuario />);

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
    render(<CadUsuario />);

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
    render(<CadUsuario />);

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
    render(<CadUsuario />);

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
    render(<CadUsuario />);

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
    render(<CadUsuario />);

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

  it('deve permitir o cadastro com dados válidos', async () => {
    render(<CadUsuario />);

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
