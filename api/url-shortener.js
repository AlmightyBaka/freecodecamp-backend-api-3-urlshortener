let newUrl = url => {
    
}

let getUrl = url => {
    
}

let newUrlApi = (req, res) => {
    res.status(200).send()
}

let getUrlApi = (req, res) => {
    res.status(200).send()
}

let urlShortener = (app, db) => {
    app.get('/new/:url', newUrlApi)
    app.get('/:url', getUrlApi)
}

module.exports = urlShortener