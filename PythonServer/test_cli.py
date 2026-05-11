import unittest

import werkzeug

if not hasattr(werkzeug, '__version__'):
    werkzeug.__version__ = '3'

import cli


class FakeMouseDriver:
    def __init__(self):
        self.x = 100
        self.y = 100
        self.clicks = 0

    def position(self):
        return self.x, self.y

    def move_to(self, x, y):
        self.x = x
        self.y = y

    def click(self, x=None, y=None):
        if x is not None and y is not None:
            self.x = x
            self.y = y
        self.clicks += 1


class TvRemoteApiTest(unittest.TestCase):
    def setUp(self):
        self.driver = FakeMouseDriver()
        cli.tv_controller = cli.TvTargetController(self.driver)
        cli.app.config.update(TESTING=True)
        self.client = cli.app.test_client()

    def test_tv_flow_connect_move_click(self):
        connect = self.client.post('/api/tv/connect', json={
            'host': 'living-room-tv',
            'platform': 'pc_hdmi',
        })
        self.assertEqual(connect.status_code, 200)
        target_id = connect.get_json()['target_id']

        move = self.client.post('/api/tv/move', json={
            'target_id': target_id,
            'dx': 25,
            'dy': -10,
        })
        self.assertEqual(move.status_code, 200)
        self.assertEqual(move.get_json()['x'], 125)
        self.assertEqual(move.get_json()['y'], 90)

        click = self.client.post('/api/tv/click', json={'target_id': target_id})
        self.assertEqual(click.status_code, 200)
        self.assertEqual(self.driver.clicks, 1)

    def test_tv_move_requires_connection(self):
        response = self.client.post('/api/tv/move', json={
            'target_id': 'local-tv',
            'dx': 1,
            'dy': 1,
        })
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['status'], 'error')

    def test_tv_connect_rejects_unsupported_platform(self):
        response = self.client.post('/api/tv/connect', json={
            'host': 'native-tv',
            'platform': 'tizen',
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('pc_hdmi', response.get_json()['message'])

    def test_move_coordinates_clamps_to_safe_minimum(self):
        x, y = cli.move_coordinates(-500, -500, self.driver)
        self.assertEqual((x, y), (10, 10))


if __name__ == '__main__':
    unittest.main()
