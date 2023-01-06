from flask import Flask, render_template, request
from flask import redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from surveys import satisfaction_survey as survey

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

debug = DebugToolbarExtension(app)


@app.route("/")
def home():
    """Show homepage"""
    return render_template("home.html", survey=survey)


@app.route("/start", methods=["POST"])
def start():
    # (Re)initialize responses
    session["responses"] = {}
    return redirect("/q/1")


@app.route("/q/<int:n>")
def question_page(n):
    """Show question number n"""

    # Go to next unanswered question if trying to skip
    qs_answered = len(session["responses"])
    if n != qs_answered + 1:
        flash("Please complete the questions in order!", "danger")
        return redirect(f"/q/{qs_answered+1}")

    # Get question prompt and answers
    question = survey.questions[n-1]

    return render_template("question.html", q=question, n=n)


@app.route("/answer", methods=["POST"])
def answer():
    """Add answer to DB and show next question
        if no answer given, simply adds nothing and
        returns to same question"""

    # Update responses in session
    responses = session["responses"]
    responses.update(request.form.to_dict())
    session["responses"] = responses

    # If end of qs are reached goto end
    if len(responses) == len(survey.questions):
        return redirect("/thank_you")

    # Goto next question
    return redirect(f"/q/{len(responses)+1}")


@app.route("/thank_you")
def thank_you():
    return render_template("thank_you.html", responses=session["responses"])
