from flask import Flask, render_template
from flask import redirect, request, jsonify, url_for

app = Flask(__name__)

@app.route("/")
@app.route("/home")
def Home():
    return render_template('home.html', title="Home page")

@app.route("/PopBrands")
def Graph1():
    return render_template('graph1.html', title="Most Popular Brands")

@app.route("/DistillaryMap")

def Graph3():
    return render_template('graph3.html', title="Distillary Map")



if __name__ == '__main__':
    app.run(debug=True)
