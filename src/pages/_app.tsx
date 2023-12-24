import { SearchProvider } from '@/contexts/SearchContext'
import Navbar from '../components/Navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ListProvider } from '@/contexts/ListContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SearchProvider>
        <ListProvider>
          <Navbar />
          <Component {...pageProps} />
        </ListProvider>
      </SearchProvider>
    </>
  )
}
