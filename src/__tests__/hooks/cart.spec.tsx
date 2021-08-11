import { renderHook, act } from "@testing-library/react-hooks";
import { useCart, CartProvider } from "../../hooks/cart";

describe("[Test] CartHook", () => {
  it("should be able to add to cart", async () => {
    jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });
    act(() => {
      result.current.addToCart({
        id: "1157",
        name: "Teste de item",
        price_in_cents: "80.00",
        category: "mugs",
        image_url: "https://via.placeholder.com/200x200",
        description: "Teste de item",
      });
    });

    expect(result.current.products[0].id).toEqual("1157");
  });

  it("should restore saved cart data from storage", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      switch (key) {
        case "@Capputeno":
          return JSON.stringify([
            {
              id: "1157",
              name: "Teste de item",
              price: "80.00",
              category: "mugs",
              image_url: "https://via.placeholder.com/200x200",
              description: "Teste de item",
            },
          ]);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart({
        id: "1157",
        name: "Teste de item",
        price_in_cents: "80.00",
        category: "mugs",
        image_url: "https://via.placeholder.com/200x200",
        description: "Teste de item",
      });
    });

    expect(result.current.products[0].id).toEqual("1157");
  });

  it("should be able to clean cart", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      switch (key) {
        case "@Capputeno":
          return JSON.stringify([
            {
              id: "user-123",
              name: "Brunno",
              email: "brunno@teste.com",
            },
          ]);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.cleanCart();
    });

    expect(result.current.products).toEqual([]);
  });
});
