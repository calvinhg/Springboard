from flask import Flask, render_template
from flask_debugtoolbar import DebugToolbarExtension
from surveys import surveys

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

debug = DebugToolbarExtension(app)

responses = []


@app.route("/")
def home():
    return render_template("home.html", surveys=surveys)


@app.route("/<survey_title>/q/<int:n>")
def question_page(survey_title, n):
    question = surveys[survey_title].questions[n-1]

    return render_template("question.html", q=question, n=n)


@app.route("/answer")
def answer()
