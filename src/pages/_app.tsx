import { SearchProvider } from '@/contexts/SearchContext'
import Navbar from '../components/Navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ListProvider } from '@/contexts/ListContext'
import { StatsProvider } from '@/contexts/StatsContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SearchProvider>
        <ListProvider>
          <StatsProvider>
            <Navbar />
            <Component {...pageProps} />
          </StatsProvider>
        </ListProvider>
      </SearchProvider>
    </>
  )
}
