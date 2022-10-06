from flask import Flask, render_template, flash, redirect, session, g
from sqlalchemy.exc import IntegrityError
from forms import UserAddForm, LoginForm, UserEditForm, MovieSearchForm
from models import db, connect_db, User
from key import API_KEY
from datetime import datetime
import requests
import os

CURR_USER_KEY = "curr_user"


app = Flask(__name__)

app.config['DATABASE_URL'] = f"postgresql://${{ PGUSER }}:${{ PGPASSWORD }}@${{ PGHOST }}:${{ PGPORT }}/${{ PGDATABASE }}"
app.config['PGDATABASE'] = 'railway'
app.config['PGHOST'] = 'containers-us-west-71.railway.app'
app.config['PGPASSWORD'] = 'vhFV3YEIQJuXrp5KKb5d'
app.config['PGPORT'] = 6322
app.config['PGUSER'] = 'postgres'

# app.config[
#     "SQLALCHEMY_DATABASE_URI"
# ] = "postgresql://postgres:password@127.0.0.1:5432/play_or_nay"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config["SECRET_KEY"] = "password"

connect_db(app)

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None

def user_login(user):
    """Log in user."""
    session[CURR_USER_KEY] = user.id

def user_logout():
    """Logout user."""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

####### HOMEPAGE & USER HANDLING #############
@app.route("/")
def homepage():
    """Show homepage"""
    form=MovieSearchForm()
    now = datetime.now()
    time = now.strftime("%I:%M %p")
    if g.user:
        if g.user.bedtime:
            user_bedtime = g.user.bedtime.strftime("%I:%M %p")
            return render_template("index.html", form=form, time=time, user_bedtime=user_bedtime)
        else:
            return render_template("index.html", form=form, time=time)
    else:
        return render_template("index.html", form=form, time=time)

@app.route("/signup", methods=['GET', 'POST'])
def user_signup():
    form = UserAddForm()

    if form.validate_on_submit():
        try:
            username = form.username.data
            password = form.password.data
            new_user = User.signup(username, password)
            db.session.add(new_user)
            db.session.commit()

        except IntegrityError:
            flash('Username already exists!', "danger")
            return render_template('signup.html', form=form)

        user_login(new_user)
        flash(f'Welcome {new_user.username}! You successfully created Your account!', "success")
        return redirect('/')

    else:
        return render_template('signup.html', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login_user():

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)
        
        if user:
            user_login(user)
            flash(f"Welcome Back {user.username}!", "primary")
            return redirect('/')

        flash("Invalid credentials.", 'danger')

    return render_template("login.html", form=form)

@app.route("/logout")
def logout_user():
    user_logout()
    flash("You have logged out.", "primary")
    return redirect('/')


############# USER PROFILE EDITING #########################

@app.route("/users/<int:id>", methods=["GET", "POST"])
def show_user(id):

    if not g.user:
        flash("Access unauthorized. You must create an account or login first!", "danger")
        return redirect("/")

    user = g.user
    form = UserEditForm(obj=user)

    if form.validate_on_submit():
        user.username = form.username.data
        user.bedtime = form.bedtime.data
        user.imdb_rating = form.imdb_rating.data
        user.rt_rating = form.rt_rating.data
        db.session.commit()
        flash("Your settings have been updated!", 'primary')
        return redirect("/")

    return render_template('user.html', form=form, user=user)

################# API REQUESTS ##########################

@app.route("/movie_search", methods=["GET", "POST"])
def load_movie():
    form=MovieSearchForm()
    API_URL = 'http://www.omdbapi.com/?'
    search_term = form.movie.data
    res = requests.get(API_URL, params={'apikey': API_KEY, 't': search_term})
    data = res.json()

    now = datetime.now()
    time = now.strftime("%I:%M %p")
    if g.user:
        if g.user.bedtime:
            user_bedtime = g.user.bedtime.strftime("%I:%M %p")
            return render_template("index.html", form=form, time=time, user_bedtime=user_bedtime, data=data)
        else:
            return render_template("index.html", form=form, time=time, data=data)
    else:
        return render_template("index.html", form=form, time=time, data=data)
