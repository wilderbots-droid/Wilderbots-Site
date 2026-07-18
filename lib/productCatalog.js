export const PRODUCT_PREVIEW_URLS = {
  valueshift: 'https://valueshift.in/',
  wilderlinks: 'https://wilderlinks.wilderbots.com/',
  neureck: 'https://neureck.wilderbots.com/'
}

export const getProductPreviewUrl = (product) => {
  const key = String(product?.title || '').trim().toLowerCase()
  return PRODUCT_PREVIEW_URLS[key] || null
}

export const getProductPreviewConfig = (product) => {
  const key = String(product?.title || '').trim().toLowerCase()

  if (key === 'wilderlinks') {
    return {
      frameAspect: '16/8.2',
      scale: 0.64,
      top: '0%',
      left: '0%'
    }
  }

  if (key === 'valueshift') {
    return {
      frameAspect: '16/8.4',
      scale: 0.56,
      top: '0%',
      left: '0%'
    }
  }

  if (key === 'neureck') {
    return {
      frameAspect: '16/8.4',
      scale: 0.56,
      top: '0%',
      left: '0%'
    }
  }

  return {
    frameAspect: '16/8.4',
    scale: 0.56,
    top: '0%',
    left: '0%'
  }
}
