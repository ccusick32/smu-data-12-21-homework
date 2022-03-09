from app import Flask, jsonify
from sqlalchemy import create_engine
import pandas as pd
import numpy as np

#Flask Setup
app = Flask(__name__)

#database read in
path = "sqlite:///Resources/hawaii.sqlite"
engine = create_engine(path)

#Flask Routes
@app.route("/")
def welcome():
    """List all API routes."""
    return (
        f"API Routes:"
        f"""
            <ul>
                <li><a href='/api/v1.0/precipitation'>/api/v1.0/precipitation</a></li>
                <li><a href='/api/v1.0/stations'>/api/v1.0/stations</a></li>
                <li><a href='api/v1.0/tobs'>api/v1.0/tobs</a></li>
            </ul>
            """
    )

@app.route("/api/v1.0/precipitation")
def getPrcp():
    conn = engine.connect()
    query = """
            SELECT
                date,
                station,
                prcp
            FROM
                measurement
            ORDER BY
                date asc,
                station asc;
            """
    df = pd.read_sql(query, conn)
    conn.close()
    data = df.to_dict(orient="records")
    return(jsonify(data))

@app.route("/api/v1.0/stations")
def getStations():
    conn = engine.connect()
    query = """
            SELECT
                station
            FROM
                station;
            """
    df = pd.read_sql(query, conn)
    conn.close()
    data = df.to_dict(orient="records")
    return(jsonify(data))

@app.route("api/v1.0/tobs")
def getTobs():
    conn = engine.connect()
    query = """
            SELECT
                station,
                date,
                tobs
            FROM
                measurement
            WHERE
                date >='2016-08-23'
                AND stations = 'USC00519281'
            ORDER BY 
                date asc;
            """
    df = pd.read_sql(query, conn)
    conn.close()
    data = df.to_dict(orient="records")
    return(jsonify(data))

if __name__ == '__main__':
    app.run(debug=True)
    
