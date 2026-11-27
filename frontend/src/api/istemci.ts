import axios from 'axios'
import { OTURUM_KAPANDI_OLAYI, oturumuTemizle, tokenAl } from '../oturum/oturum'

// Backend'in her cevabı bu biçimde gelir (src/utils/ApiResponse.ts)
export type ApiCevap<T> = {
  success: boolean
  message: string
  data?: T
  errors?: { field: string; message: string }[]
}

// Bütün sayfalar backend'e bu nesne üzerinden istek atar
const api = axios.create({
  baseURL: '/api',
})

// Her istekten önce çalışır: giriş yapılmışsa token'ı ekler
api.interceptors.request.use((ayar) => {
  const token = tokenAl()
  if (token) ayar.headers.Authorization = `Bearer ${token}`
  return ayar
})

// Token gönderildiği hâlde 401 geldiyse token geçersizdir, oturum kapatılır.
// Token'sız 401 (ör. yanlış şifre) oturumu etkilemez.
api.interceptors.response.use(
  (cevap) => cevap,
  (hata) => {
    if (axios.isAxiosError(hata) && hata.response?.status === 401 && hata.config?.headers?.Authorization) {
      oturumuTemizle()
      window.dispatchEvent(new Event(OTURUM_KAPANDI_OLAYI))
    }
    return Promise.reject(hata)
  },
)

// Backend'in gönderdiği hata mesajını alır, yoksa genel bir mesaj döner
export const hataMesaji = (hata: unknown): string => {
  if (axios.isAxiosError<ApiCevap<unknown>>(hata)) {
    if (hata.response?.data?.message) return hata.response.data.message
    if (!hata.response) return 'Sunucuya ulaşılamadı'
  }
  return 'Beklenmeyen bir hata oluştu'
}

export default api
