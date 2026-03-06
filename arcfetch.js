async function fetchOnePace() {
    const res = await fetch(`https://whateverorigin.org/get?url=${encodeURIComponent('https://onepace.net/en/watch/')}`)
    const html = (await res.json()).contents
    const parser = new DOMParser()
    // parse the html
    const doc = parser.parseFromString(html, "text/html")
    const arcs = []
    // get all the headers
    const headers = doc.querySelectorAll("h2")
    const links = doc.querySelectorAll("a")
    headers.forEach(h2 => {
        // grab arc names
        const arcName = h2.textContent.trim()
        const link = link[i].textContent.trim()
        arcs.push({
            arc: arcName,

        })
    })
    links.forEach(a => {})

    return headers
}

fetchOnePace().then(arcs => {
        alert(JSON.stringify(arcs))
    })