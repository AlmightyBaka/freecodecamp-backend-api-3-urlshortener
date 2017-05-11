const app = require('express')()

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`running on http://localhost:${port}`)
})

app.get('/api/whoami', (req, res) => {
    res.status(200).send({
        'ipaddress': req.ip,
        'language': req.acceptsLanguages()[0],
        'software': req.get('User-Agent')
            .split('(')[1]
            .split(')')[0]
    })
})