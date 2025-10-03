import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadUsuario } from "../pages/cadUsuario";
import { describe, it, expect } from "vitest";
 
describe("CadUsuario", () => {
 
  it("deve renderizar todos os campos do formulário", () => {
    render(<CadUsuario />);
 
    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const botao = screen.getByRole("button", { name: /cadastrar/i });
 
    expect(nomeInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(botao).toBeTruthy();
  });
 
  it("deve mostrar erros quando campos estiverem vazios", async () => {
    render(<CadUsuario />);
 
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
 
    await waitFor(() => {
      expect(screen.getByText("Informe ao menos um valor")).toBeTruthy();
      expect(screen.getByText("Preencha o campo com seu email")).toBeTruthy();
    });
  });
 
  it("deve mostrar erro quando o email tiver formato inválido", async () => {
    render(<CadUsuario />);
 
    fireEvent.input(screen.getByLabelText(/nome/i), { target: { value: "Maria" } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: "emailinvalido" } });

  fireEvent.submit(screen.getByRole("form") || screen.getByRole("button", { name: /cadastrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
    });
  });
 
  it("deve resetar os campos após submissão", async () => {
    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.input(nomeInput, { target: { value: "Maria" } });
    fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(nomeInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });
 
});
 