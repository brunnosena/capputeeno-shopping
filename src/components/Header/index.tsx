import Image from 'next/image';
import { Container } from './styles';

export function Header() {
  return (
    <Container>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      <p>O Melhor para você ouvir</p>
      <span>spannnn</span>
    </Container>
  );
}