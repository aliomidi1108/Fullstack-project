import ZarinpalProvider from './providers/zarinpal.provider.js'

const providerInstances = new Map()

const getProvider = (providerName) => {
  const name = (providerName || process.env.PAYMENT_PROVIDER || 'zarinpal').toLowerCase()
  if (providerInstances.has(name)) return providerInstances.get(name)
  let instance
  switch (name) {
    case 'zarinpal':
      instance = new ZarinpalProvider()
      break
    default:
      throw new Error('Payment provider is not configured')
  }
  providerInstances.set(name, instance)
  return instance
}

const initiatePayment = async ({ provider, amount, description, metadata }) => {
  const instance = getProvider(provider)
  return instance.initiatePayment({ amount, description, metadata })
}

const verifyPayment = async ({ provider, amount, authority }) => {
  const instance = getProvider(provider)
  return instance.verifyPayment({ amount, authority })
}

export { initiatePayment, verifyPayment }
