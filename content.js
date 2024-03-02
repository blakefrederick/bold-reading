// Process a single word and return the bold text version
function toProcessWord(word) {
    const cutoff = Math.ceil(word.length * 0.6) // Bold the first 60% of the word
    /* Warning warning - Absolutely nothing proves scientifically or has even been shown anecdotally (other than my 10 minutes of testing) to actually improve reading or have anything to do with the so-called bionic reading method */
    // Also, why not make this a user setting? Yeah, why not.
    return [word.slice(0, cutoff), word.slice(cutoff)]
}

// Process text node and apply bold styling
function processTextNode(node) {
    const words = node.textContent.trim().split(/\s+/)
    const processedWords = words.map(word => {
        const [boldPart, regularPart] = toProcessWord(word)
        return `<span class='bold'>${boldPart}</span>${regularPart}`
    })
    const newHtml = processedWords.join(' ')
    const span = document.createElement('span')
    span.innerHTML = newHtml
    node.parentNode.replaceChild(span, node)
}

// Recursively apply bold to all text nodes within an element
function applyBoldReadingToElement(element) {
    element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            processTextNode(node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            applyBoldReadingToElement(node)
        }
    })
}

// Actually bold it
const style = document.createElement('style')
style.textContent = `
  .bold {
    font-weight: bold
  }
`
document.head.appendChild(style)

applyBoldReadingToElement(document.body)