export const getProductPreviewUrl = (product) => {
  const websiteUrl = String(product?.websiteUrl || '').trim()
  const ctaLink = String(product?.ctaLink || '').trim()
  const adminUrl = websiteUrl || ctaLink

  return /^https?:\/\//.test(adminUrl) ? adminUrl : null
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
