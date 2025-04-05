import { fetchCryptoData } from '@/app/store/slices/cryptoSlice'
import { store } from '@/app/store/store'

export async function generateStaticParams() {
  const cryptoIds = ['bitcoin', 'ethereum', 'dogecoin', 'cardano']
  return cryptoIds.map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const cryptoId = decodeURIComponent(params.id)
  await store.dispatch(fetchCryptoData([cryptoId]) as any)
  const cryptoData = store.getState().crypto.data[cryptoId]

  return {
    title: `${cryptoData?.name || cryptoId} - Crypto Details`,
    description: `Real-time price and market data for ${cryptoData?.name || cryptoId}`,
  }
}

export default async function CryptoDetailPageServer({ params }: { params: { id: string } }) {
  const cryptoId = decodeURIComponent(params.id)
  await store.dispatch(fetchCryptoData([cryptoId]) as any)
  const initialData = store.getState().crypto.data[cryptoId]

  return {
    props: {
      initialData,
      cryptoId
    }
  }
}