import { BaseVariant, FeatureFlag, useBaseFlag } from '../index'

export function useInfoExploreFlag(): BaseVariant {
  return useBaseFlag(FeatureFlag.infoExplore, BaseVariant.Enabled)
}

export function useInfoExplorePageEnabled(): boolean {
  return useInfoExploreFlag() === BaseVariant.Enabled
}
