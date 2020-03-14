
# Dependencies
from bs4 import BeautifulSoup
import requests

# URL of page to be scraped
url = 'https://www.cdc.gov/coronavirus/2019-ncov/whats-new-all.html'

# Retrieve page with the requests module
response = requests.get(url)
# Create BeautifulSoup object; parse with 'lxml'
soup = BeautifulSoup(response.text, 'lxml')

# Retrieve the parent divs for all articles
wrapper_div = soup.find('div', class_='2019coronaviruswhatsnew')
results = wrapper_div.find_all('li')
len(results)


# loop over results to get article data
for result in results:
    
    # scrape the article header 
    header = result.find('a', class_='feed-item-title').text
    
    # scrape the date
    date = result.find('span', class_='red-color feed-item-date').text
    
    # print article data
    print('-----------------')
    print(header)
    print(date)