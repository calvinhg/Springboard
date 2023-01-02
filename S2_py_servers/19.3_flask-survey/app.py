from flask import Flask, render_template, request, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension
from surveys import satisfaction_survey as survey

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

debug = DebugToolbarExtension(app)

responses = {}


@app.route("/")
def home():
    """Show homepage"""
    return render_template("home.html", survey=survey)


@app.route("/q/<int:n>")
def question_page(n):
    """Show question number n"""

    # Go to thank you if already completed
    if len(responses) == 4:
        flash("You have already completed this survey!", "dark")
        return redirect("/thank_you")

    # Go to next unanswered question if trying to skip
    if n != len(responses) + 1:
        flash("Please complete the questions in order!", "danger")
        return redirect(f"/q/{len(responses)+1}")

    question = survey.questions[n-1]

    return render_template("question.html", q=question, n=n)


@app.route("/answer", methods=["POST"])
def answer():
    """Add answer to DB and show next question"""
    responses.update(request.form.to_dict())

    if len(responses) == len(survey.questions):
        return redirect("/thank_you")

    return redirect(f"/q/{len(responses)+1}")


@app.route("/thank_you")
def thank_you():
    return render_template("thank_you.html", responses=responses)
