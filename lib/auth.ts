// Definición de tipos para la autenticación
export interface User {
  username: string
  isLoggedIn: boolean
}

// Modificar las credenciales del administrador
export const ADMIN_CREDENTIALS = {
  username: "Admin1",
  password: "Capke",
}

// Función para verificar las credenciales
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

// Función para guardar el estado de autenticación en localStorage
export function saveAuthState(user: User): void {
  localStorage.setItem("authUser", JSON.stringify(user))
}

// Función para obtener el estado de autenticación desde localStorage
export function getAuthState(): User | null {
  const authData = localStorage.getItem("authUser")
  if (authData) {
    try {
      return JSON.parse(authData)
    } catch (e) {
      console.error("Error parsing auth data", e)
    }
  }
  return null
}

// Función para cerrar sesión
export function logout(): void {
  localStorage.removeItem("authUser")
}
