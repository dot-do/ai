import { BrandInput, BrandOptions, BrandResult } from './types'
import { generateBrandPositioning } from './positioning'
import { generateVisualIdentity } from './visual'
import { generateBrandAssets } from './assets'

export async function Brand(input: BrandInput, options?: BrandOptions): Promise<BrandResult> {
  const positioning = await generateBrandPositioning(input, options)

  const visual = await generateVisualIdentity(input, positioning, options)

  const assets = await generateBrandAssets(input, positioning, visual, options)

  return {
    positioning,
    visual,
    assets,
  }
}
