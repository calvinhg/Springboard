from unittest import TestCase
from app import app, session, make_result_json, boggle_game

app.config["TESTING"] = True


class FlaskTests(TestCase):

    def test_root(self):
        """/ path works and shows everything correctly"""
        with app.test_client() as client:
            res = client.get("/")
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        # base.html is being used
        self.assertIn(
            '<a href="/stats" class="btn btn-outline-light">Statistics</a>', html)
        # home.html is being used
        self.assertIn('<h2 id="timer">60s</h2>', html)

    def test_root_session(self):
        """Check that a board gets created and added to the session"""
        with app.test_client() as client:
            client.get("/")
            self.assertTrue(isinstance(session["board"], list))

    def test_guess(self):
        """/guess path tries a word and returns its result"""
        with app.test_client() as client:
            client.get("/")
            res = client.post("/guess", data={"guess": "feaf"})

        self.assertEqual(res.status_code, 200)
        self.assertIn('"result": "not-word"', res.get_data(as_text=True))

    def test_make_result_json(self):
        """make_result_json() function returns word
            status, score and list of words"""
        board = [['W', 'O', 'R', 'D', 'D'],  # Dummy board
                 *[["A" for x in range(5)] for y in range(4)]]
        msg_ok = make_result_json(board, "word")
        msg_already = make_result_json(board, "word")
        msg_not_board = make_result_json(board, "wording")

        self.assertIn('"score": 4', msg_ok)
        self.assertIn('"result": "already-found"', msg_already)
        self.assertIn('"words_found": ["word"]', msg_not_board)

    def test_stats(self):
        """/stats (get) works and shows stats from session"""
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["high_score"] = 42
                change_session["times_played"] = 99
            res = client.get("/stats")
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn("<th>High Score</th>", html)
        self.assertIn("<td>42</td>\n      <td>99</td>\n", html)

    def test_stats_post(self):
        """/stats (post) works and changes session values"""
        boggle_game.score = 9
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["times_played"] = 99
            res = client.post("/stats")

            self.assertEqual(session["times_played"], 100)
            self.assertEqual(session["high_score"], 9)
        self.assertEqual(res.status_code, 200)
