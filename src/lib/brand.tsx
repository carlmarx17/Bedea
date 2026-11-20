import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { BRAND_PRESETS, DEFAULT_BRAND_ID, getBrandPreset } from '../config/brand'
import { loadBrandId, saveBrandId } from '../lib/storage'
import type { BrandPreset } from '../types'

interface BrandContextValue {
  brand: BrandPreset
  brandId: string
  presets: BrandPreset[]
  setBrandId: (id: string) => void
}

const BrandContext = createContext<BrandContextValue | null>(null)

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandIdState] = useState<string>(() => loadBrandId() ?? DEFAULT_BRAND_ID)

  const setBrandId = useCallback((id: string) => {
    setBrandIdState(id)
    saveBrandId(id)
  }, [])

  const value = useMemo<BrandContextValue>(
    () => ({
      brand: getBrandPreset(brandId),
      brandId,
      presets: BRAND_PRESETS,
      setBrandId,
    }),
    [brandId, setBrandId],
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export function useBrand(): BrandContextValue {
  const context = useContext(BrandContext)
  if (!context) throw new Error('useBrand debe usarse dentro de BrandProvider')
  return context
}
