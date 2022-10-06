from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField, TimeField, DecimalField
from wtforms.validators import DataRequired, Length, NumberRange


class UserAddForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])

class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])

class UserEditForm(FlaskForm):
    """Form to edit user and update details"""

    username = StringField('Username')
    bedtime = TimeField('Your desired bedtime')
    imdb_rating = DecimalField('Your IMDB rating standard', places=1, validators=[NumberRange(min=0, max=10)], render_kw={"placeholder": "Pick a number between 0 and 10 stars"})
    rt_rating = IntegerField('Your Rotten Tomatoes rating standard', render_kw={"placeholder": "0-100%"})

class MovieSearchForm(FlaskForm):
    """Form that searches API and sends back results"""

    movie = StringField('', validators=[DataRequired()], render_kw={"placeholder": "Search for your movie!"})