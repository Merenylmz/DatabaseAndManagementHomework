import axios from 'axios'

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

// Backend'in gönderdiği hata mesajını alır, yoksa genel bir mesaj döner
export const hataMesaji = (hata: unknown): string => {
  if (axios.isAxiosError<ApiCevap<unknown>>(hata)) {
    if (hata.response?.data?.message) return hata.response.data.message
    if (!hata.response) return 'Sunucuya ulaşılamadı'
  }
  return 'Beklenmeyen bir hata oluştu'
}

export default api
