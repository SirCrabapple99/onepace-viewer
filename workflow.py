from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json
import os
import requests
import sys

#
#   ONEPACE
#

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

# download html file from given url
try:
   #response = requests.get('https://onepace.net/en/watch/', headers=headers)
    #if response.status_code == 200:
    with open("onepace.html", "r", encoding="utf-8") as file:
        onepace = file.read()
    htmlOutput = BeautifulSoup(onepace, "html.parser")
    #else:
    #   print("failed to get onepace.net")
    #   sys.exit()
except:
    sys.exit("failed to download html from given url")

#
#   GRAB ARCS
#

arcParents = htmlOutput.find_all("li", id=True)
arcs = {}
# grab all the elements holding the arcs
for arcLi in arcParents:
    liID = arcLi['id']
    # grab the elements in the arc that holds the list of all the links by dub/sub
    for dubHolder in arcLi.find_all('li', attrs={'aria-labelledby': True}):
        tempLinks = {}
        # grab what says if links are dub, sub, or captions
        dubSub = dubHolder.find('span', attrs={'class': 'flex-1'})
        # find the list holding all the pixeldrain links
        dubSubLinks = dubHolder.find('ul', role='list')
        # create a new sub array for the overall links list
        tempLinks.update({'dubSub': dubSub.get_text(), 'links': {}})
        # go through the list holding the links and grab all the links
        for links in dubSubLinks.find_all('a', href=True):
            # get the resolution
            resolution = links.find('span', attrs={'class': 'grow text-center whitespace-pre tabular-nums'}).get_text().replace('\u2007', '').strip()
            # append the link and it's resolution to the temporary array
            tempLinks['links'].update({resolution: links['href']})
        # append the temp array to the full list of pixeldrain links for that arc
    arcs.update({liID: tempLinks})
print(arcs)