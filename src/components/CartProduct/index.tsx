import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

import { useCart } from "../../hooks/cart";
import { Dialog } from "../Dialog";
import { formatMoney } from "../../utils/money";
import { AlertContainer, Container } from "./styles";

interface ProductCardProps {
  imageUrl: string;
  name: string;
  description: string;
  price: string;
  id: string;
  quantity: number;
}

export function CartProduct({
  imageUrl,
  name,
  description,
  id,
  price,
  quantity,
}: ProductCardProps) {
  const [openDialog, setDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const { removeFromCart, increment, decrement } = useCart();

  const deleteItem = useCallback(() => {
    removeFromCart(itemToDelete);
    setDialog(false);
  }, [itemToDelete, removeFromCart]);

  return (
    <Container>
      <Dialog open={openDialog}>
        <AlertContainer>
          <h2>Tem certeza que deseja excluir?</h2>
          <p>Ao continuar o item será retirado do carrinho de compras.</p>
          <div>
            <button onClick={() => setDialog(false)}>Cancelar</button>
            <button onClick={deleteItem}>Continuar</button>
          </div>
        </AlertContainer>
      </Dialog>
      <div className="image-detail">
        <Image
          layout="responsive"
          height={211}
          width={256}
          src={imageUrl}
          alt={`imagem ${name}`}
        />
      </div>
      <div className="product-detail">
        <div>
          <Link href={`/product/${id}`} passHref>
            <p>{name}</p>
          </Link>
          <Image
            width="24px"
            height="24px"
            src="/assets/trash.svg"
            alt="Adding"
            onClick={() => {
              setDialog(true);
              setItemToDelete(id);
            }}
          />
        </div>
        <p>{description}</p>
        <div>
          <div>
            <FiMinusCircle
              size={30}
              color="#a8a8b3"
              cursor="pointer"
              onClick={() => decrement(id)}
            />
            <div>
              <p>{quantity}</p>
            </div>
            <FiPlusCircle
              size={30}
              color="#a8a8b3"
              cursor="pointer"
              onClick={() => increment(id)}
            />
          </div>
          <strong>{formatMoney(Number(price) * quantity)}</strong>
        </div>
      </div>
    </Container>
  );
}
