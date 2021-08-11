import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "react-loader-spinner";
import { Product } from "../../models/Product";
import {
  Container,
  Logo,
  SearchContainer,
  BagContainer,
  SearchContent,
  ResultsContent,
} from "./styles";
import { useCart } from "../../hooks/cart";
import { useCallback } from "react";

export function Header() {
  const { quantityCart } = useCart();
  const [value, setValue] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const getProducts = useCallback(async () => {
    setLoading(true);

    try {
      setSearchProducts([]);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (value) {
      const timer = setTimeout(() => {
        getProducts();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value]);

  return (
    <Container>
      <div>
        <Link href="/">
          <Logo>capputeeno</Logo>
        </Link>
        <div>
          <button
            onClick={() => {
              setValue("");
            }}
          >
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
                    <Link key={product.id} href={`/product/${product.id}`}>
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
                <button
                  onClick={() => {
                    setValue("");
                  }}
                >
                  <ResultsContent>
                    <div>
                      <p>Nenhum produto encontrado com este nome</p>
                    </div>
                  </ResultsContent>
                </button>
              )}
            </SearchContainer>
            <Link href="/cart">
              <div>
                <Image
                  width="36px"
                  height="36px"
                  src="/assets/shopping.svg"
                  alt="Shopping"
                />
                <BagContainer>
                  {quantityCart > 0 && <div>{quantityCart}</div>}
                </BagContainer>
              </div>
            </Link>
          </button>
        </div>
      </div>
    </Container>
  );
}
