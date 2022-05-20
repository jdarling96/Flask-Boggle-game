from crypt import methods
from re import template
from boggle import Boggle
from flask import Flask, request, render_template, redirect, session,  jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = "123"

boggle_game = Boggle()

@app.route('/')
def home_page():
    """Display home page/route to boggle"""
    return render_template('home.html')

@app.route('/boggle')
def boggle():
    """Returns boggle game board and sets players stats in cookies"""
    game = boggle_game.make_board()
    session['board'] = game
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    

    return render_template('boggle.html', game=game, highscore=highscore, nplays=nplays)

@app.route('/guess')
def check_guess():
    """HTTP request to check guess of user"""
    word = request.args['guess']
    #boggle_dict = boggle_game.words
    #if word in boggle_dict:
    result = boggle_game.check_valid_word(session['board'], word)
    score = 0
    if result == "ok":
        score += len(word)
         
        

    data = jsonify(result=result,score=score,word=word)
    return data

@app.route('/game_stats', methods=["POST"])
def game_statistics():
    """Post request to update number of times user has played and users highscore"""

    
    score = request.get_json()
    user_score = score['userscore']
    
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(user_score, highscore)
    
    return jsonify(brokeRecord=user_score > highscore)

