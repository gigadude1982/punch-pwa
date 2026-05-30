import { render, screen } from "@testing-library/react";

declare let __APP_VERSION__: string;

describe("Footer", () => {
  const fetchSpy = jest.spyOn(global, "fetch");

  afterEach(() => {
    jest.resetModules();
    fetchSpy.mockReset();
  });

  describe("when __APP_VERSION__ is a valid non-empty string", () => {
    beforeEach(() => {
      (globalThis as unknown as Record<string, unknown>)["__APP_VERSION__"] = "1.2.3";
    });

    it("renders the footer element", async () => {
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders the version string prefixed with v", async () => {
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.getByTestId("footer-version")).toBeInTheDocument();
      expect(screen.getByTestId("footer-version")).toHaveTextContent("v1.2.3");
    });
  });

  describe("when __APP_VERSION__ is undefined", () => {
    beforeEach(() => {
      (globalThis as unknown as Record<string, unknown>)["__APP_VERSION__"] = undefined;
    });

    it("renders the footer element without throwing", async () => {
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render any version text", async () => {
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is an empty string", () => {
    beforeEach(() => {
      (globalThis as unknown as Record<string, unknown>)["__APP_VERSION__"] = "";
    });

    it("renders the footer element without throwing", async () => {
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render any version text", async () => {
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("when __APP_VERSION__ is null", () => {
    beforeEach(() => {
      (globalThis as unknown as Record<string, unknown>)["__APP_VERSION__"] = null;
    });

    it("renders the footer element without throwing", async () => {
      const { Footer } = await import("./Footer");
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render any version text", async () => {
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(screen.queryByTestId("footer-version")).not.toBeInTheDocument();
    });
  });

  describe("no network activity during rendering", () => {
    beforeEach(() => {
      (globalThis as unknown as Record<string, unknown>)["__APP_VERSION__"] = "2.0.0";
    });

    it("never calls fetch when rendering the Footer", async () => {
      fetchSpy.mockResolvedValue(new Response());
      const { Footer } = await import("./Footer");
      render(<Footer />);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
