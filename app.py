import pyautogui as pag
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

pag.FAILSAFE = True

def get_coordinates():
    x, y = pag.position()
    return x, y


def reset_coordinates():
    pag.moveTo(10, 10)


def click_coordinates(x, y):
    pag.click(x, y)


def move_coordinates(add_x, add_y):
    x, y = pag.position()

    if x + add_x < 10:
        add_x = -x
    if y + add_y < 10:
        add_y = -y

    new_x = x + add_x
    new_y = y + add_y
    pag.moveTo(new_x, new_y)
    return new_x, new_y


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/coordinates", methods=["GET"])
def coordinates():
    x, y = get_coordinates()
    return jsonify({
        "x": x,
        "y": y
    })


@app.route("/reset", methods=["POST"])
def reset():
    reset_coordinates()
    return jsonify({
        "status": "success"
    })


@app.route("/click", methods=["POST"])
def click():
    data = request.get_json(force=True)

    x = data.get("x")
    y = data.get("y")

    if x is None or y is None:
        return jsonify({
            "status": "error",
            "message": "x en y zijn verplicht"
        }), 400

    click_coordinates(int(x), int(y))
    return jsonify({
        "status": "success"
    })


@app.route("/move", methods=["POST"])
def move():
    data = request.get_json(force=True)

    add_x = data.get("add_x", 0)
    add_y = data.get("add_y", 0)


    x, y = move_coordinates(int(add_x), int(add_y))

    return jsonify({
        "x": x,
        "y": y
    })


# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )