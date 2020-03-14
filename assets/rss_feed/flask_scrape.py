 
from flask import Flask, jsonify, render_template
import feedparser

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
    #return render_template('index.html')
    return jsonify(get_rss_news())

# @app.route("/news")
# def news():
#     return jsonify(get_rss_news())

if __name__ == '__main__':
    app.run(debug=True)