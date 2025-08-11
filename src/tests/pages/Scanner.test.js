import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Scanner from "../../pages/Scanner";
import { Html5QrcodeScanner } from "html5-qrcode";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Scanner Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders scanner interface", () => {
    renderWithRouter(<Scanner />);

    expect(screen.getByText("Barcode scannen")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Barcode manuell eingeben")
    ).toBeInTheDocument();
  });

  it("handles manual barcode input", () => {
    renderWithRouter(<Scanner />);

    const input = screen.getByPlaceholderText("Barcode manuell eingeben");
    const button = screen.getByText("Scannen");

    fireEvent.change(input, { target: { value: "123456789" } });
    fireEvent.click(button);

    // Überprüfe, ob die Navigation stattfindet
    expect(window.location.pathname).toBe("/product/123456789");
  });

  it("shows error message for invalid barcode", () => {
    window.alert = jest.fn(); // Mock für alert

    renderWithRouter(<Scanner />);

    const input = screen.getByPlaceholderText("Barcode manuell eingeben");
    const button = screen.getByText("Scannen");

    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith(
      "Bitte geben Sie einen gültigen Barcode ein"
    );
  });

  it("cleans up scanner on unmount", () => {
    const { unmount } = renderWithRouter(<Scanner />);
    unmount();

    // Überprüfe, ob die clear-Methode des Mocks aufgerufen wurde
    expect(Html5QrcodeScanner.mock.instances[0].clear).toHaveBeenCalled();
  });
});
