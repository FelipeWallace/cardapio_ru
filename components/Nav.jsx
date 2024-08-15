'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

// import { signIn, signOut, useSession, getProviders } from "next-auth/react"

const Nav = () => {
  const isUserLoggedIn = true
  // const isUserAdmin = true

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Restaurante Universitário</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {isUserLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/avaliar" className="black_btn">
              Avaliar
            </Link>

            <button type="button"  className="outline_btn">
              Sair
            </button>

            <Link href="/profile">
              <Image 
                src="/assets/images/logo.svg"
                alt="profile"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div> 
        ): (
          <>

          </>
        )}
      </div>
        
      
      {/* Mobile Navigation */}

    </nav>
  )
}

export default Nav
