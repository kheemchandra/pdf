// import changeColor from './utils'

// const {changeColor} = require('./utils')

const iframe = document.createElement('iframe')
iframe.onload = (e) => {
    e.target.contentDocument.body.insertAdjacentHTML('beforeend', '<p>This works</p>')
}

const h1 = document.querySelector('h1')
h1.style.color = 'red'

const body = document.body
body.insertAdjacentHTML('beforeend', '<p>This works</p>')
body.append(iframe)