import time
import pyautogui as pag
from flask import Flask, request, jsonify, render_template
from typing import Iterable

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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


@app.route("/api", methods=["GET"])
def index():
    return jsonify({
        "message": "Welkom bij de Click Automation API! Gebruik de beschikbare endpoints om coördinaten te beheren en klikpatronen uit te voeren.",
        "endpoints": {
            "/api/coordinates (GET)": "Haal de huidige muiscoördinaten op.",
            "/api/reset (POST)": "Reset de muiscoördinaten naar (10, 10).",
            "/api/click (POST)": "Klik op opgegeven coördinaten. Vereist JSON body met 'x' en 'y'.",
            "/api/move (POST)": "Verplaats de muis met opgegeven hoeveelheden. Vereist JSON body met 'add_x' en 'add_y'.",
            "/api/click_pattern (POST)": "Voer een klikpatroon uit. Vereist JSON body met 'positions', 'repeat', 'delay', 'sleep_time', en 'automationEnabled'.",
            "/api/documentation": "Bekijk deze documentatie."
        },
        "example_click_pattern_body": {
            "positions": [[100, 100], [200, 200]],
            "repeat": 3,
            "delay": 60,
            "sleep_time": 0.5,
            "automationEnabled": True
        }
    })

@app.route("/api/connect", methods=["GET"])
def connect():
    device_info = {
        "device": "Click Automation API",
        "start-time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ip": request.remote_addr,
        "type": "computer"  # phone or computer
    }
    return jsonify({
        "status": "success",
        "message": "Verbonden met Click Automation API!",
        "device_info": device_info
    })

@app.route("/api/documentation", methods=["GET"])
def documentation():
    return render_template("documentation.html")

@app.route("/api/coordinates", methods=["GET"])
def coordinates():
    x, y = get_coordinates()
    return jsonify({
        "x": x,
        "y": y
    })


@app.route("/api/reset", methods=["POST"])
def reset():
    reset_coordinates()
    return jsonify({
        "status": "success"
    })


@app.route("/api/click", methods=["POST"])
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


@app.route("/api/move", methods=["POST"])
def move():
    data = request.get_json(force=True)

    add_x = data.get("add_x", 0)
    add_y = data.get("add_y", 0)


    x, y = move_coordinates(int(add_x), int(add_y))

    return jsonify({
        "x": x,
        "y": y
    })

@app.route("/api/click_pattern", methods=["POST"])
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