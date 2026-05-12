import logging
import time
from logging.handlers import QueueHandler, QueueListener
from queue import SimpleQueue
from typing import Iterable

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS


def configure_logging() -> QueueListener:
    log_queue = SimpleQueue()
    queue_handler = QueueHandler(log_queue)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    ))

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(logging.INFO)
    root.addHandler(queue_handler)

    listener = QueueListener(log_queue, stream_handler, respect_handler_level=True)
    listener.start()
    return listener


log_listener = configure_logging()
logger = logging.getLogger(__name__)


class PyAutoGuiMouseDriver:
    def _pag(self):
        import pyautogui as pag

        pag.FAILSAFE = True
        return pag

    def position(self) -> tuple[int, int]:
        x, y = self._pag().position()
        return int(x), int(y)

    def move_to(self, x: int, y: int) -> None:
        self._pag().moveTo(x, y)

    def click(self, x: int | None = None, y: int | None = None) -> None:
        if x is None or y is None:
            self._pag().click()
            return
        self._pag().click(x, y)


class TvTargetController:
    SUPPORTED_PLATFORM = "pc_hdmi"
    TARGET_ID = "local-tv"

    def __init__(self, mouse_driver: PyAutoGuiMouseDriver):
        self.mouse_driver = mouse_driver
        self.connected = False
        self.host = "local-display"

    def connect(self, host: str, platform: str) -> dict:
        cleaned_host = (host or "local-display").strip()
        cleaned_platform = (platform or self.SUPPORTED_PLATFORM).strip()
        if cleaned_platform != self.SUPPORTED_PLATFORM:
            raise ValueError("Alleen platform 'pc_hdmi' wordt ondersteund in deze MVP")

        self.connected = True
        self.host = cleaned_host
        logger.info("tv_connect_success platform=%s host=%s", cleaned_platform, cleaned_host)
        return {
            "status": "success",
            "target_id": self.TARGET_ID,
            "platform": cleaned_platform,
            "host": cleaned_host,
            "message": "Verbonden met de TV-weergave via deze computer",
        }

    def require_target(self, target_id: str) -> None:
        if not self.connected or target_id != self.TARGET_ID:
            raise RuntimeError("Geen geldige TV-verbinding actief")

    def move(self, target_id: str, dx: int, dy: int) -> dict:
        self.require_target(target_id)
        x, y = move_coordinates(dx, dy, self.mouse_driver)
        logger.info("tv_move_success target_id=%s dx=%s dy=%s", target_id, dx, dy)
        return {"status": "success", "x": x, "y": y}

    def click(self, target_id: str) -> dict:
        self.require_target(target_id)
        self.mouse_driver.click()
        logger.info("tv_click_success target_id=%s", target_id)
        return {"status": "success"}


mouse_driver = PyAutoGuiMouseDriver()
tv_controller = TvTargetController(mouse_driver)

app = Flask(__name__)
CORS(app)


def parse_int(value, field_name: str) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} moet een geheel getal zijn")


def get_json_body() -> dict:
    data = request.get_json(silent=True)
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise ValueError("JSON body moet een object zijn")
    return data


def get_coordinates(driver=mouse_driver):
    return driver.position()


def reset_coordinates(driver=mouse_driver):
    driver.move_to(10, 10)


def click_coordinates(x, y, driver=mouse_driver):
    driver.click(x, y)


def task_coordinates(x, y, driver=mouse_driver):
    driver.move_to(x, y)
    driver.click()


def list_coordinates(
    positions: Iterable[tuple[int, int]],
    sleep_time: float = 0.5,
    repeat: int = 1,
    delay: float = 60,
    automationEnabled: bool = True,
    driver=mouse_driver,
):
    if not automationEnabled:
        return
    for i in range(repeat):
        for x, y in positions:
            task_coordinates(x, y, driver)
            time.sleep(sleep_time)

        if i < repeat - 1:
            time.sleep(delay)


def move_coordinates(add_x, add_y, driver=mouse_driver):
    x, y = driver.position()

    if x + add_x < 10:
        add_x = 10 - x
    if y + add_y < 10:
        add_y = 10 - y

    new_x = x + add_x
    new_y = y + add_y
    driver.move_to(new_x, new_y)
    return new_x, new_y


@app.route("/api", methods=["GET"])
def index():
    return jsonify({
        "message": "Welkom bij de Mouse Remote API.",
        "endpoints": {
            "/api/coordinates (GET)": "Haal de huidige muiscoördinaten op.",
            "/api/reset (POST)": "Reset de muiscoördinaten naar (10, 10).",
            "/api/click (POST)": "Klik op opgegeven coördinaten.",
            "/api/move (POST)": "Verplaats de muis met opgegeven hoeveelheden.",
            "/api/click_pattern (POST)": "Voer een klikpatroon uit.",
            "/api/tv/connect (POST)": "Verbind met de TV-weergave via pc_hdmi.",
            "/api/tv/move (POST)": "Verplaats de TV-cursor met dx/dy.",
            "/api/tv/click (POST)": "Klik/selecteer op de TV-weergave.",
            "/api/documentation": "Bekijk deze documentatie.",
        },
    })


