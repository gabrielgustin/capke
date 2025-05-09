"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyCredentials, saveAuthState } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular un pequeño retraso para dar sensación de procesamiento
    setTimeout(() => {
      if (verifyCredentials(username, password)) {
        // Guardar estado de autenticación
        saveAuthState({
          username,
          isLoggedIn: true,
        })

        // Registrar el tiempo de inicio de sesión para seguimiento de cambios
        localStorage.setItem("session_start_time", Date.now().toString())

        onLoginSuccess()
      } else {
        setError("Usuario o contraseña incorrectos")
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-lacapke-charcoal">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lacapke-charcoal">
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-lacapke-charcoal/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lacapke-charcoal">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-lacapke-charcoal/20"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#f8e1e1] hover:bg-[#f5d4d4] text-lacapke-charcoal"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
