// Check uuid and direction is exist
const validateFinalizeSwap = (uuid: string): boolean => {
  if (!uuid || uuid === '') {
    console.log('invalid uuid')
    return false
  }

  return true
}

export default validateFinalizeSwap
