const nodeExclusionList = 'svg, img, canvas, style, script, iframe, video, audio'

let boldEnabled = true
let currentFadeIndex = 0
let fadeLevels = [1, 0.6, 0.3, 0]
let colourIndex = 0
const colours = ['indigo', 'darkblue', 'green', 'orange', 'black']

// Toggle bold when b is pressed, fade when f is pressed
document.addEventListener('keydown', function(event) {
    const isInputField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable
    if (!isInputField) {
        if (event.key === 'b') {
            boldEnabled = !boldEnabled
            if (boldEnabled) {
                document.body.classList.add('br')
            } else {
                document.body.classList.remove('br')
            }
        } 
        else if (event.key === 'f') {
            currentFadeIndex = (currentFadeIndex + 1) % fadeLevels.length
            document.body.style.setProperty('--fade-level', fadeLevels[currentFadeIndex])
        }
        // Secret options
        else if (event.key === '0') {
            colourIndex = (colourIndex + 1) % colours.length
            const newcolour = colours[colourIndex]
            document.querySelectorAll('.br-bold').forEach(element => {
                element.style.colour = newcolour
            })
        }
        else if (event.key === '1') {
            document.querySelectorAll(`*:not(${nodeExclusionList})`).forEach(element => {
                element.classList.add('vanish')
            })
        }
    }
})

// First remove bold from preexisting text
function unboldPreexistingText(element) {
    const textElements = element.querySelectorAll(`*:not(${nodeExclusionList})`)
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
    if (!node.parentNode.closest(nodeExclusionList)) {
        const spaceWords = node.textContent.match(/\S+|\s+/g) // word and space array
        const processedWords = spaceWords.map(segment => {
            // Space
            if (/\s+/.test(segment)) {
                return segment
            }
            // Word detected
            const [boldPart, otherPart] = toProcessWord(segment)
            return `<span class='br-bold'>${boldPart}</span><span class='br-other'>${otherPart}</span>`
        })
        const newHtml = processedWords.join('')
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
  @keyframes vanishEffect {
    0% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
    100% {
        opacity: 0;
        transform: scale(0.5) translateY(-20px);
    }
  }
  .vanish {
    animation: vanishEffect 15s forwards;
  }
`
document.head.appendChild(style)
unboldPreexistingText(document.body)
document.body.style.setProperty('--fade-level', fadeLevels[currentFadeIndex])
applyBoldReadingToElement(document.body)
document.body.classList.add('br')