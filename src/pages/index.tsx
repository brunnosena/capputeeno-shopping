import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Loader from "react-loader-spinner";
import { gql } from "@apollo/client";
import { Product } from "../models/Product";
import { useProducts } from "../hooks/product";
import { useGlobalState } from "../hooks/stateGlobal";
import { Organize } from "../components/Organize";
import { Pagination } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { client } from "../services/api";
import { formatMoney } from "../utils/money";
import { useGetAllProductsByPage } from "../utils/graphql";
import {
  Container,
  FilterContainer,
  CategoryList,
  Category,
  LoadingContainer,
  ProductsContainer,
} from "../styles/Home";

interface HomeProps {
  allProducts: Product[];
  totalProducts: number;
}

export default function Home({ allProducts, totalProducts }: HomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const { products, setProducts, countProducts, setCountProducts } =
    useProducts();

  const { stateGlobal } = useGlobalState();

  const { refetch } = useGetAllProductsByPage(
    currentPage - 1,
    12,
    category,
    stateGlobal.sort,
    stateGlobal.order
  );

  const getProducts = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await refetch();

      const newDataConvertedPrice = data.allProducts.map((product: Product) => {
        return {
          ...product,
          convertedPrice: formatMoney(Number(product.price_in_cents)),
        };
      });

      setProducts(newDataConvertedPrice);
      setCountProducts(data._allProductsMeta.count);
    } catch (err) {
      setLoading(false);
      console.log("Erro aqui ->", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [refetch, setCountProducts, setProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    getProducts();
  }, [category, currentPage, getProducts, stateGlobal]);

  useEffect(() => {
    setProducts(allProducts);
    setCountProducts(totalProducts);
  }, [allProducts, setCountProducts, setProducts, totalProducts]);

  return (
    <Container>
      <Head>
        <title>Capputeeno | Home</title>
        <meta name="descrition" content="Capputeeno - Home" />
      </Head>
      <div>
        <FilterContainer>
          <CategoryList>
            <Category
              onClick={() => setCategory("all")}
              selected={category === "all"}
            >
              TODOS OS PRODUTOS
            </Category>
            <Category
              onClick={() => setCategory("t-shirts")}
              selected={category === "t-shirts"}
            >
              CAMISETAS
            </Category>
            <Category
              onClick={() => setCategory("mugs")}
              selected={category === "mugs"}
            >
              CANECAS
            </Category>
          </CategoryList>
          <Organize />
        </FilterContainer>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProducts={countProducts}
        />
        {loading ? (
          <LoadingContainer>
            <Loader type="Puff" color="#737380" />
            <h1>Carregando...</h1>
          </LoadingContainer>
        ) : (
          <ProductsContainer>
            {products.length > 0 ? (
              products.map((product, index) => {
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imageUrl={product.image_url}
                    name={product.name}
                    price={product.convertedPrice || "0"}
                  />
                );
              })
            ) : (
              <span>Nenhum item encontrado</span>
            )}
          </ProductsContainer>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProducts={countProducts}
        />
      </div>
    </Container>
  );
}

export async function getStaticProps() {
  const { data, networkStatus } = await client.query({
    query: gql`
      query GetAllProducts {
        allProducts(page: 1, perPage: 12) {
          name
          price_in_cents
          id
          image_url
        }
        _allProductsMeta {
          count
        }
      }
    `,
  });

  const newDataConvertedPrice = data.allProducts.map((product: Product) => {
    return {
      ...product,
      convertedPrice: formatMoney(Number(product.price_in_cents)),
    };
  });

  return {
    props: {
      allProducts: newDataConvertedPrice,
      totalProducts: data._allProductsMeta.count,
    },
  };
}
