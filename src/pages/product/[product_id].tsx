import { useCallback } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Params } from "next/dist/next-server/server/router";
import { toast } from "react-toastify";
import { gql } from "@apollo/client";
import { formatMoney } from "../../utils/money";
import { Product } from "../../models/Product";
import { client } from "../../services/api";
import { useCart } from "../../hooks/cart";
import { Container, BackContainer, ItemContainer } from "./styles";

interface StaticProps {
  product: Product;
}

export default function ProductPage({ product }: StaticProps) {
  const { addToCart } = useCart();

  const addItemToCart = useCallback(() => {
    addToCart(product);
    toast.success(`${product?.name} adicionado ao carrinho!`);
  }, [product, addToCart]);

  return (
    <Container>
      <Head>
        <title>{`capputeeno | ${product?.name}`}</title>
        <meta
          name="descrition"
          content={`capputeeno, página de detalhes do produto ${product?.name}`}
        />
      </Head>

      <div>
        <Link href="/" passHref>
          <BackContainer>
            <Image
              width="24px"
              height="24px"
              src="/assets/back.svg"
              alt="Back"
            />
            <p>Voltar</p>
          </BackContainer>
        </Link>
        <ItemContainer>
          <Image
            width="100%"
            height="580px"
            src={
              product?.image_url ||
              "https://geminus.com.br/template_base/icones_svg/erro404.svg"
            }
            alt={`imagem ${product?.name}`}
          />
          <div>
            <p className="category">
              {product?.category === "t-shirts" ? "Camiseta" : "Caneca"}
            </p>
            <h1>{product?.name}</h1>
            <h2>{product?.convertedPrice}</h2>
            <small>
              *Frete de R$40,00 para todo o Brasil. Grátis para compras acima de
              R$900,00.
            </small>
            <p className="description-title">DESCRIÇÃO</p>
            <span>{product?.description}</span>

            <button onClick={addItemToCart}>
              <Image
                width="24px"
                height="24px"
                src="/assets/shopping_white.svg"
                alt="Adding"
              />
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </ItemContainer>
      </div>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
      query GetAllProductsIds {
        allProducts {
          id
        }
      }
    `,
  });

  const paths = data.allProducts.map((product: Product) => {
    return {
      params: { product_id: product.id },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}: Params) => {
  const { product_id } = params;

  const { data } = await client.query({
    query: gql`
      query GetProductById($productId: ID!) {
        Product(id: $productId) {
          name
          description
          image_url
          category
          id
          price_in_cents
        }
      }
    `,
    variables: { productId: product_id },
  });

  const newProductWithConvertedPrice = {
    ...data.Product,
    convertedPrice: formatMoney(Number(data.Product?.price_in_cents)),
  };

  if (!newProductWithConvertedPrice.id) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product: newProductWithConvertedPrice,
    },
    revalidate: 60 * 30, //30 min
  };
};
