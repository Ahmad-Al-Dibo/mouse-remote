import time
import pyautogui as pag
from flask import Flask, request, jsonify, render_template
from typing import Iterable

app = Flask(__name__)

pag.FAILSAFE = True

def get_coordinates():
    x, y = pag.position()
    return x, y


def reset_coordinates():
    pag.moveTo(10, 10)


def click_coordinates(x, y):
    pag.click(x, y)


def task_coordinates(x, y):
    pag.moveTo(x, y)
    pag.click()


def list_coordinates(
    positions: Iterable[tuple[int, int]],
    sleep_time: float = 0.5,
    repeat: int = 1,
    delay: float = 60,
    automationEnabled: bool = True
):
    if not automationEnabled:
        return
    for i in range(repeat):
        for x, y in positions:
            task_coordinates(x, y)
            time.sleep(sleep_time)

        if i < repeat - 1:
            time.sleep(delay)

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

@app.route("/click_pattern", methods=["POST"])
def click_pattern():
    data = request.get_json(force=True) or {}

    try:
        positions = data.get("positions", [(10, 10)])
        repeat = int(data.get("repeat", 1))
        delay = float(data.get("delay", 60))
        sleep_time = float(data.get("sleep_time", 0.5))
        automationEnabled = bool(data.get("automationEnabled", True))
    except (ValueError, TypeError) as e:
        return jsonify({
            "status": "error",
            "message": f"Invalid input types: {str(e)}"
        }), 400

    if not positions:
        return jsonify({
            "status": "error",
            "message": "Minstens één positie is vereist"
        }), 400

    # ✅ Extra veiligheid: controleer coordinaten
    try:
        positions = [(int(x), int(y)) for x, y in positions]
    except Exception:
        return jsonify({
            "status": "error",
            "message": "Positions must be list of [x, y]"
        }), 400

    try:
        list_coordinates(
            positions,
            sleep_time=sleep_time,
            repeat=repeat,
            delay=delay,
            automationEnabled=automationEnabled
        )
    except Exception as e:
        print(f"Error during click pattern execution: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    return jsonify({
        "status": "success"
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )