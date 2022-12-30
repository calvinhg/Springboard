from flask import Flask

app = Flask(__name__)


@app.route("/")
def root():
    """Empty root route so it doesn't error"""
    return ""


@app.route("/welcome")
def welcome():
    """Welcomes user"""
    return "welcome"


@app.route("/welcome/home")
def welcome_home():
    """Welcomes user home"""
    return "welcome home"


@app.route("/welcome/back")
def welcome_back():
    """Welcomes user back"""
    return "welcome back"
