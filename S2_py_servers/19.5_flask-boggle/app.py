from boggle import Boggle
from flask import Flask, request, render_template
from flask import session
from json import dumps

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

boggle_game = Boggle()


@app.route("/")
def root():
    """
    Show home page. Reset game, make the board and save
    it to session.
    """
    boggle_game.reset()  # To reset on page reload
    session["board"] = boggle_game.make_board()
    return render_template("home.html", board=session["board"])


@app.route("/guess", methods=["POST"])
def guess():
    """
    Accept a word as a guess and return result, score
    and found words as json object.
    """
    try:  # if word is submitted with ajax
        word = request.get_json()["guess"]
    except:  # if word is submitted by a form
        word = request.form["guess"]
    result_json = make_result_json(session["board"], word)

    return result_json


def make_result_json(board, word):
    """
    Get result (ok, not-word,...), score and found words
    and return them as json object.
    """
    msg = boggle_game.check_valid_word(board, word)

    return dumps({
        "result": msg,
        "score": boggle_game.score,
        "words_found": list(boggle_game.words_found)
    })


@app.route("/stats")
def show_stats():
    """Shows current stats using session variables"""
    return render_template("stats.html")


@app.route("/stats", methods=["POST"])
def post_stats():
    """Post stats to session. Creates variables if they don't exist"""
    if boggle_game.score > session.get("high_score", 0):
        session["high_score"] = boggle_game.score
    times_played = session.get("times_played", 0) + 1
    session["times_played"] = times_played
    return "done"
