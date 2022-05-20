from crypt import methods
from re import template
from boggle import Boggle
from flask import Flask, request, render_template, redirect, session,  jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = "123"

boggle_game = Boggle()

@app.route('/')
def home_page():
    """Display home page"""
    return render_template('home.html')

@app.route('/boggle')
def boggle():
    game = boggle_game.make_board()
    session['board'] = game
    

    return render_template('boggle.html', game=game)

@app.route('/guess')
def check_guess():
    word = request.args['guess']
    #boggle_dict = boggle_game.words
    #if word in boggle_dict:
    result = boggle_game.check_valid_word(session['board'], word)
    score = 0
    if result == "ok":
        score += len(word)
        

    data = jsonify(result=result,score=score)
    return data

@app.route('/game_stats', methods=["POST"])
def game_statistics():
    data = request.json
    return data
