import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { menuFallback } from "./data/menuFallback";
import * as api from "./lib/api";

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("App", () => {
  it("shows a warning when trying to submit an empty cart", async () => {
    vi.spyOn(api, "fetchMenu").mockResolvedValue(menuFallback);

    render(<App />);

    await screen.findByText("Dockploy friendly desde el dia uno.");

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Vale" } });
    fireEvent.change(screen.getByLabelText("Telefono"), { target: { value: "04120000000" } });
    fireEvent.click(screen.getByText("Enviar a WhatsApp"));

    expect(await screen.findByText("Agrega al menos un producto antes de enviar.")).toBeInTheDocument();
  });

  it("renders the menu and sends a WhatsApp order", async () => {
    vi.spyOn(api, "fetchMenu").mockResolvedValue(menuFallback);
    vi.spyOn(api, "submitOrder").mockResolvedValue({
      orderCode: "BB-AB123",
      subtotal: 22,
      whatsappMessage: "hola",
      whatsappUrl: "https://wa.me/584120000000?text=hola",
    });

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<App />);

    await screen.findByText("Dockploy friendly desde el dia uno.");

    fireEvent.click(screen.getAllByText("Agregar al pedido")[0]!);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Vale" } });
    fireEvent.change(screen.getByLabelText("Telefono"), { target: { value: "04120000000" } });
    fireEvent.change(screen.getByLabelText("Tipo de entrega"), { target: { value: "delivery" } });

    await waitFor(() => expect(screen.getByLabelText("Direccion")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Direccion"), { target: { value: "Av. Principal 123" } });
    fireEvent.click(screen.getByText("Enviar a WhatsApp"));

    await waitFor(() => {
      expect(api.submitOrder).toHaveBeenCalledOnce();
      expect(openSpy).toHaveBeenCalledWith(
        "https://wa.me/584120000000?text=hola",
        "_blank",
        "noopener,noreferrer",
      );
    });

    expect(screen.getByText(/Pedido BB-AB123 listo/)).toBeInTheDocument();
  });

  it("handles order submission failures and cart edits", async () => {
    vi.spyOn(api, "fetchMenu").mockResolvedValue(menuFallback);
    vi.spyOn(api, "submitOrder").mockRejectedValue(new Error("network"));

    render(<App />);

    await screen.findByText("Dockploy friendly desde el dia uno.");

    fireEvent.click(screen.getAllByText("Agregar al pedido")[0]!);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "-" }));
    fireEvent.change(screen.getByPlaceholderText("Nota para cocina"), {
      target: { value: "sin pepinillos" },
    });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Vale" } });
    fireEvent.change(screen.getByLabelText("Telefono"), { target: { value: "04120000000" } });
    fireEvent.change(screen.getByLabelText("Metodo de pago"), { target: { value: "Efectivo" } });
    fireEvent.change(screen.getByLabelText("Hora estimada"), { target: { value: "30 minutos" } });
    fireEvent.change(screen.getByLabelText("Notas generales"), { target: { value: "tocar timbre" } });
    fireEvent.click(screen.getByText("Enviar a WhatsApp"));

    await waitFor(() =>
      expect(screen.getByText("No pudimos crear el pedido. Revisa el API o intenta de nuevo.")).toBeInTheDocument(),
    );
  });
});
