async function run() {
  const loginRes = await fetch('http://localhost:4000/api/sesion/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'admin', password: 'Admin123!' })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginRes.status, loginData.access_token ? 'Success' : loginData);
  
  const token = loginData.access_token;
  
  const tarifa401 = await fetch('http://localhost:4000/api/tarifas');
  console.log('Tarifa 401:', tarifa401.status);
  
  const liq401 = await fetch('http://localhost:4000/api/liquidaciones');
  console.log('Liquidacion 401:', liq401.status);
  
  const tarifa200 = await fetch('http://localhost:4000/api/tarifas', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Tarifa 200:', tarifa200.status);
  
  const liq200 = await fetch('http://localhost:4000/api/liquidaciones', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('Liquidacion 200:', liq200.status);
}
run();
