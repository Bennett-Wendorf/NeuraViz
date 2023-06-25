from flask import Flask, send_from_directory
import random

app = Flask(__name__)

# Main page
@app.route('/')
def index():
    return send_from_directory('../frontend/public', 'index.html')

# Static files
@app.route('/<path:path>')
def home(path):
    return send_from_directory('../frontend/public', path)

@app.route('/api/rand')
def rand():
    return str(random.randint(0, 100))

if __name__ == "__main__":
    app.run(debug=True)