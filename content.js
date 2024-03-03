let boldEnabled = true
let fadeLevels = [1, 0.6, 0.3, 0]
let currentFadeIndex = 0

// Toggle bold when b is pressed, fade when f is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'b') {
        boldEnabled = !boldEnabled
        if (boldEnabled) {
            document.body.classList.add('br')
        } else {
            document.body.classList.remove('br')
        }
    } else if (event.key === 'f') {
        currentFadeIndex = (currentFadeIndex + 1) % fadeLevels.length
        document.body.style.setProperty('--fade-level', fadeLevels[currentFadeIndex])
    }
})

// First remove bold from preexisting text
function unboldPreexistingText(element) {
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, b, strong, .bold')
    textElements.forEach(el => {
        el.style.fontWeight = 'normal'
    })
}

function toProcessWord(word) {
    const cutoff = Math.ceil(word.length * 0.6) // Bold the first 60% of the word
    return [word.slice(0, cutoff), word.slice(cutoff)]
}

// Process text node and apply br bold and fade classes
function processTextNode(node) {
    // filter out some non-text tags
    if (!node.parentNode.closest('svg, img, canvas, style')) {
        const words = node.textContent.trim().split(/\s+/)
        const processedWords = words.map(word => {
            const [boldPart, otherPart] = toProcessWord(word)
            return `<span class='br-bold'>${boldPart}</span><span class='br-other'>${otherPart}</span>`
        })
        const newHtml = processedWords.join(' ')
        const span = document.createElement('span')
        span.innerHTML = newHtml
        node.parentNode.replaceChild(span, node)
    }
}

// Recursively apply bold and fade to all text nodes within an element
function applyBoldReadingToElement(element) {
    element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            processTextNode(node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            applyBoldReadingToElement(node)
        }
    })
}

const style = document.createElement('style')
style.textContent = `
  .br .br-bold {
    font-weight: bold;
  }
  .br-other {
    opacity: var(--fade-level, 1);
  }
`
document.head.appendChild(style)
unboldPreexistingText(document.body)
document.body.style.setProperty('--fade-level', fadeLevels[currentFadeIndex])
applyBoldReadingToElement(document.body)
document.body.classList.add('br')