import { render, screen } from "@testing-library/react";
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
    const { container } = render(<SustainabilityCard {...defaultProps} />);

    expect(container.firstChild).toHaveClass("bg-green-50");
    expect(container.firstChild).toHaveClass("text-green-600");
  });

  it("handles different color variants", () => {
    const colors = ["green", "blue", "yellow", "purple"];

    colors.forEach((color) => {
      const { container } = render(
        <SustainabilityCard {...defaultProps} color={color} />
      );

      expect(container.firstChild).toHaveClass(`bg-${color}-50`);
      expect(container.firstChild).toHaveClass(`text-${color}-600`);
    });
  });

  it("displays unit when provided", () => {
    render(<SustainabilityCard {...defaultProps} value="100" unit="g" />);

    expect(screen.getByText("100 g")).toBeInTheDocument();
  });

  it("handles empty values gracefully", () => {
    render(<SustainabilityCard {...defaultProps} value="" unit="" />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
