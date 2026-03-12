const getLang = () => {
  if (navigator.languages !== undefined) {
    return navigator.languages[0]
  }
  return navigator.language || "en-GB"
}

export const lang = getLang()

export default getLang
