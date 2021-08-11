import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "react-loader-spinner";
import { Product } from "../../models/Product";
import { useCart } from "../../hooks/cart";
import { useGetAllProductsByName } from "../../utils/graphql";

import {
  Container,
  Logo,
  SearchContainer,
  CartContainer,
  BagContainer,
  SearchContent,
  ResultsContent,
} from "./styles";

export function Header() {
  const { quantityCart } = useCart();
  const [value, setValue] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { refetch } = useGetAllProductsByName(value);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await refetch();
      setSearchProducts(data.allProducts);
      setLoading(false);
    } catch (err) {
      console.log('Error Search', err);
      
    }
  }, [refetch]);

  useEffect(() => {
    if (value) {
        getProducts();
    }
  }, [getProducts, value]);

  return (
    <Container onClick={() => setValue("")}>
      <div>
        <Link href="/" passHref>
          <Logo>capputeeno</Logo>
        </Link>
        <div>
          <SearchContainer>
            <SearchContent>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Procurando por algo específico?"
                type="text"
              />
              {loading ? (
                <Loader type="Puff" color="#737380" height={24} width={24} />
              ) : (
                <Image
                  width="24px"
                  height="24px"
                  src="/assets/search.svg"
                  alt="Search"
                />
              )}
            </SearchContent>
            {searchProducts.length > 0 && value && (
              <ResultsContent>
                {searchProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} passHref>
                    <div onClick={() => setSearchProducts([])}>
                      <Image
                        width="40px"
                        height="40px"
                        src={product.image_url}
                        alt={"Imagem" + product.name}
                      />
                      <p>{product.name}</p>
                    </div>
                  </Link>
                ))}
              </ResultsContent>
            )}
            {searchProducts.length === 0 && value && !loading && (
              <div
                onClick={() => {
                  setValue("");
                }}
              >
                <ResultsContent>
                  <div>
                    <p>Nenhum produto encontrado com este nome</p>
                  </div>
                </ResultsContent>
              </div>
            )}
          </SearchContainer>
          <Link href="/cart" passHref>
            <CartContainer>
              <Image
                width="24px"
                height="24px"
                src="/assets/shopping.svg"
                alt="Shopping"
              />
              <BagContainer>
                {quantityCart > 0 && <div>{quantityCart}</div>}
              </BagContainer>
            </CartContainer>
          </Link>
        </div>
      </div>
    </Container>
  );
}
