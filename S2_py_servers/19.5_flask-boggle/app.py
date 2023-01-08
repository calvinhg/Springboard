from boggle import Boggle
from flask import Flask, render_template

app = Flask(__name__)
app.config["SECRET-KEY"] = "secret"

boggle_game = Boggle()


@app.route("/")
def root():
    return render_template("home.html", board=boggle_game.board)
