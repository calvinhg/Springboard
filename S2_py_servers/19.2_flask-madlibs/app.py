from flask import Flask, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from stories import story1, story_list

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"
debug = DebugToolbarExtension(app)


@app.route("/")
def home():
    """Show homepage, with simple prompt and links to others"""
    return render_template("home.html", simple=story1, others=story_list)


@app.route("/story/simple")
def simple_result():
    """Show simple story once it's filled"""
    return render_template("story.html", result=story1.generate(request.args))


@app.route("/<title>")
def story_prompts(title):
    """
    Show prompt for story with title
    If no story found, return home
    """
    title = title.replace("_", " ")
    try:
        return render_template("story_prompt.html", title=title, story=story_list[title])
    except KeyError:
        return home()


@app.route("/story/<title>")
def story_result(title):
    """Show story result after it's filled"""
    title = title.replace("_", " ")
    return render_template("story.html", result=story_list[title].generate(request.args))
