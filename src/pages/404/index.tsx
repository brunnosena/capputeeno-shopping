import Head from "next/head";
import { FiSearch } from "react-icons/fi";
import { Logo } from "../../components/Header/styles";

import { PageError } from "../../styles/404";

export default function NotFound() {
  return (
    <PageError>
      <Head>
        <title>Capputeeno | página não encontrada</title>
        <meta name="descrition" content="Capputeeno - Página não encontrada" />
      </Head>
      <div>
        <Logo />
        <h1>404 </h1>
        <h2>
          <FiSearch style={{ marginRight: "16px" }} />
          Página não encontrada
        </h2>
        <p>Não conseguimos encontrar essa página, tente novamente.</p>
      </div>
    </PageError>
  );
}