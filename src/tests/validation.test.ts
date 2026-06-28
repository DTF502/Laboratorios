import { describe, expect, it } from 'vitest'
import { validateEmail, validatePassword } from '@/lib/validation'

describe('validació de credencials', () => {
  it('accepta un correu amb format vàlid', () => {
    expect(validateEmail('usuari@sportbook.test')).toBe(true)
  })

  it('rebutja un correu sense domini', () => {
    expect(validateEmail('usuari@')).toBe(false)
  })

  it('accepta una contrasenya de vuit caràcters amb lletres i números', () => {
    expect(validatePassword('Sport123')).toBeNull()
  })

  it('rebutja una contrasenya sense números', () => {
    expect(validatePassword('SportBook')).not.toBeNull()
  })
})
