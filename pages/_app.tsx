import { ClerkProvider, useSession } from '@clerk/nextjs'; // Correção para uso de Clerk
import { dark } from '@clerk/themes';
import type { AppProps } from 'next/app';
import { ptBR } from '@clerk/localizations';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import Loading from './Loading'; // Componente de loading

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} localization={ptBR} >
      <ClerkWrapper>
        <Component {...pageProps} />
      </ClerkWrapper>
    </ClerkProvider>
  );
}

const ClerkWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const { isLoaded } = useSession(); // Obtém o estado de carregamento da sessão do Clerk

  useEffect(() => {
    if (isLoaded) {
      setIsClerkLoaded(true);
    }
  }, [isLoaded]);

  if (!isClerkLoaded) {
    return <Loading />; // Exibe o componente Loading até que o Clerk esteja totalmente carregado
  }

  return <>{children}</>;
};