from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import networkx as nx
import json

app = Flask(__name__)
CORS(app)

# Define the graph construction logic
def construct_graph(data):
    # Create a new directed graph
    g = nx.DiGraph()

    # Add nodes
    for node in data['nodes']:
        g.add_node(node['id'], **node)

    # Add edges
    for edge in data['edges']:
        g.add_edge(edge['source'], edge['target'], relationship=edge['relationship'])

    # Calculate graph metrics
    degree_centrality = nx.degree_centrality(g)
    closeness_centrality = nx.closeness_centrality(g)
    betweenness_centrality = nx.betweenness_centrality(g)
    # clustering_coefficient = nx.clustering(g)

    # Update nodes with metric data
    for node in g.nodes(data=True):
        node[1]['degreeCentrality'] = degree_centrality[node[0]]
        node[1]['closenessCentrality'] = closeness_centrality[node[0]]
        node[1]['betweennessCentrality'] = betweenness_centrality[node[0]]
        # node[1]['clusteringCoefficient'] = clustering_coefficient[node[0]]

    # Return the graph data
    return nx.node_link_data(g)

@app.route("/process-network/<name>", methods=['GET'])
def process_network(name):
    # Fetch the network data
    response = requests.get(f"http://localhost:3001/network/{name}")

    # Construct the graph
    data = response.json()
    processed_data = construct_graph(data)

    # Pretty-print the processed data
    print(json.dumps(processed_data, indent=4))

    # Return the processed data
    return jsonify(processed_data)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
