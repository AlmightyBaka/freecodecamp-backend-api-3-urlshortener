const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    id: Number,
    url: String
}),
Url = mongoose.model('Url', urlSchema)

let id = 0

const isValidUrl = url => {
    const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

const newUrl = url => {
    return new Promise((resolve, reject) => {
        if(!isValidUrl(url)) {
            resolve(`${url} doesn't seems to be a valid url!`)
        }
        
        const newUrl = new Url({
            id,
            url
        })
        
        newUrl.save((err, newUrl) => {
            if (err) {
                reject(`error: ${err}`)
            }
            
            console.log(`new url saved: ${newUrl}`)
            
            resolve({
                'original_url': url,
                'short_url': process.env.APP_URL + id
            })
            
            id += 1
        })
    })
}

const getUrl = id => {
    return new Promise((resolve, reject) => {
        Url.findOne({id}, 'url', (err, url) => {
            if (err) {
                reject(err)
            }
            
            if (url) {
                console.log(`url #${id} found: ${url}`)
                
                if(!isValidUrl(url.url)) {
                    console.log(`... but it doesn't seems to be a valid one`)

                    resolve({
                        passed: false,
                        result: `${url.url} (#${id}) doesn't seems to be a valid url!`
                    })
                }
                
                resolve({
                    passed: true,
                    result: url
                })
            }
            else {
                console.log(`url #${id} not found`)                
                
                resolve({
                    passed: false,
                    result: `url #${id} not found!`
                })
            }
        })
    })
}

const newUrlApi = async (req, res) => {
    let saveResult = await newUrl(req.url.slice(5))
    
    res.status(200).send(saveResult)
}

const getUrlApi = async (req, res) => {
    let url = await getUrl(req.params.id)
    
    if (url.passed) {
        
        res.redirect(url.result.url)
    }
    else {
        res.status(200).send(url.result)
    }
}

const urlShortener = (app) => {
    app.get('/new/:url*', newUrlApi)
    app.get('/:id', getUrlApi)
}

module.exports = urlShortener