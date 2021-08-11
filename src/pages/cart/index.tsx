import { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../hooks/cart";
import { formatMoney } from "../../utils/money";
import { CartProduct } from "../../components/CartProduct";
import { Dialog } from "../../components/Dialog";

import {
  Container,
  BackContainer,
  ItemContainer,
  CartItems,
  Resume,
  CartItemsList,
  CheckoutContainer,
} from "../../styles/Cart";

export default function Cart() {
  const { products, quantityCart, totalPrice, cleanCart } = useCart();
  const [openDialog, setDialog] = useState(false);

  const checkout = useCallback(() => {
    cleanCart();
    setDialog(false);
  }, [cleanCart]);

  return (
    <>
      <Dialog open={openDialog}>
        <CheckoutContainer>
          <h2>Compra realizada com sucesso</h2>
          <p>
            Seu pedido é o número:{" "}
            <strong>
              #{Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}
            </strong>{" "}
          </p>
          <p>Seu carrinho será esvaziado.</p>

          <button onClick={checkout}>Continuar</button>
        </CheckoutContainer>
      </Dialog>
      <Container>
        <Head>
          <title>Capputeeno | Carrinho</title>
          <meta name="descrition" content="Capputeeno - Meu Carrinho" />
        </Head>
        <div>
          <ItemContainer>
            <Link href="/" passHref>
              <BackContainer>
                <Image
                  width="24px"
                  height="24px"
                  src="/assets/back.svg"
                  alt="Adding"
                />
                <p>Voltar</p>
              </BackContainer>
            </Link>
            <CartItems>
              <h1>SEU CARRINHO</h1>
              <p>
                Total ({quantityCart}{" "}
                {quantityCart === 1 ? "produto" : "produtos"}){" "}
                <strong>{formatMoney(Number(totalPrice))}</strong>
              </p>
              <CartItemsList>
                {Array.isArray(products) && products.length > 0 ? (
                  products.map((product) => (
                    <CartProduct
                      key={product.id}
                      imageUrl={product.image_url}
                      description={product.description}
                      id={product.id}
                      name={product.name}
                      price={product.price_in_cents}
                      quantity={product.quantity}
                    />
                  ))
                ) : (
                  <span>Carrinho vazio</span>
                )}
              </CartItemsList>
            </CartItems>
          </ItemContainer>
          <Resume>
            <h1>Resumo do pedido</h1>
            <div className="resume-price">
              <p>Subtotal de produtos</p>
              <p>{formatMoney(totalPrice)}</p>
            </div>
            <div className="resume-price">
              <p>Entrega</p>
              <p>{quantityCart > 0 ? 'R$ 40,00' : 'R$ 0,00'}</p>
            </div>
            <div className="total-price">
              <strong>Total</strong>
              <strong>{formatMoney(Number(totalPrice) + (quantityCart > 0 ? 40 : 0))}</strong>
            </div>
            <button disabled={quantityCart === 0} onClick={() => setDialog(true)}>
              Finalizar a compra
            </button>
            <a
              className="first-link"
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ajuda
            </a>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              reembolsos
            </a>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              entregas e frete
            </a>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              trocas e devoluções
            </a>
          </Resume>
        </div>
      </Container>
    </>
  );
}
