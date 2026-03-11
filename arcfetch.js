// parse arcs data
let arcsJSON
async function parseArcsJSON() {
  const response = await fetch('https://cdn.jsdelivr.net/gh/SirCrabapple99/onepace-viewer/linkspixeldrain.json')
  arcsJSON = await response.json()
  for (const arc in arcsJSON) {
    let option = document.createElement("option");
    // get name in caps and stuff
    const capsName = arc.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    // push out to dropdown
    option.className = 'arcOptions LF'
    option.innerHTML = capsName
    option.value = arc
    document.getElementById('arcDropDown').append(option)
  }
}

// episodes
let prefLang = 'English Dub'
let prefRes = '1080p'
function pushEpisodes(e) {
  const selectedArc = e.target.value
  // get the available languages
  const availableLangs = () => {
    let langs = []
    for (const l in arcsJSON[selectedArc]) {
      langs.push(l)
    }
    return langs
  }
  
  let chosenLang
  let chosenRes
  // check if preffered language is available
  if (prefLang in arcsJSON[selectedArc]) {
    chosenLang = prefLang
  } else {
    chosenLang = Object.keys(arcsJSON[selectedArc]).at(-1)
  }

  // check if preffered resolution is available
  if (prefLang in arcsJSON[selectedArc][chosenLang]) {
    chosenRes = prefLang
  } else {
    chosenRes = Object.keys(arcsJSON[selectedArc][chosenLang]).at(-1)
  }

  // push out episodes
  let episodesHolder = document.getElementById('episodeHolder')
  // remove the previously pushed episodes
  episodesHolder.replaceChildren()
  let episodes = arcsJSON[selectedArc][chosenLang][chosenRes]
  // push out the new episodes
  
  for (e in episodes) {
    let epLink = arcsJSON[selectedArc][chosenLang][chosenRes][e]
    let episode = document.createElement('div')
    let episodeNumber = document.createElement('div')

    // create 
    episodeNumber.className = 'episodeNumber SF'
    // get episode number from name because they all have numbers but some are shifted
    episodeNumber.textContent = e.replaceAll(/\D/g, '')
    episode.append(episodeNumber)
    // put the episode link in there
    episode.dataset.url = epLink
    episode.onclick = function (e) {
      watchEpisode(e)
    }
    episode.className = 'episode'
    episodesHolder.append(episode)
    console.log(episode)
  }
  episodesHolder.scrollTo(0, 0)
}

// episode clicking
async function watchEpisode(e) {
  url = await e.target.dataset.url
  document.getElementById('video').setAttribute('src', url)
  console.log(url)
  document.getElementById('video').load()
}

// events
document.getElementById('arcDropDown').addEventListener('change', (e) => {
  pushEpisodes(e)
})

window.onload = () => {
  parseArcsJSON()
}