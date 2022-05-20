from cgitb import html
from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    
    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_home_page(self):
        with self.client:
            resp = self.client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code,200)
            self.assertIn('<h2>Lets Play Boggle</h2>', html)

    def test_boggle(self):
        with self.client:
            resp = self.client.get('/boggle')
            

            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'<p>High Score:', resp.data)
            self.assertIn(b'Score:', resp.data)
            self.assertIn(b'Seconds Left:', resp.data)

         

    def test_guess(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
        response = self.client.get('/guess?guess=cat')
        self.assertEqual(response.json['result'], 'ok')
        

    




    # TODO -- write tests for every view function / feature!