@app.route("/api/connect", methods=["GET"])
def connect():
    device_info = {
        "device": "Mouse Remote API",
        "start-time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ip": request.remote_addr,
        "type": "computer",
    }
    return jsonify({
        "status": "success",
        "message": "Verbonden met Mouse Remote API!",
        "device_info": device_info,
    })


@app.route("/api/tv/connect", methods=["POST"])
def tv_connect():
    started = time.perf_counter()
    try:
        data = get_json_body()
        result = tv_controller.connect(
            host=data.get("host", "local-display"),
            platform=data.get("platform", TvTargetController.SUPPORTED_PLATFORM),
        )
        logger.info("endpoint=/api/tv/connect status=200 latency_ms=%.2f", (time.perf_counter() - started) * 1000)
        return jsonify(result)
    except ValueError as exc:
        logger.warning("endpoint=/api/tv/connect status=400 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        logger.error("endpoint=/api/tv/connect status=500 error=%s", exc)
        return jsonify({"status": "error", "message": "TV-verbinding mislukt"}), 500


@app.route("/api/tv/move", methods=["POST"])
def tv_move():
    started = time.perf_counter()
    try:
        data = get_json_body()
        target_id = str(data.get("target_id", ""))
        dx = parse_int(data.get("dx"), "dx")
        dy = parse_int(data.get("dy"), "dy")
        result = tv_controller.move(target_id, dx, dy)
        logger.info("endpoint=/api/tv/move status=200 latency_ms=%.2f", (time.perf_counter() - started) * 1000)
        return jsonify(result)
    except ValueError as exc:
        logger.warning("endpoint=/api/tv/move status=400 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 400
    except RuntimeError as exc:
        logger.warning("endpoint=/api/tv/move status=409 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 409
    except Exception as exc:
        logger.error("endpoint=/api/tv/move status=500 error=%s", exc)
        return jsonify({"status": "error", "message": "TV-muisbeweging mislukt"}), 500


@app.route("/api/tv/click", methods=["POST"])
def tv_click():
    started = time.perf_counter()
    try:
        data = get_json_body()
        target_id = str(data.get("target_id", ""))
        result = tv_controller.click(target_id)
        logger.info("endpoint=/api/tv/click status=200 latency_ms=%.2f", (time.perf_counter() - started) * 1000)
        return jsonify(result)
    except ValueError as exc:
        logger.warning("endpoint=/api/tv/click status=400 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 400
    except RuntimeError as exc:
        logger.warning("endpoint=/api/tv/click status=409 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 409
    except Exception as exc:
        logger.error("endpoint=/api/tv/click status=500 error=%s", exc)
        return jsonify({"status": "error", "message": "TV-klik mislukt"}), 500


@app.route("/api/documentation", methods=["GET"])
def documentation():
    return render_template("documentation.html")


@app.route("/api/coordinates", methods=["GET"])
def coordinates():
    x, y = get_coordinates()
    return jsonify({"x": x, "y": y})


@app.route("/api/reset", methods=["POST"])
def reset():
    reset_coordinates()
    return jsonify({"status": "success"})


@app.route("/api/click", methods=["POST"])
def click():
    try:
        data = get_json_body()
        x = parse_int(data.get("x"), "x")
        y = parse_int(data.get("y"), "y")
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

    click_coordinates(x, y)
    return jsonify({"status": "success"})


@app.route("/api/move", methods=["POST"])
def move():
    try:
        data = get_json_body()
        add_x = parse_int(data.get("add_x", 0), "add_x")
        add_y = parse_int(data.get("add_y", 0), "add_y")
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

    x, y = move_coordinates(add_x, add_y)
    return jsonify({"x": x, "y": y})


@app.route("/api/click_pattern", methods=["POST"])
def click_pattern():
    try:
        data = get_json_body()
        positions = data.get("positions", [(10, 10)])
        repeat = parse_int(data.get("repeat", 1), "repeat")
        delay = float(data.get("delay", 60))
        sleep_time = float(data.get("sleep_time", 0.5))
        automationEnabled = bool(data.get("automationEnabled", True))
    except (ValueError, TypeError) as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

    if not positions:
        return jsonify({"status": "error", "message": "Minstens één positie is vereist"}), 400

    try:
        positions = [(parse_int(x, "x"), parse_int(y, "y")) for x, y in positions]
    except (TypeError, ValueError):
        return jsonify({"status": "error", "message": "Positions must be list of [x, y]"}), 400

    try:
        list_coordinates(
            positions,
            sleep_time=sleep_time,
            repeat=repeat,
            delay=delay,
            automationEnabled=automationEnabled,
        )
    except Exception as exc:
        logger.error("endpoint=/api/click_pattern status=500 error=%s", exc)
        return jsonify({"status": "error", "message": str(exc)}), 500

    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
