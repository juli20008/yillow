import os
from flask import Flask, render_template, request, session, redirect, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager

from .socket import socketio
from .models import db, User
from .api.auth_routes import auth_routes
from .api.property_routes import property_routes
from .api.agent_routes import agent_routes
from .api.appointment_routes import appointment_routes
from .api.review_routes import review_routes
from .api.search_routes import search_routes
from .api.service_area_routes import service_area_routes
from .api.channel_routes import channel_routes
from .api.mls_agent_routes import mls_agent_routes
from .api.mls_listing_routes import mls_listing_routes

from .seeds import seed_commands
from .commands import repliers_commands

from .config import Config

app = Flask(__name__)

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(property_routes, url_prefix='/api/properties')
app.register_blueprint(agent_routes, url_prefix='/api/agents')
app.register_blueprint(appointment_routes, url_prefix='/api/appointments')
app.register_blueprint(review_routes, url_prefix='/api/reviews')
app.register_blueprint(search_routes, url_prefix='/api/search')
app.register_blueprint(service_area_routes, url_prefix='/api/service_areas')
app.register_blueprint(channel_routes, url_prefix='/api/channels')
app.register_blueprint(mls_agent_routes, url_prefix='/api/mls-agents')
app.register_blueprint(mls_listing_routes, url_prefix='/api/listings')
app.cli.add_command(repliers_commands)
db.init_app(app)
Migrate(app, db)
socketio.init_app(app)

# Application Security
# FRONTEND_URL is set in Render env vars (e.g. https://yillow.vercel.app).
# Falls back to localhost:3000 for local development.
_allowed_origins = [
    o.strip()
    for o in os.environ.get("FRONTEND_URL", "http://localhost:3000").split(",")
    if o.strip()
]
CORS(app, origins=_allowed_origins, supports_credentials=True)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    try:
        return app.send_static_file('index.html')
    except Exception:
        return jsonify({'error': 'Frontend not built'}), 404

@app.route('/debug-migrate')
def debug_migrate():
    secret = request.args.get('secret', '')
    if secret != os.environ.get('MIGRATE_SECRET', ''):
        return jsonify({'error': 'Forbidden'}), 403
    try:
        from flask_migrate import upgrade
        upgrade()
        return jsonify({'status': 'Migration complete'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    socketio.run(app)
