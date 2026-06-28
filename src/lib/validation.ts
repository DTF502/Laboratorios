export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'La contrasenya ha de tenir com a mínim 8 caràcters.'
  }
  if (!/[A-Za-zÀ-ÿ]/.test(password) || !/\d/.test(password)) {
    return 'La contrasenya ha d’incloure almenys una lletra i un número.'
  }
  return null
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
