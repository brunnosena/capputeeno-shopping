import GlobalStyle from "../styles/GlobalStyles";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import AppContainer from "../hooks";
import { client } from "../services/api";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>

    <AppContainer>
      <Header />
      <Component {...pageProps} />
      <GlobalStyle />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
    </AppContainer>
        </ApolloProvider>
  );
}
export default MyApp;
