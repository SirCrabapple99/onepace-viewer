async function parseArcsJSON() {
  const response = await fetch('https://cdn.jsdelivr.net/gh/SirCrabapple99/onepace-viewer/linkspixeldrain.json')
  const arcsJSON = await response.json()
  for (const arc in arcsJSON) {
    let option = document.createElement("option");
    // get name in caps and stuff
    const capsName = arc.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    option.innerHTML = capsName
    option.value = arc
    document.getElementById('arcDropDown').append(option)
  }
}

window.onload = () => {
  parseArcsJSON()
}