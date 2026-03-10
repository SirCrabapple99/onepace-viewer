from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json
import re
import requests
import sys

#
#   ONEPACE
#

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
arc = {}

def arcLinks():
    # download html file from given url
    response = requests.get('https://onepace.net/en/watch/', headers=headers)
    if response.status_code == 200:
    #with open("onepace.html", "r", encoding="utf-8") as file:
    #    onepace = file.read()
        htmlOutput = BeautifulSoup(response.text, "html.parser")
    else:
       sys.exit("failed to get onepace.net")

#
#   GRAB ARCS
#

    arcParents = htmlOutput.find_all("li", id=True)
    # grab all the elements holding the arcs
    for arcLi in arcParents:
        liID = arcLi['id']
        linksDict = {'languages': {}}
        # grab the elements in the arc that holds the list of all the links by dub/sub
        for dubHolder in arcLi.find_all('li', attrs={'aria-labelledby': True}):
            dubSubLinksDict = {}
            # grab what says if links are dub, sub, or captions
            dubSub = dubHolder.find('span', attrs={'class': 'flex-1'})
            # find the list holding all the pixeldrain links
            dubSubLinks = dubHolder.find('ul', role='list')
            # create a new sub array for the overall links list
            dubSubLinksDict.update({})
            # go through the list holding the links and grab all the links
            for links in dubSubLinks.find_all('a', href=True):
                # get the resolution
                resolution = links.find('span', attrs={'class': 'grow text-center whitespace-pre tabular-nums'}).get_text().replace('\u2007', '').strip()
                # append the link and it's resolution to the temporary array
                dubSubLinksDict.update({resolution: links['href']})
            # add the dubSub and links to language list
            linksDict['languages'].update({dubSub.get_text().replace('\n                                    ', ' '): dubSubLinksDict})

        arc.update({liID: linksDict})

arcLinks()

#
#   PIXELDRAIN
#

def pixelDrain():
    arcDict = {}
    # iterate arcs
    for arcid, arcdata in arc.items():
        # iterate languages
        languages = arcdata['languages']
        episodeDict = {}
        for languageName, languageData in languages.items():
            # iterate links
            for linkRes, linkUrl in languageData.items():
                # get pixeldrain api
                langDict = {}
                response = requests.get(linkUrl.replace('/l/', '/api/list/'), headers=headers)
                if response.status_code != 200:
                    sys.exit("failed to get pixeldrain api")
                # get each episode and their id to get the api
                for episode in response.json()['files']:
                    episodeName = re.search(r'\[.*\] (.*) \[.*\]', episode['name']).group(1)
                    langDict.update({
                        episodeName: f"https://pixeldrain.net/api/file/{episode['id']}"
                    })

                if languageName not in episodeDict:
                    episodeDict[languageName] = {}
                episodeDict[languageName][linkRes] = langDict
        arcDict.update({
                arcid: episodeDict
        })
    with open ('./linkspixeldrain.json', 'w') as f:
        f.write(json.dumps(arcDict, indent=4))

pixelDrain()
