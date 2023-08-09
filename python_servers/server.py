from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import networkx as nx
from networkx.algorithms.cluster import clustering
import community as community_louvain
import json

app = Flask(__name__)
CORS(app)

def calculate_metrics(g):
    metrics = {
        "degreeCentrality": nx.degree_centrality(g),
        "closenessCentrality": nx.closeness_centrality(g),
        "betweennessCentrality": nx.betweenness_centrality(g),
        "clusteringCoefficient": clustering(g),
        "community": community_louvain.best_partition(g)
    }
    # Add more metrics as needed
    return metrics

# Define the graph construction logic
def construct_graph(data):
    # Create a new directed graph
    g = nx.Graph()

    # Add nodes
    for node in data['nodes']:
        g.add_node(node['id'], label=node['name'], type=node['type'])

    # Add edges
    for edge in data['edges']:
        g.add_edge(edge['source'], edge['target'])

    metrics = calculate_metrics(g)
    for node in g.nodes(data=True):
        for metric, values in metrics.items():
            node[1][metric] = values[node[0]]

    # Return the graph data
    return nx.node_link_data(g)

@app.route("/process-network/<name>", methods=['GET'])
def process_network(name):
    # Fetch the network data
    response = requests.get(f"http://localhost:3001/network/{name}")

    # Construct the graph
    data = response.json()
    processed_data = construct_graph(data)
    processed_data["availableMetrics"] = {
        "degreeCentrality": "Degree Centrality",
        "closenessCentrality": "Closeness Centrality",
        "betweennessCentrality": "Betweenness Centrality",
        "clusteringCoefficient": "Clustering Coefficient",
        "community": "Community"
    }

    # Pretty-print the processed data
    print(json.dumps(processed_data, indent=4))

    # Return the processed data
    return jsonify(processed_data)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
