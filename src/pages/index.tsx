import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Magus: a Game Backlog wizard 🧙</title>
        <meta name="description" content="Magus: a Game Backlog wizard 🧙" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center">
        <div
          className="hero max-h-screen"
          style={{
            backgroundImage: 'url(/images/bg.jpeg)',
            height: '100vh',
            width: '100vw',
            backgroundSize: 'cover',
          }}
        >
          <div className="hero-overlay bg-opacity-75"></div>
          <div className="hero-content text-center">
            <div className="max-w-5xl">
              <h1 className="py-6 text-4xl font-bold">
                Magus: a Game Backlog wizard 🧙
              </h1>
              <div className="flex flex-col items-center space-y-4">
                <Link href="/search" passHref>
                  <button className="btn btn-primary w-40 font-medium">
                    Search
                  </button>
                </Link>
                <Link href="/list" passHref>
                  <button className="btn btn-secondary w-40 font-medium">
                    My Games
                  </button>
                </Link>
                <Link href="/stats" passHref>
                  <button className="btn btn-accent w-40 font-medium">
                    Stats
                  </button>
                </Link>
                <Link href="/custom" passHref>
                  <button className="btn btn-info w-40 font-medium">
                    Add from scratch
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
