from http.server import HTTPServer, SimpleHTTPRequestHandler
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

class GameServer(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    try:
        port = 6000
        server_address = ('', port)
        httpd = HTTPServer(server_address, GameServer)
        logger.info(f'Starting server on port {port}...')
        httpd.serve_forever()
    except Exception as e:
        logger.error(f'Server error: {e}')
        sys.exit(1)

if __name__ == '__main__':
    run_server() 