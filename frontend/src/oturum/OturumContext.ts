import { createContext } from 'react'
import type { Kullanici } from './oturum'

export type OturumDegeri = {
  kullanici: Kullanici | null
  girisYapildi: (token: string, kullanici: Kullanici) => void
  cikisYap: () => void
}

export const OturumContext = createContext<OturumDegeri | null>(null)
