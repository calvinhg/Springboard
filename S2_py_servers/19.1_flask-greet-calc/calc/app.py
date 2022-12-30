import operations
from flask import Flask, request


app = Flask(__name__)


@app.route("/")
def root():
    """Empty root to avoid error page"""
    return ""


@app.route("/add")
def add_route():
    """Return sum"""
    a = int(request.args["a"])
    b = int(request.args["b"])
    return str(operations.add(a, b))


@app.route("/sub")
def sub_route():
    """Return difference"""
    a = int(request.args["a"])
    b = int(request.args["b"])
    return str(operations.sub(a, b))


@app.route("/mult")
def mult_route():
    """Return product"""
    a = int(request.args["a"])
    b = int(request.args["b"])
    return str(operations.mult(a, b))


@app.route("/div")
def div_route():
    """Return division"""
    a = int(request.args["a"])
    b = int(request.args["b"])
    return str(operations.div(a, b))


@app.route("/math/<operation>")
def math(operation):
    """Return operation of args using eval() fn"""
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = eval(f"operations.{operation}({a}, {b})")
    return str(result)
