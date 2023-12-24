import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Search', href: '/search' },
  { name: 'My Games', href: '/list' },
  { name: 'Stats', href: '/stats' },
  { name: 'Add from scratch', href: '/custom' },
]

const Navbar: React.FC = () => {
  return (
    <Disclosure as="nav" className="bg-base-300">
      {({ open }) => (
        <>
          <div className="max-w-8xl container mx-auto px-4">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" passHref>
                    <Image
                      src={'/images/magus.png'}
                      alt={`Logo`}
                      width={50}
                      height={50}
                      data-testid="logo"
                    />
                  </Link>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  <Disclosure.Button
                    className="btn btn-ghost lg:hidden"
                    data-testid="hamburger-menu"
                  >
                    {open ? (
                      <XMarkIcon className="h-5 w-5" />
                    ) : (
                      <Bars3Icon className="h-5 w-5" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-4" data-testid="menu-items">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href} passHref>
                        <button className="btn btn-ghost">{item.name}</button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="absolute z-20 w-full lg:hidden">
            <div
              className="space-y-1 bg-base-300 px-2 pt-6 shadow"
              data-testid="hamburger-menu-items"
            >
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="btn btn-ghost block w-full text-left"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
