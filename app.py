from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData
from flask import Flask, jsonify



app = Flask(__name__)

def get_rss_news():
    url= "https://www.google.com/alerts/feeds/07584845844048270854/8369353730257505193"
    feed = feedparser.parse(url)
    feeds_list = []
    for post in feed.entries:
        date = "%02d-%02d-%02d" % (post.published_parsed.tm_mon, \
            post.published_parsed.tm_mday, \
            post.published_parsed.tm_year)     
        post.title = post.title.replace('<b>', '')
        post.title = post.title.replace('</b>', '')
        post.title = post.title.replace('&#39;', "'")
        d = {
            'date': date,
            'title': post.title,
            'link': post.link
        }
        feeds_list.append(d)
    return feeds_list

@app.route("/")

def home():
    results = session.query(covid19.id_loc, covid19.province_state, covid19.country_region,
    covid19.lat, covid19.long, covid19.date, covid19.confirmed_to_date, covid19.deaths_to_date, covid19.recovered_to_date).all()
    return jsonify(results)
if __name__ == '__main__':
    app.run(debug=True)