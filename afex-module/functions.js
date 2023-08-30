fetch('https://xyyyukxba8.execute-api.sa-east-1.amazonaws.com/videos', {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "uid": 'MOq0s9G-Uyg', 'title': "smoke", "desc": "OI", "length": "PT34M4S"})
})
   .then(response => response.json())
   .then(response => console.log(JSON.stringify(response)))