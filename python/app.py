from flask import (
    Flask,
    request,
    jsonify,
    send_file,
    redirect,
    url_for,
    abort,
    render_template,
    after_this_request,
)
from flask_cors import CORS
import os
from PIL import Image
import io
import pillow_avif

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "static/converted"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def convert_to_avif(input_image_path, output_image_path):
    img = Image.open(input_image_path)
    img.save(output_image_path, "AVIF")


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"status": "error", "message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = file.filename
        input_file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(input_file_path)
        print("File uploaded")

        response = {"status": "30%", "filename": filename}

        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            output_file_path = os.path.join(
                CONVERTED_FOLDER, os.path.splitext(filename)[0] + ".avif"
            )
            convert_to_avif(input_file_path, output_file_path)
            print("Converted to AVIF")

            response["status"] = "60%"
            response["filename"] = os.path.splitext(filename)[0] + ".avif"

            try:
                os.remove(input_file_path)
                response["status"] = "100%"
            except Exception as error:
                print(f"Error deleting file: {error}")
                return (
                    jsonify(
                        {"status": "error", "message": f"Error deleting file: {error}"}
                    ),
                    500,
                )

            return jsonify(response)

    return jsonify({"status": "error", "message": "Invalid file format"}), 400


@app.route("/view/<filename>")
def view_image(filename):
    return render_template("view.html", filename=filename)


@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    filepath = os.path.join(CONVERTED_FOLDER, filename)

    if not os.path.isfile(filepath):
        abort(404)  # Return 404 if the file is not found

    @after_this_request
    def remove_file(response):
        try:
            os.remove(filepath)
        except Exception as error:
            print(f"Error deleting file: {error}")
        return response

    with open(filepath, "rb") as file:
        file_data = file.read()

    return send_file(io.BytesIO(file_data), as_attachment=True, download_name=filename)


if __name__ == "__main__":
    app.run(debug=True)
