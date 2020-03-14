from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData
from flask import Flask, jsonify

pg_connection_string = "postgresql://postgres:postgres@localhost:5432/COVID19_DB"
engine = create_engine(pg_connection_string)
session = Session(engine)

m = MetaData()
Base = automap_base(bind=engine, metadata=m)
Base.prepare(engine, reflect=True)
covid19 = Base.classes.covid19

app = Flask(__name__)

@app.route("/")
def home():
    results = session.query(covid19.id_loc, covid19.province_state, covid19.country_region,
    covid19.lat, covid19.long, covid19.date, covid19.confirmed_to_date, covid19.deaths_to_date, covid19.recovered_to_date).all()
    return jsonify(results)
if __name__ == '__main__':
    app.run(debug=True)