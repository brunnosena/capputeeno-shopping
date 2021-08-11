import { mocked } from "ts-jest/utils";
import { Product } from "../../models/Product";
import {
  getStaticPaths,
  getStaticProps,
} from "../../pages/product/[product_id]";
import { client } from "../../services/api";

jest.mock("../../services/api.ts");

jest.mock("../../hooks/cart.tsx", () => {
  return {
    useCart() {
      return {
        quantityCart: 2,
      };
    },
  };
});

describe("Product page", () => {
  it("loads initial data", async () => {
    const clientGraphQlMockedPaths = mocked(client.query);

    clientGraphQlMockedPaths.mockResolvedValueOnce({
      data: {
        allProducts: [{ id: "123" }],
      },
    } as any);

    const paths = await getStaticPaths({});

    const clientGraphQlMocked = mocked(client.query);

    clientGraphQlMocked.mockResolvedValueOnce({
      data: {
        Product: {
          name: "teste",
          price: "80.00",
          id: "123",
          image_url: "string",
          convertedPrice: "R$ 80,00",
          category: "mugs",
          description: "teste description",
        },
      },
    } as any);

    const response = (await getStaticProps({
      params: { product_id: "123" },
    })) as { props: { product: Product } };

    expect(response.props.product.id).toEqual("123");
  });
});
