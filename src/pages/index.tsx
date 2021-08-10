import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Header } from "../components/Header/index";
import {
  Container,
  FilterContainer,
  CategoryList,
  Category,
  ProductsContainer,
} from "../styles/Home";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Capputeeno | Home</title>
        <meta name="descrition" content="Capputeeno - Home" />
      </Head>
    </Container>
  );
}
