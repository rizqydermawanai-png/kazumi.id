import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastProvider } from '../hooks/useToast';
import { PrintProvider } from '../components/providers/PrintProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <PrintProvider>
        <Component {...pageProps} />
      </PrintProvider>
    </ToastProvider>
  );
}

export default MyApp;
