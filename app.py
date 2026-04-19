from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit-booking', methods=['POST'])
def submit_booking():
    return jsonify({'status': 'success'})

@app.route('/submit-request', methods=['POST'])
def submit_request():
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
