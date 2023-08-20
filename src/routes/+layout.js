export async function load({ data }) {
  const { splitTestingIdentifier } = data || {}

  return {
    splitTestingIdentifier,
  }
}
