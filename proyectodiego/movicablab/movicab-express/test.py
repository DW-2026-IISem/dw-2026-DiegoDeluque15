import urllib.request
import urllib.error
import json

def request(url, headers={}, method="GET", data=None):
    req = urllib.request.Request(url, headers=headers, method=method, data=data)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, {}

print("=== 401 Tests ===")
status_tarifa, _ = request("http://localhost:4000/api/tarifas")
print("Tarifa:", status_tarifa)
status_liq, _ = request("http://localhost:4000/api/liquidaciones")
print("Liquidacion:", status_liq)

print("=== Login ===")
data = json.dumps({"email": "admin@admin.com", "password": "Admin123!"}).encode()
status_login, body = request("http://localhost:4000/api/sesion/login", headers={"Content-Type": "application/json"}, method="POST", data=data)
if status_login != 200:
    data = json.dumps({"email": "admin@movicab.com", "password": "Admin123!"}).encode()
    status_login, body = request("http://localhost:4000/api/sesion/login", headers={"Content-Type": "application/json"}, method="POST", data=data)

print("Login status:", status_login)
token = body.get("access_token")

print("=== 200 Tests ===")
headers = {"Authorization": f"Bearer {token}"}
status_tarifa_auth, _ = request("http://localhost:4000/api/tarifas", headers=headers)
print("Tarifa Auth:", status_tarifa_auth)
status_liq_auth, _ = request("http://localhost:4000/api/liquidaciones", headers=headers)
print("Liquidacion Auth:", status_liq_auth)
