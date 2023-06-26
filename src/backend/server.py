from quart import Quart, send_from_directory
import random

app = Quart(__name__)

# Main page
@app.route('/')
async def index():
    return await send_from_directory('../frontend/public', 'index.html')

# Static files
@app.route('/<path:path>')
async def home(path):
    return await send_from_directory('../frontend/public', path)

@app.route('/api/rand')
def rand():
    return str(random.randint(0, 100))

if __name__ == "__main__":
    app.run(debug=True)