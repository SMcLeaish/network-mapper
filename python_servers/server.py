from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import docx
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")  # Load English tokenizer, tagger, parser, NER and word vectors

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']  # get the file
    filename = secure_filename(file.filename)  # optional step to make filename safe
    file.save('./docs/' + filename)  # save file to disk

    doc = docx.Document('./docs/' + filename)
    fullText = []
    for paragraph in doc.paragraphs:
        fullText.append(paragraph.text)
    text = ' '.join(fullText)

    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]

    return jsonify({'entities': entities})  # returns named entities
if __name__ == '__main__':
    app.run(port=8000)
