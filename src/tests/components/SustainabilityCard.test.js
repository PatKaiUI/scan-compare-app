import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SustainabilityCard from "../../components/product/SustainabilityCard";

describe("SustainabilityCard", () => {
  const defaultProps = {
    title: "Eco-Score",
    value: "A",
    unit: "",
    color: "green",
  };

  it("renders with correct title and value", () => {
    render(<SustainabilityCard {...defaultProps} />);

    expect(screen.getByText("Eco-Score")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("applies correct color classes", () => {
    render(<SustainabilityCard {...defaultProps} />);
    const card = screen.getByTestId("sustainability-card");
    expect(card).toHaveClass("bg-green-50");
    expect(card).toHaveClass("text-green-600");
  });

  it("handles different color variants", () => {
    const colors = ["green", "blue", "yellow", "purple"];

    colors.forEach((color) => {
      render(<SustainabilityCard {...defaultProps} color={color} />);
      const cards = screen.getAllByTestId("sustainability-card");
      const card = cards[cards.length - 1];
      expect(card).toHaveClass(`bg-${color}-50`);
      expect(card).toHaveClass(`text-${color}-600`);
    });
  });

  it("displays unit when provided", () => {
    render(<SustainabilityCard {...defaultProps} value="100" unit="g" />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();
  });

  it("handles empty values gracefully", () => {
    render(<SustainabilityCard {...defaultProps} value="" unit="" />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
