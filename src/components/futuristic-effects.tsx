"use client"

import { useEffect } from "react"

export default function FuturisticEffects() {
  useEffect(() => {
    // Add futuristic hover effects for cards
    const cards = document.querySelectorAll(".card")
    cards.forEach((card) => {
      // Create a subtle glow effect on hover
      card.addEventListener("mouseenter", function () {
        ;(this as HTMLElement).style.boxShadow = "0 8px 30px rgba(0, 199, 254, 0.15)"
      })

      card.addEventListener("mouseleave", function () {
        ;(this as HTMLElement).style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
      })
    })

    // Add pulse effect to Jarvis brand (if on homepage)
    const futuristicBrand = document.querySelector(".futuristic-brand")
    if (futuristicBrand && window.location.pathname === "/") {
      // Pulse effect for the brand every 5 seconds
      setInterval(() => {
        futuristicBrand.classList.add("pulse-effect")
        setTimeout(() => {
          futuristicBrand.classList.remove("pulse-effect")
        }, 1000)
      }, 5000)
    }

    // Add subtle transition effect for page load
    document.body.classList.add("fade-in")

    // Add glowing effect to buttons with class btn-glow
    const glowButtons = document.querySelectorAll(".btn-glow")
    glowButtons.forEach((button) => {
      // Pulse the glow effect every 3 seconds
      setInterval(() => {
        button.classList.add("super-glow")
        setTimeout(() => {
          button.classList.remove("super-glow")
        }, 700)
      }, 3000)
    })
  }, [])

  return null
}
