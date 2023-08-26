
if ! command -v openssl &> /dev/null; then
    echo "OpenSSL could not be found."
    echo "Please install OpenSSL."
    exit
fi

DIR="../ssl"
mkdir -p $DIR

if [ ! -f $DIR/rootCA.key ]; then
    openssl genpkey -algorithm RSA -out $DIR/rootCA.key
    openssl req -x509 -sha256 -new -nodes -key $DIR/rootCA.key -days 365 -out $DIR/rootCA.pem -subj "/CN=My Local CA"
fi

if [ ! -f $DIR/server.key ]; then
    openssl genpkey -algorithm RSA -out $DIR/server.key
fi

openssl req -new -key $DIR/server.key -out $DIR/server.csr -subj "/CN=localhost" -config ./san.cnf

openssl x509 -req -in $DIR/server.csr -CA $DIR/rootCA.pem -CAkey $DIR/rootCA.key -CAcreateserial -out $DIR/server.crt -days 365 -sha256 -extensions v3_req -extfile ./san.cnf

echo "Root CA, server key, and server certificate have been generated in the ./ssl directory."
