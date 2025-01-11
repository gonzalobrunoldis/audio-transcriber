import os
import time
import soundcard as sc
import soundfile as sf
from flask import Flask, render_template, jsonify, send_file
from threading import Thread

app = Flask(__name__)

# Global variables
recording = False
recorded_files = []
output_directory = "recordings"

# Ensure output directory exists
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

def record_audio():
    global recording, recorded_files
    SAMPLE_RATE = 48000  # Hz
    RECORD_CHUNK = 1024
    output_file = os.path.join(output_directory, f"recording_{int(time.time())}.wav")

    with sc.get_microphone(id=str(sc.default_speaker().name), include_loopback=True).recorder(samplerate=SAMPLE_RATE) as mic:
        with sf.SoundFile(output_file, mode='w', samplerate=SAMPLE_RATE, channels=2) as file:
            while recording:
                data = mic.record(numframes=RECORD_CHUNK)
                file.write(data)

    recorded_files.append(os.path.basename(output_file))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global recording
    if not recording:
        recording = True
        Thread(target=record_audio).start()
        return jsonify({"status": "success", "message": "Recording started"})
    return jsonify({"status": "error", "message": "Already recording"})

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global recording
    recording = False
    return jsonify({"status": "success", "message": "Recording stopped"})

@app.route('/get_recordings')
def get_recordings():
    files = os.listdir(output_directory)
    files.sort(reverse=True)
    return jsonify(files)

@app.route('/play/<filename>')
def play_recording(filename):
    return send_file(os.path.join(output_directory, filename))

@app.route('/delete/<filename>', methods=['POST'])
def delete_recording(filename):
    try:
        file_path = os.path.join(output_directory, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"status": "success", "message": "File deleted"})
        return jsonify({"status": "error", "message": "File not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
