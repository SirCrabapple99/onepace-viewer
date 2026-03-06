async function fetchOnePace() {
    const res = await fetch("https://corsproxy.io/?https://onepace.net/en/watch")
    const html = await res.text()
    const parser = new DOMParser()
    // parse the html
    const doc = parser.parseFromString(html, "text/html")
    const arcs = []
    // get all the headers
    const headers = doc.querySelectorAll("h2")

    headers.forEach(h2 => {
        // grab arc names
        const arcName = h2.textContent.trim()

        arcs.push({
            arc: arcName,
        })
    })
    return arcs
}

fetchOnePace()